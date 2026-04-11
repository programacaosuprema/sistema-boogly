import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);

  function login(email, nick) {
    setUser({ email, nick });
    setGuest(false);
  }

  function register(email, nick) {
    setUser({ email, nick });
    setGuest(false);
  }

  function loginAsGuest() {
    setUser({ nick: "Visitante" });
    setGuest(true);
  }

  function logout() {
    setUser(null);
    setGuest(false);
  }

  return (
    <AuthContext.Provider value={{ user, guest, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}