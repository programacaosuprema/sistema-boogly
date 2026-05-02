import { useState } from "react";
import { useAuth } from "../../autenticator/useAuth";
import { Mail } from "lucide-react";
import { authTheme } from "../../theme/authTheme";

export default function AuthModal({ isOpen, onClose }) {
  const { authenticate } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!identifier.trim()) {
      setError("Digite seu e-mail ou nickname");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await authenticate(identifier);
      onClose();

    } catch (err) {
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: authTheme.background }}
    >
      <div
        className="w-full max-w-md p-8 rounded-3xl shadow-2xl relative"
        style={{
          background: authTheme.panel,
          color: authTheme.text
        }}
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl"
          style={{ color: authTheme.muted }}
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Entrar 🚀
        </h2>

        {/* INPUT */}
        <div
          className="rounded-xl p-4 flex gap-3 items-center mb-3"
          style={{ background: authTheme.inputBg }}
        >
          <Mail style={{ color: authTheme.inputPlaceholder }} />

          <input
            type="text"
            placeholder="E-mail ou nickname"
            className="w-full outline-none bg-transparent"
            style={{ color: authTheme.inputText }}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="mb-3 text-sm"
            style={{ color: authTheme.danger }}
          >
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold transition"
          style={{
            background: loading
              ? authTheme.primaryHover
              : authTheme.primary,
            color: "#000",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </div>
    </div>
  );
}