import { useTheme } from "../../theme/useTheme";

export default function ActionButton({
  children,
  icon: Icon,
  onClick,
  variant = "default"
}) {
  const { theme } = useTheme();

  const variants = {
    primary: theme.primary,
    success: theme.success,
    danger: theme.danger,
    default: theme.card
  };

  const baseColor = variants[variant];

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        background: baseColor,
        color: variant === "default" ? theme.text : "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.filter = "brightness(1.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.filter = "brightness(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}