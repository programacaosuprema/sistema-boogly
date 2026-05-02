import { useApp } from "../../app_configuration/useApp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../autenticator/useAuth";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import ActionButton from "../../components/ui/ActionButton";
import { LogOut, Trophy, Target, Star } from "lucide-react";

const STRUCTURE_LABELS = {
  list: "Lista",
  stack: "Pilha",
  queue: "Fila",
};

export default function Header({ structure }) {
  const { theme, themeName, setThemeName } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const mode = STRUCTURE_LABELS[structure] || "Lista";
  const { appName } = useApp();
  const location = useLocation();

  const isChallengePage = location.pathname.startsWith("/app/challenges");

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div
      className="w-full h-full flex items-center justify-between px-6"
      style={{
        background: theme.background,
        color: theme.text
      }}
    >
      {/* 🔥 ESQUERDA → LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-md" />
        <h1
          className="text-lg font-semibold"
          style={{ color: theme.text }}
        >
          {appName.toUpperCase()}
        </h1>
      </div>

      {/* 🔥 DIREITA */}
      <div className="flex items-center gap-3">

        {/* PLAYER */}
        <span style={{ color: theme.text }}>
          {user ? `👤 ${user.nickname.toUpperCase()}` : "Não logado"}
        </span>

        {/* MODO */}
        <div
          className="px-4 py-2 rounded-full text-sm"
          style={{
            background: theme.card,
            color: theme.text
          }}
        >
          modo: <span className="font-semibold">{mode}</span>
        </div>

        {/* PONTOS */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{
            background: theme.card,
            color: theme.text
          }}
        >
          <Star className="w-4 h-4" style={{ color: theme.warning }} />
          {user?.points ?? 0} pontos
        </div>

        {/* DESAFIOS */}
        {!isChallengePage && (
          <ActionButton
            onClick={() => navigate("/app/challenges", { state: { structure } })}
            icon={Target}
          >
            desafios {mode.toLowerCase()}
          </ActionButton>
        )}

        {/* RANKING */}
        <ActionButton icon={Trophy}>
          ranking
        </ActionButton>

        {/* THEME SELECT */}
        <select
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          className="text-sm px-3 py-1 rounded-lg"
          style={{
            background: theme.toolbox,
            color: theme.text
          }}
        >
          <option value="light">🌞 Claro</option>
          <option value="dark">🌙 Escuro</option>
          <option value="colorful">🎨 Colorido</option>
        </select>

        {/* LOGOUT */}
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