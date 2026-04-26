import { useState } from "react";
import { useAuth } from "../../autenticator/useAuth";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!identifier) {
      alert("Digite seu e-mail ou nickname");
      return;
    }

    try {
      setLoading(true);

      // 🔥 envia como email (backend já trata nick também)
      await authenticate(identifier);

      navigate("/app");
      onClose();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="w-full max-w-md bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-3xl text-white shadow-2xl relative">

        {/* FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Entrar 🚀
        </h2>

        <div className="bg-white rounded-xl p-4 text-black flex gap-3 items-center mb-4">
          <Mail className="text-gray-500" />
          <input
            type="text"
            placeholder="E-mail ou nickname"
            className="w-full outline-none"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded-xl"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </div>
    </div>
  );
}