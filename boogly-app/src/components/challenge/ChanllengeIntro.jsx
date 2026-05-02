import { useState } from "react";
import { useTheme } from "../../theme/useTheme";

export function ChallengeIntro({ challenge, onStart }) {
  const [tab, setTab] = useState("descricao");
  const { theme } = useTheme();

  const test = challenge.testCases[0];

  return (
    <div
      className="h-full flex items-center justify-center p-4"
      style={{ background: theme.background }}
    >
      <div
        className="w-full max-w-4xl h-full max-h-[500px] rounded-2xl shadow-xl flex flex-col overflow-hidden"
        style={{
          background: theme.panel,
          color: theme.text,
          border: `1px solid ${theme.border}`
        }}
      >

        {/* HEADER */}
        <div
          className="px-5 py-3 text-lg font-bold shrink-0"
          style={{
            background: theme.primary,
            color: "#fff"
          }}
        >
          {challenge.title}
        </div>

        {/* TABS */}
        <div
          className="flex border-b shrink-0"
          style={{ borderColor: theme.border }}
        >
          {["descricao", "entrada", "regras"].map((t) => {
            const active = tab === t;

            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 text-sm font-semibold transition"
                style={{
                  color: active ? theme.primary : theme.muted,
                  borderBottom: active
                    ? `2px solid ${theme.primary}`
                    : "2px solid transparent"
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div
          className="flex-1 p-4 text-sm overflow-hidden"
          style={{ color: theme.text }}
        >

          {/* DESCRIÇÃO */}
          {tab === "descricao" && (
            <p
              className="leading-relaxed line-clamp-4"
              style={{ color: theme.text }}
            >
              {challenge.description}
            </p>
          )}

          {/* ENTRADA */}
          {tab === "entrada" && (
            <div className="space-y-3">

              <div>
                <span style={{ color: theme.text }} className="font-semibold">
                  Entrada:
                </span>

                <div
                  className="mt-1 p-2 rounded text-xs break-words"
                  style={{
                    background: theme.primary,
                    color: "#fff"
                  }}
                >
                  {JSON.stringify(test.input)}
                </div>
              </div>

              <div>
                <span style={{ color: theme.text }} className="font-semibold">
                  Saída:
                </span>

                <div
                  className="mt-1 p-2 rounded text-xs break-words"
                  style={{
                    background: theme.warning,
                    color: "#000"
                  }}
                >
                  {JSON.stringify(test.expectedOutput)}
                </div>
              </div>

            </div>
          )}

          {/* REGRAS */}
          {tab === "regras" && (
            <ul className="space-y-2 text-xs">
              {challenge.rules.map((r, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span style={{ color: theme.success }}>✔</span>
                  <span
                    className="truncate"
                    style={{ color: theme.text }}
                  >
                    {r.description}
                  </span>
                </li>
              ))}
            </ul>
          )}

        </div>

        {/* FOOTER */}
        <div
          className="p-3 border-t flex justify-center shrink-0"
          style={{ borderColor: theme.border }}
        >
          <button
            onClick={onStart}
            className="px-5 py-2 rounded-lg font-semibold transition"
            style={{
              background: theme.primary,
              color: "#fff"
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = theme.hover)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = theme.primary)
            }
          >
            Começar desafio
          </button>
        </div>

      </div>
    </div>
  );
}