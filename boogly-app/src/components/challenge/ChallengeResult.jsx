import { useTheme } from "../../theme/useTheme";

function formatValue(value) {
  if (value === null || value === undefined) return "nulo";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

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
                {formatValue(result.expected)}
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
                {formatValue(result.output)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}