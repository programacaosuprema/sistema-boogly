// src/autenticator/AuthProvider.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { AppContext } from "../app_configuration/AppContext";
import { clearGuestWorkspaces } from "../blockly/workspaceStorage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { domainUrl } = useContext(AppContext);

  
  const [structure, setStructure] = useState(() => {
    return localStorage.getItem("structure") || null;
  });
  
  const setStructureSafe = (value) => {
    setStructure(value);
    localStorage.setItem("structure", value);
  };

  const fetchAndSetUser = useCallback(
    async (token) => {
      try {
        const opts = token
          ? {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          : {
              method: "GET",
              credentials: "include", // usa cookie httpOnly
            };

        const res = await fetch(`${domainUrl}/users/me`, opts);

        if (!res.ok) {
          // 401/403 ou outro -> não autenticado
          throw new Error(`Falha ao buscar usuário (${res.status})`);
        }

        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        return data;
      } catch (err) {
        console.warn("[Auth] fetchAndSetUser falhou:", err && (err.message || err));
        // limpeza em caso de token inválido / cookie inválido
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    },
    [domainUrl]
  );

  // Restauração de sessão no load:
  // 1) tenta token em localStorage (token-based)
  // 2) se não existir token, tenta cookie-based (/users/me com credentials)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // tenta restaurar via token
          const u = await fetchAndSetUser(token);
          if (mounted) {
            setLoadingAuth(false);
            return;
          }
        }

        // sem token local, tenta cookie-based (ex.: cookie httpOnly)
        const userFromCookie = await fetchAndSetUser();
        if (mounted) {
          setLoadingAuth(false);
        }
        return userFromCookie;
      } catch (err) {
        console.error("[Auth] erro ao restaurar sessão:", err && (err.stack || err.message || err));
        if (mounted) {
          setLoadingAuth(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchAndSetUser]);

  // LOGIN unificado (email / nickname)
  async function authenticate(identifier) {
    try {
      const res = await fetch(`${domainUrl}/auth`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: identifier }),
        // se seu backend setar cookie, pode ser necessário `credentials: 'include'` aqui também
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro na autenticação");
      }

      // se backend retornar token, armazena (compatibilidade)
      if (data.token) {
        localStorage.setItem("token", data.token);
        await fetchAndSetUser(data.token);
      } else {
        // se backend estiver usando cookie httpOnly, buscar via cookie
        await fetchAndSetUser();
      }
    } catch (err) {
      console.error("[Auth] authenticate erro:", err && (err.stack || err.message || err));
      throw err;
    }
  }

  /**
   * loginAsGuest:
   * - chama POST /auth/guest com credentials: 'include' (recebe Set-Cookie)
   * - se backend retornar token no body, salva em localStorage (opcional)
   * - busca user pela melhor forma (token ou cookie)
   */
  async function loginAsGuest() {
    try {
      const res = await fetch(`${domainUrl}/auth/guest`, {
        method: "POST",
        credentials: "include", // ESSENCIAL para aceitar Set-Cookie cross-origin
        headers: {
          // sem body aqui; se necessário adicione JSON conforme sua API
          "Content-Type": "application/json",
        },
      });

      // tenta parsear JSON se houver content-type json
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : {};

      if (!res.ok) {
        throw new Error(data?.error || `Erro ao entrar como visitante (${res.status})`);
      }

      // se backend retornou token no body, armazene (compatibilidade)
      if (data.token) {
        localStorage.setItem("token", data.token);
        // busca usando token
        const userFromApi = data.user ?? (await fetchAndSetUser(data.token));
        setUser(userFromApi ?? data.user);
        setIsAuthenticated(true);
        return { user: userFromApi ?? data.user, token: data.token };
      }

      // caso cookie-based (sem token no body) -> buscar via cookie
      const userFromCookie = await fetchAndSetUser();
      setUser(userFromCookie);
      setIsAuthenticated(!!userFromCookie);
      return { user: userFromCookie };
    } catch (err) {
      console.error("[Auth] loginAsGuest erro:", err && (err.stack || err.message || err));
      throw err;
    }
  }

  // LOGOUT: limpa cliente e tenta invalidar cookie no backend
  async function logout() {
    try {
      // se seu backend tem rota para limpar cookie (recomendo), chame-a:
      try {
        await fetch(`${domainUrl}/auth/logout`, {
          method: "POST",
          credentials: "include", // para limpar cookie no servidor
        });
      } catch (e) {
        // swallow - continuar com limpeza local mesmo se logout remoto falhar
        console.warn("[Auth] logout: falha ao chamar API /auth/logout:", e && e.message);
      }

      if (user?.guest === true) {
        try {
          clearGuestWorkspaces();
        } catch (err) {
          console.warn("Erro limpando workspaces guest:", err);
        }
      }

      // limpeza local
      localStorage.removeItem("token");
      sessionStorage.removeItem("onboarding_done");
      localStorage.removeItem("onboarding_done");

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("structure");
      setStructure(null);
    } catch (err) {
      console.error("[Auth] logout erro:", err && err.message);
    }
  }

  // permite atualizar user (útil depois do onboarding para refletir mudança)
  const updateUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: localStorage.getItem("token"), // ainda expõe token local se existir
        isAuthenticated,
        loadingAuth,

        authenticate,
        loginAsGuest,
        logout,
        structure,
        setStructure: setStructureSafe,
        setUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}