import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const { user, loginAsGuest } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">

      <h1 className="text-4xl font-bold mb-6">Boogly 🚀</h1>

      <div className="flex gap-6">

        {["Lista", "Pilha", "Fila"].map((item) => (
          <div
            key={item}
            className="bg-white/10 p-6 rounded-xl hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-xl">{item}</h2>
            <button className="mt-3 bg-green-500 px-4 py-1 rounded">
              Iniciar
            </button>
          </div>
        ))}

      </div>

      {/* BOTÕES */}
      <div className="mt-6 flex gap-4">

        {!user && (
          <>
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Entrar / Criar Conta
            </button>

            <button
              onClick={loginAsGuest}
              className="bg-gray-500 px-4 py-2 rounded"
            >
              Testar sem login
            </button>
          </>
        )}

      </div>

      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />

    </div>
  );
}