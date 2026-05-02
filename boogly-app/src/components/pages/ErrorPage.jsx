import { useTheme } from "../../theme/useTheme";

export function ErrorPage({ message }) {
  const { theme } = useTheme();

  return (
    <div
      className="h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{
        background: theme.background,
        color: theme.text
      }}
    >
      {/* ⚠️ TÍTULO */}
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: theme.text }}
      >
        Erro
      </h1>

      {/* ❌ MENSAGEM */}
      <p
        className="mb-4"
        style={{ color: theme.danger }}
      >
        {message || "Algo deu errado"}
      </p>

      {/* 🔄 BOTÃO */}
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded font-semibold transition"
        style={{
          background: theme.primary,
          color: "#fff",
          border: `1px solid ${theme.border}`
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = theme.hover)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = theme.primary)
        }
      >
        Tentar novamente
      </button>
    </div>
  );
}