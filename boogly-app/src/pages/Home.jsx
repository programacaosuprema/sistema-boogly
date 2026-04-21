import { useState, useContext } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../autenticator/useAuth";
import { useNavigate } from "react-router-dom";
import {AppContext} from "../app_configuration/AppContext"

export default function Home() {
  const { user, loginAsGuest, setStructure } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const {appName} = useContext(AppContext);

  function handleStart(type) {
    setStructure(type);
    loginAsGuest();
    navigate("/app");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white p-6">

      {/* HEADER */}
      <h1 className="text-5xl font-extrabold mb-2">{appName}</h1>
      <p className="text-lg text-white/70 mb-10">
        Escolha seu primeiro desafio!
      </p>

      {/* CARDS */}
      <div className="flex flex-wrap justify-center gap-8">

        {/* LISTA */}
        <div
          onClick={() => handleStart("list")}
          className="w-64 bg-gradient-to-b from-blue-400 to-blue-600 p-5 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-bold mb-2">Lista</h2>
          <p className="text-sm text-white/80 mb-4">
            Aprenda como funciona uma lista
          </p>
          <button className="w-full bg-green-400 text-black font-semibold py-2 rounded-lg">
            Iniciar
          </button>
        </div>

        {/* PILHA */}
        <div
          onClick={() => handleStart("stack")}
          className="w-64 bg-gradient-to-b from-orange-400 to-orange-600 p-5 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-bold mb-2">Pilha</h2>
          <p className="text-sm text-white/80 mb-4">
            Aprenda como funciona uma pilha
          </p>
          <button className="w-full bg-green-400 text-black font-semibold py-2 rounded-lg">
            Iniciar
          </button>
        </div>

        {/* FILA */}
        <div
          onClick={() => handleStart("queue")}
          className="w-64 bg-gradient-to-b from-green-400 to-green-600 p-5 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-bold mb-2">Fila</h2>
          <p className="text-sm text-white/80 mb-4">
            Aprenda como funciona uma fila
          </p>
          <button className="w-full bg-gray-300 text-black font-semibold py-2 rounded-lg">
            Em breve
          </button>
        </div>

      </div>

      {/* AÇÕES */}
      <div className="mt-10 flex flex-col items-center gap-4">

        {!user && (
          <>
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold"
            >
              Entrar / Criar Conta
            </button>

            <button
              onClick={loginAsGuest}
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg"
            >
              Testar sem login
            </button>
          </>
        )}

        <p className="text-sm text-white/60">
          O progresso não será salvo sem login
        </p>

      </div>

      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}