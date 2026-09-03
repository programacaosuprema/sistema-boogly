// src/components/header/Header.jsx
import { useApp } from "../../app_configuration/useApp";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../autenticator/useAuth";
import { useTheme } from "../../theme/useTheme";
import ActionButton from "../../components/ui/ActionButton";
import { LogOut, Trophy, Target, Star } from "lucide-react";

const STRUCTURE_LABELS = {
  list: "Lista",
  stack: "Pilha",
  queue: "Fila",
};

export default function Header({ structure }) {
  const { theme, themeName = "dark", setThemeName } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { appName } = useApp();
  const location = useLocation();

  const mode = STRUCTURE_LABELS[structure] || "Lista";
  const isChallengePage = location.pathname.startsWith("/app/challenges");

  // 🔒 nickname seguro
  const nickname = user?.nickname ? user.nickname.toUpperCase() : "VISITANTE";

  async function handleLogout() {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  return (
    <div
      className="w-full h-full flex items-center justify-between px-6"
      style={{
        background: theme.background,
        color: theme.text
      }}
    >
      <div
        className="flex items-center"
        style={{ gap: theme.spacing.md }}
      >
        {/* LOGO NORMAL (SEM FUNDO / SEM BORDA) */}
        <img
          src={theme.logo}
          alt="NóLab"
          style={{
            width: "42px",
            height: "42px",
            objectFit: "contain"
          }}
        />

        {/* NOME GRANDE */}
        <div
          key={theme.name}
          style={{
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "1px",
            fontFamily: "Poppins, Inter, sans-serif",
            color: theme.primary
          }}
        >
          {(appName || "Nó Lab").toUpperCase()}
        </div>
      </div>

      {/* 🔥 DIREITA */}
      <div className="flex items-center gap-3">

        {/* 👤 USER */}
        <span>
          👤 {nickname}
        </span>

        {/* 🎮 MODO */}
        <div
          className="px-4 py-2 rounded-full text-sm"
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`
          }}
        >
          modo: <span className="font-semibold">{mode}</span>
        </div>

        {/* 🎯 DESAFIOS */}
        {!isChallengePage && (
          <ActionButton
            // atributos que o GuidedTour procura — data-tour e id/class como fallback
            data-tour="challenges"
            id="nav-challenges"
            className="nav-challenges"
            aria-label={`Ir para desafios ${mode}`}
            onClick={() =>
              navigate(`/app/challenges?structure=${structure}`)
            }
            icon={Target}
          >
            desafios {mode.toLowerCase()}
          </ActionButton>
        )}

        {/* 🎨 THEME */}
        <select
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          className="text-sm px-3 py-1 rounded-lg outline-none"
          style={{
            background: theme.toolbox,
            color: theme.text,
            border: `1px solid ${theme.border}`
          }}
        >
          <option value="light">🌞 Claro</option>
          <option value="dark">🌙 Escuro</option>
          <option value="colorful">🎨 Colorido</option>
        </select>

        {/* 🚪 LOGOUT */}
        <ActionButton
          onClick={handleLogout}
          icon={LogOut}
          variant="danger"
        >
          Sair
        </ActionButton>

      </div>
    </div>
  );
}