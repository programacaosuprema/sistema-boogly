import { useTheme } from "../../theme/useTheme";
import { useState } from "react";

export default function ActionButton({
  children,
  icon: Icon,
  onClick,
  variant = "default",
  disabled = false,
  loading = false
}) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const variants = {
    primary: theme.primary,
    success: theme.success,
    danger: theme.danger,
    default: theme.card
  };

  // 🔒 fallback seguro
  const baseColor = variants[variant] || variants.default;

  const isDisabled = disabled || loading || isLoading;

  async function handleClick(e) {
    if (!onClick || isDisabled) return;

    try {
      const result = onClick(e);

      if (result instanceof Promise) {
        setIsLoading(true);
        await result;
      }

    } catch (err) {
      console.error("Erro no botão:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={isDisabled}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        background: baseColor,
        color: variant === "default" ? theme.text : "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        opacity: isDisabled ? 0.6 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer"
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
    >
      {/* 🔄 loading */}
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}

      <span>
        {isLoading ? "Processando..." : children}
      </span>
    </button>
  );
}