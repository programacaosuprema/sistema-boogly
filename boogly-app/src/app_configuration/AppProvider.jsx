import { useState } from "react";
import { AppContext } from "./AppContext";

export function AppProvider({ children }) {
  const [appName, setAppName] = useState("Boogly App"); // app name definition

  return (
    <AppContext.Provider value={{ appName, setAppName }}>
      {children}
    </AppContext.Provider>
  );
}