import { useState } from "react";
import { useAuth } from "../autenticator/useAuth";
import { useNavigate } from "react-router-dom";
import { Mail, Dice5, Key } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("register");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [autoNick, setAutoNick] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      alert("Digite um e-mail válido!");
      return;
    }

    // 🔥 REGRA CORRETA
    const finalNick = autoNick ? "" : nick;

    if (!autoNick && !nick) {
      alert("Digite um nickname!");
      return;
    }

    try {
      setLoading(true);

      if (mode === "login") {
        await login(email);
      } else {
        await register(email, finalNick); // 🔥 backend decide
      }

      navigate("/app");
      onClose();

    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="relative w-full max-w-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-10 rounded-3xl shadow-2xl text-white">

        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:scale-110 transition"
        >
          ✕
        </button>

        {/* TÍTULO */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Comece sua jornada na programação 🚀
        </h2>

        {/* EMAIL */}
        <div className="bg-white rounded-2xl p-4 mb-5 text-black flex items-center gap-4">
          <Mail className="text-gray-500 w-6 h-6" />
          <div className="w-full">
            <label className="text-base font-semibold">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail..."
              className="w-full outline-none text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* NICKNAME */}
        {!autoNick && (
          <div className="bg-white rounded-2xl p-4 mb-4 text-black">
            <label className="text-base font-semibold">Nickname</label>
            <input
              type="text"
              placeholder="Escolha seu nick..."
              className="w-full outline-none text-base"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
            />
          </div>
        )}

        {/* CHECKBOX */}
        <div className="flex items-center gap-3 mb-6 text-lg">
          <input
            type="checkbox"
            checked={autoNick}
            onChange={() => setAutoNick(!autoNick)}
            className="w-5 h-5"
          />
          <span>Gerar nickname automaticamente</span>
          <Dice5 className="w-5 h-5" />
        </div>

        {/* BOTÃO */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-4 text-lg rounded-2xl transition"
        >
          {loading
            ? "Carregando..."
            : mode === "login"
            ? "Entrar"
            : "Criar Conta"}
        </button>

        {/* FRASE */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-white/90">
          <Key className="w-4 h-4" />
          Você receberá um código de acesso no seu e-mail!
        </div>

        {/* SWITCH */}
        <p
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          className="text-center mt-6 text-base cursor-pointer underline"
        >
          {mode === "login"
            ? "Criar conta"
            : "Já tem conta? Entrar"}
        </p>

      </div>
    </div>
  );
}