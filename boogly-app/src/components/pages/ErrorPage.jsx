import { useTheme } from "../../theme/useTheme";
import { useNavigate } from "react-router-dom";

export function ErrorPage({ message, code }) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const errorMessage = message || "Algo deu errado";
  const errorCode = code || "ERR_UNKNOWN";

  return (
    <div
      className="h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{
        background: theme.background,
        color: theme.text
      }}
      role="alert"
      aria-live="assertive"
    >

      {/* ⚠️ ÍCONE */}
      <div
        className="text-5xl mb-4"
        style={{ color: theme.danger }}
      >
        ⚠️
      </div>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-2">
        Ocorreu um erro
      </h1>

      {/* MENSAGEM */}
      <p
        className="mb-2 max-w-md"
        style={{ color: theme.danger }}
      >
        {errorMessage}
      </p>

      {/* CÓDIGO */}
      <span
        className="text-xs mb-6"
        style={{ color: theme.muted }}
      >
        Código: {errorCode}
      </span>

      {/* BOTÕES */}
      <div className="flex gap-3 flex-wrap justify-center">

        {/* RELOAD */}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded font-semibold transition"
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
          🔄 Tentar novamente
        </button>

        {/* VOLTAR */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded font-semibold transition"
          style={{
            background: theme.card,
            color: theme.text,
            border: `1px solid ${theme.border}`
          }}
        >
          ← Voltar
        </button>

        {/* HOME */}
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded font-semibold transition"
          style={{
            background: theme.success,
            color: "#fff"
          }}
        >
          🏠 Início
        </button>

      </div>

    </div>
  );
}