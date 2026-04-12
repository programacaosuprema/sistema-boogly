import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [structure, setStructure] = useState("list"); // 🔥 NOVO

  async function register(email, nick) {
  const res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, nick }),
  });

  const data = await res.json();

  setUser(data.user);
  setIsAuthenticated(true);
}

async function login(email) {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  setUser(data.user);
  setIsAuthenticated(true);
}

  function loginAsGuest() {
    setUser({ nick: "Visitante" });
    setIsAuthenticated(true);
  }

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        loginAsGuest,
        logout,
        structure,        // 🔥
        setStructure,     // 🔥
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}