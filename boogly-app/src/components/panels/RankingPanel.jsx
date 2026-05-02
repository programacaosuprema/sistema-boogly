import { useTheme } from "../../theme/useTheme";

export default function RankingPanel({ ranking = [] }) {
  const { theme } = useTheme();

  // 🔒 SANITIZAÇÃO
  const safeRanking = Array.isArray(ranking) ? ranking : [];

  if (safeRanking.length === 0) {
    return (
      <div
        className="p-6 rounded-xl flex items-center justify-center"
        style={{
          background: theme.panel,
          border: `1px solid ${theme.border}`,
          color: theme.muted
        }}
      >
        Nenhum ranking disponível
      </div>
    );
  }

  function formatPoints(points) {
    if (!points || isNaN(points)) return "0";
    return Number(points).toLocaleString();
  }

  function getMedal(index) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  }

  return (
    <div
      className="p-6 rounded-xl flex flex-col gap-4"
      style={{
        background: theme.panel,
        border: `1px solid ${theme.border}`,
        color: theme.text
      }}
    >

      {/* 🏆 HEADER */}
      <h3 className="text-xl font-bold">
        🏆 Ranking
      </h3>

      {/* 📊 LISTA */}
      <div className="flex flex-col gap-2">

        {safeRanking.map((user, index) => {
          const isTop = index < 3;
          const medal = getMedal(index);

          const name = user?.name || "Usuário";
          const points = formatPoints(user?.points);

          return (
            <div
              key={user?.id || `${name}-${index}`}
              className="flex items-center justify-between px-4 py-2 rounded-lg transition"
              style={{
                background: isTop
                  ? `${theme.primary}20`
                  : theme.card,
                border: `1px solid ${theme.border}`,
                transform: isTop ? "scale(1.02)" : "scale(1)"
              }}
            >

              {/* ESQUERDA */}
              <div className="flex items-center gap-3">

                {/* POSIÇÃO */}
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: isTop ? theme.primary : theme.muted
                  }}
                >
                  {medal || `#${index + 1}`}
                </span>

                {/* NOME */}
                <span className="font-medium">
                  {name}
                </span>

              </div>

              {/* PONTOS */}
              <span
                className="text-sm font-semibold"
                style={{ color: theme.success }}
              >
                {points} pts
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}