import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./autenticator/useAuth";

import Home from "./pages/Home";
import MainApp from "./pages/MainApp";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* APP PROTEGIDO */}
      <Route
        path="/app"
        element={
          isAuthenticated ? <MainApp /> : <Navigate to="/" />
        }
      />

    </Routes>
  );
}