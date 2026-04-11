import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login(email, nick) {
    setUser({ email, nick });
    setIsAuthenticated(true);
  }

  function register(email, nick) {
    setUser({ email, nick });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}