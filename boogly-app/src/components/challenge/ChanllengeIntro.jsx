import { useState } from "react";
import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";

export function ChallengeIntro({ challenge, onStart }) {
  const [tab, setTab] = useState("descricao");
  const { theme } = useTheme();
  const { showError } = useError();

  // 🔒 SEGURANÇA
  if (!challenge) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: theme.warning }}
      >
        ⚠️ Desafio inválido
      </div>
    );
  }

  const test = challenge.testCases?.[0] || null;

  function handleStart() {
    if (!onStart) {
      showError({ message: "Não foi possível iniciar o desafio" });
      return;
    }

    onStart();
  }

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
          {challenge.title || "Desafio"}
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
            <p className="leading-relaxed">
              {challenge.description || "Sem descrição disponível."}
            </p>
          )}

          {/* ENTRADA */}
          {tab === "entrada" && (
            <div className="space-y-3">

              {test ? (
                <>
                  <div>
                    <span className="font-semibold">
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
                    <span className="font-semibold">
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
                </>
              ) : (
                <p style={{ color: theme.muted }}>
                  Nenhum exemplo disponível.
                </p>
              )}

            </div>
          )}

          {/* REGRAS */}
          {tab === "regras" && (
            <ul className="space-y-2 text-xs">
              {(challenge.rules || []).length > 0 ? (
                challenge.rules.map((r, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span style={{ color: theme.success }}>✔</span>
                    <span>{r.description}</span>
                  </li>
                ))
              ) : (
                <p style={{ color: theme.muted }}>
                  Nenhuma regra definida.
                </p>
              )}
            </ul>
          )}

        </div>

        {/* FOOTER */}
        <div
          className="p-3 border-t flex justify-center shrink-0"
          style={{ borderColor: theme.border }}
        >
          <button
            onClick={handleStart}
            className="px-5 py-2 rounded-lg font-semibold transition"
            style={{
              background: theme.primary,
              color: "#fff"
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = theme.hover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = theme.primary)
            }
          >
            Começar desafio
          </button>
        </div>

      </div>
    </div>
  );
}