import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      setLoading(true);

      if (mode === "login") {
        await login(email);
        navigate("/app");
      } else {
        await register(email, nick);
        navigate("/app");
      }

      onClose();
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao conectar com servidor");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-96 text-black">

        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode === "register" && (
          <input
            placeholder="Nickname"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setNick(e.target.value)}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-500 text-white py-2 rounded mb-2"
        >
          {loading
            ? "Carregando..."
            : mode === "login"
            ? "Entrar"
            : "Criar Conta"}
        </button>

        <button
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          className="text-sm text-purple-500"
        >
          {mode === "login"
            ? "Criar conta"
            : "Já tenho conta"}
        </button>

      </div>
    </div>
  );
}