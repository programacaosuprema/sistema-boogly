import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { AppContext } from "../app_configuration/AppContext";
import { clearGuestWorkspaces } from "../blockly/workspaceStorage";

// Provider que expõe user, token, authenticate, loginAsGuest, logout, setStructure, setUser (update)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [structure, setStructure] = useState();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { domainUrl } = useContext(AppContext);

  // helper para buscar /users/me e atualizar user local
  const fetchAndSetUser = useCallback(async (token) => {
    try {
      const res = await fetch(`${domainUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Falha ao buscar usuário");
      }

      const data = await res.json();
      setUser(data);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      // limpeza em caso de token inválido
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, [domainUrl]);

  // restaura sessão no load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingAuth(false);
      return;
    }

    (async () => {
      await fetchAndSetUser(token);
      setLoadingAuth(false);
    })();
  }, [fetchAndSetUser]);

  // LOGIN (email/nick) -> unificado com backend
  async function authenticate(identifier) {
    const res = await fetch(`${domainUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: identifier }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro na autenticação");
    }

    // guarda token e busca user completo
    localStorage.setItem("token", data.token);
    await fetchAndSetUser(data.token);
  }

  // LOGIN COMO VISITANTE
  async function loginAsGuest() {
    const res = await fetch(`${domainUrl}/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro ao entrar como visitante");
    }

    localStorage.setItem("token", data.token);

    // o backend geralmente já retorna user, mas para uniformidade pede /users/me
    // se a sua API retorna user completo, você pode usar data.user direto
    const userFromApi = data.user ?? (await fetchAndSetUser(data.token));
    setUser(userFromApi ?? data.user);
    setIsAuthenticated(true);
  }

  // LOGOUT
  function logout() {
    // se era visitante, limpa workspaces etc
    if (user?.guest === true) {
      try {
        clearGuestWorkspaces();
      } catch (err) {
        console.warn("Erro limpando workspaces guest:", err);
      }
    }

    // limpa token e session/local storage relacionados
    localStorage.removeItem("token");
    sessionStorage.removeItem("onboarding_done");
    // se você usou localStorage para onboarding dos guests, remova também:
    localStorage.removeItem("onboarding_done");

    setUser(null);
    setIsAuthenticated(false);
    setStructure(undefined);
  }

  // permite atualizar user (útil depois do onboarding para refletir mudança)
  const updateUser = (patch) => {
    setUser(prev => prev ? { ...prev, ...patch } : prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: localStorage.getItem("token"),
        isAuthenticated,
        loadingAuth,

        authenticate,
        loginAsGuest,
        logout,

        structure,
        setStructure,

        setUser: updateUser // expõe função para atualizar user localmente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}