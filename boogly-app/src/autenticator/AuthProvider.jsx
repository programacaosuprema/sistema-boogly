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

  // 🔥 estrutura persistida
  const [structure, setStructure] = useState(() => {
    return localStorage.getItem("structure") || null;
  });

  const setStructureSafe = (value) => {
    setStructure(value);
    if (value) localStorage.setItem("structure", value);
    else localStorage.removeItem("structure");
  };

  // 🔥 FUNÇÃO PRINCIPAL (SEMPRE COM COOKIE)
  const fetchAndSetUser = useCallback(async () => {
    try {
      const res = await fetch(`${domainUrl}/users/me`, {
        method: "GET",
        credentials: "include", // 🔥 OBRIGATÓRIO PRA COOKIE
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`Falha ao buscar usuário (${res.status})`);
      }

      const data = await res.json();

      setUser(data);
      setIsAuthenticated(true);

      return data;
    } catch (err) {
      console.warn("[Auth] fetchAndSetUser falhou:", err.message);

      setUser(null);
      setIsAuthenticated(false);

      return null;
    }
  }, [domainUrl]);

  // 🔥 RESTAURA SESSÃO AO ABRIR O APP
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await fetchAndSetUser();
      } catch (err) {
        console.error("[Auth] erro ao restaurar sessão:", err);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchAndSetUser]);

  // 🔥 LOGIN (EMAIL OU NICK)
  async function authenticate(identifier) {
    try {
      const res = await fetch(`${domainUrl}/auth`, {
        method: "POST",
        credentials: "include", // 🔥 ESSENCIAL
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro na autenticação");
      }

      // 🔥 NÃO USA MAIS TOKEN LOCAL
      await fetchAndSetUser();

    } catch (err) {
      console.error("[Auth] authenticate erro:", err.message);
      throw err;
    }
  }

  // 🔥 LOGIN GUEST
  async function loginAsGuest() {
    try {
      const res = await fetch(`${domainUrl}/auth/guest`, {
        method: "POST",
        credentials: "include", // 🔥 ESSENCIAL
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Erro guest (${res.status})`);
      }

      const userFromCookie = await fetchAndSetUser();

      setUser(userFromCookie);
      setIsAuthenticated(!!userFromCookie);

      return { user: userFromCookie };

    } catch (err) {
      console.error("[Auth] loginAsGuest erro:", err.message);
      throw err;
    }
  }

  // 🔥 LOGOUT
  async function logout() {
    try {
      await fetch(`${domainUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (user?.guest) {
        clearGuestWorkspaces();
      }

      sessionStorage.removeItem("onboarding_done");
      localStorage.removeItem("onboarding_done");
      localStorage.removeItem("structure");

      setUser(null);
      setIsAuthenticated(false);
      setStructure(null);

    } catch (err) {
      console.error("[Auth] logout erro:", err.message);
    }
  }

  const updateUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loadingAuth,

        authenticate,
        loginAsGuest,
        logout,

        structure,
        setStructure: setStructureSafe,

        setUser: updateUser,
        refreshUser: fetchAndSetUser // 🔥 importante
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}