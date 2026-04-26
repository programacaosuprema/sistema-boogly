import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../autenticator/AuthContext";
import { AppContext } from "../app_configuration/AppContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [structure, setStructure] = useState("list");
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { domainUrl } = useContext(AppContext);

  // 🔥 RESTAURA SESSÃO AO ABRIR APP
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingAuth(false);
      return;
    }

    async function loadUser() {
      try {
        const res = await fetch(`${domainUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setUser(data);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    }

    loadUser();
  }, [domainUrl]);

  // 🔥 LOGIN (email ou nickname)
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

    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  }

  function loginAsGuest() {
    setUser({ nickname: "Visitante" });
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }

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
        setStructure,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}