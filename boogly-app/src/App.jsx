import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./autenticator/useAuth";

import Home from "./components/pages/Home";
import MainApp from "./components/pages/MainApp";
import EditorPage from "./components/pages/EditorPage";

import ChallengePage from "./components/challenge/ChallengePage";
import ChallengeDetail from "./components/challenge/ChallengeDetail";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* APP (LAYOUT PROTEGIDO) */}
      <Route
        path="/app"
        element={
          isAuthenticated ? <MainApp /> : <Navigate to="/" />
        }
      >

        {/* EDITOR */}
        <Route index element={<EditorPage />} />

        {/* LISTA DE DESAFIOS */}
        <Route path="challenges" element={<ChallengePage />} />

        {/* 🔥 DETALHE DO DESAFIO */}
        <Route path="challenges/:id" element={<ChallengeDetail />} />

      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}