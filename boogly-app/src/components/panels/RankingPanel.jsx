import { useTheme } from "../../theme/useTheme";

export default function RankingPanel({ ranking = [] }) {
  const { theme } = useTheme();

  if (!ranking || ranking.length === 0) {
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
      <h3
        className="text-xl font-bold"
        style={{ color: theme.text }}
      >
        🏆 Ranking
      </h3>

      {/* 📊 LISTA */}
      <div className="flex flex-col gap-2">

        {ranking.map((user, index) => {
          const isTop = index < 3;

          return (
            <div
              key={user.id || index}
              className="flex items-center justify-between px-4 py-2 rounded-lg transition"
              style={{
                background: isTop
                  ? `${theme.primary}15`
                  : theme.card,
                border: `1px solid ${theme.border}`
              }}
            >

              {/* POSIÇÃO + NOME */}
              <div className="flex items-center gap-3">

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: isTop ? theme.primary : theme.muted
                  }}
                >
                  #{index + 1}
                </span>

                <span
                  className="font-medium"
                  style={{ color: theme.text }}
                >
                  {user.name}
                </span>

              </div>

              {/* PONTOS */}
              <span
                className="text-sm font-semibold"
                style={{ color: theme.success }}
              >
                {user.points} pts
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}