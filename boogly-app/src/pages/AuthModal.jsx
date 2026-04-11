import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");

  function handleSubmit() {
    if (mode === "login") {
      login(email, nick);
    } else {
      register(email, nick);
    }
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-96 text-black shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Nickname"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setNick(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-500 text-white py-2 rounded mb-2"
        >
          {mode === "login" ? "Entrar" : "Criar"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-sm text-purple-500"
        >
          {mode === "login" ? "Criar conta" : "Já tenho conta"}
        </button>

      </div>
    </div>
  );
}