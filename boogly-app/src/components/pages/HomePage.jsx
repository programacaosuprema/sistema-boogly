import { useState } from "react";
import AuthModal from "./AuthModal";
import OnboardingFlow from "./OnBoardFlow";

import { useAuth } from "../../autenticator/useAuth";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../app_configuration/useApp";
import { useError } from "../../error/useError";

import { homeTheme } from "../../theme/HomeTheme";

export default function Home() {
  const { user, loginAsGuest, setStructure } = useAuth();
  const { showError } = useError();

  const [openModal, setOpenModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const navigate = useNavigate();
  const { appName } = useApp();

  // 🚀 INICIAR FLUXO
  function handleStart(type) {
    if (!type) {
      showError({ message: "Estrutura inválida" });
      return;
    }

    if (!user) {
      setOpenModal(true);
      return;
    }

    setSelectedStructure(type);
    setShowOnboarding(true);
  }

  // 🧠 FINAL DO ONBOARDING
  function finishOnboarding() {
    if (!selectedStructure) {
      showError({ message: "Erro ao iniciar o desafio" });
      return;
    }

    try {
      setStructure(selectedStructure);
      setShowOnboarding(false);
      navigate("/app");
    } catch (err) {
      showError(err);
    }
  }

  // 👤 LOGIN GUEST
  async function handleGuest() {
    try {
      setLoadingGuest(true);
      await loginAsGuest();
    } catch (err) {
      showError(err);
    } finally {
      setLoadingGuest(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: homeTheme.background,
        color: homeTheme.text
      }}
    >

      {/* 🧠 TITLE */}
      <h1 className="text-5xl font-extrabold mb-2">
        {appName}
      </h1>

      <p className="text-lg mb-10" style={{ color: homeTheme.muted }}>
        Escolha seu primeiro desafio!
      </p>

      {/* 🧩 CARDS */}
      <div className="flex flex-wrap justify-center gap-8">

        <HomeCard
          title="Lista"
          description="Aprenda como funciona uma lista"
          gradient={homeTheme.list.gradient}
          onClick={() => handleStart("list")}
        />

        <HomeCard
          title="Pilha"
          description="Aprenda como funciona uma pilha"
          gradient={homeTheme.stack.gradient}
          onClick={() => handleStart("stack")}
        />

        <HomeCard
          title="Fila"
          description="Aprenda como funciona uma fila"
          gradient={homeTheme.queue.gradient}
          disabled
        />

      </div>

      {/* 🔥 ACTIONS */}
      <div className="mt-10 flex flex-col items-center gap-4">

        {!user && (
          <>
            <button
              onClick={() => setOpenModal(true)}
              className="px-6 py-2 rounded-lg font-semibold transition"
              style={{
                background: homeTheme.primary,
                color: "#fff"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = homeTheme.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = homeTheme.primary)
              }
            >
              Entrar / Criar Conta
            </button>

            <button
              onClick={handleGuest}
              disabled={loadingGuest}
              className="px-6 py-2 rounded-lg transition"
              style={{
                background: homeTheme.guest,
                color: "#fff",
                opacity: loadingGuest ? 0.6 : 1
              }}
            >
              {loadingGuest ? "Entrando..." : "Testar sem login"}
            </button>
          </>
        )}

        <p className="text-sm" style={{ color: homeTheme.muted }}>
          {!user
            ? "O progresso não será salvo sem login"
            : user.guest
            ? "Modo visitante ativo. Escolha uma estrutura de dados para começar."
            : `Bem-vindo, ${user.nickname}! Escolha uma estrutura de dados para estudar.`}
        </p>

      </div>

      {/* 🔐 AUTH */}
      <AuthModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      {/* 🚀 ONBOARDING */}
      {showOnboarding && (
        <OnboardingFlow onFinish={finishOnboarding} />
      )}

    </div>
  );
}

/* 🔥 CARD COMPONENT */
function HomeCard({ title, description, gradient, onClick, disabled }) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className="w-64 p-5 rounded-2xl shadow-xl transition"
      style={{
        background: gradient,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transform: "scale(1)"
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>

      <p className="text-sm mb-4" style={{ opacity: 0.9 }}>
        {description}
      </p>

      <button
        className="w-full py-2 rounded-lg font-semibold"
        style={{
          background: disabled ? "#ccc" : "#4ade80",
          color: "#000"
        }}
      >
        {disabled ? "Em breve" : "Iniciar"}
      </button>
    </div>
  );
}