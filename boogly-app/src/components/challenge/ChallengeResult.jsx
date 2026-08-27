import { useTheme } from "../../theme/useTheme";

export default function ChallengeResult({ result, onClose }) {
  const { theme } = useTheme();

  if (!result) return null;

  const isSuccess = result.success;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999
      }}
    >
      <div
        className="rounded-xl w-[520px] p-6 shadow-xl"
        style={{
          background: theme.panel,
          color: theme.text,
          border: `1px solid ${theme.border}`
        }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-lg font-bold"
            style={{ color: theme.primary }}
            >
            Resultado da Execução
          </h2>

          <button
            onClick={onClose}
            style={{ color: theme.text }}
          >
            ✖
          </button>
        </div>

        {/* STATUS */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{
              color: isSuccess ? "#22c55e" : "#ef4444"
            }}
          >
            {isSuccess ? "✅ Correto!" : "❌ Incorreto"}
          </span>

          <span style={{ color: theme.textSecondary }}>
            {result.message}
          </span>
        </div>

        {/* RESULTADO FINAL */}
        <div className="mb-4">
          <strong>Resultado final:</strong>
          <pre
            className="p-2 rounded mt-1"
            style={{
              background: theme.background,
              border: `1px solid ${theme.border}`
            }}
          >
            {JSON.stringify(result.output ?? [])}
          </pre>
        </div>

        {/* ERRO */}
        {!isSuccess && (
          <div className="mb-4">
            <div>
              <strong>Esperado:</strong>
              <pre
                className="p-2 rounded mt-1"
                style={{
                  background: "rgba(34,197,94,0.1)"
                }}
              >
                {JSON.stringify(result.expected)}
              </pre>
            </div>

            <div className="mt-2">
              <strong>Seu resultado:</strong>
              <pre
                className="p-2 rounded mt-1"
                style={{
                  background: "rgba(239,68,68,0.1)"
                }}
              >
                {JSON.stringify(result.output)}
              </pre>
            </div>
          </div>
        )}

        {/* STEPS */}
        {result.steps && (
          <div className="max-h-48 overflow-y-auto mt-4">
            <strong>Passo a passo:</strong>

            <div className="mt-2 space-y-1">
              {result.steps.map((step, i) => (
                <div
                  key={i}
                  className="text-sm p-2 rounded flex justify-between"
                  style={{
                    background: theme.background,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <span style={{ color: theme.primary }}>
                    {step.command.type}
                    {step.command.value !== undefined && (
                      <>({step.command.value})</>
                    )}
                  </span>

                  <span>
                    {JSON.stringify(step.state)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg"
            style={{
              background: theme.hover,
              color: theme.text
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}