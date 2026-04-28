import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../app_configuration/AppContext";
import { LoadingPage } from "../pages/LoadingPage";

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const { domainUrl } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${domainUrl}/challenges`, {
      headers: {
        Authorization: "Bearer TOKEN_AQUI"
      }
    })
      .then(res => res.json())
      .then(data => {
        setChallenges(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [domainUrl]);

  function getStatusUI(status) {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
            🟢 Concluído
          </span>
        );
      case "attempted":
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold">
            🟡 Tentando
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
            🔴 Pendente
          </span>
        );
    }
  }

  function getDifficultyUI(difficulty) {
    switch (difficulty) {
      case "easy":
        return (
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            Fácil
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold">
            Médio
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
            Difícil
          </span>
        );
    }
  }

  if (loading) {
    return (
      <LoadingPage />
    )
  }

  if (challenges.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white/60">
        Nenhum desafio encontrado
      </div>
    );
  }

  return (
    <div className="h-full p-4 text-white flex flex-col">

      {/* HEADER */}
      <div className="mb-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm"
        >
          ← Voltar
        </button>

        <h2 className="text-2xl font-bold text-white">
          Desafios
        </h2>
        <p className="text-sm text-white/60">
          Resolva problemas e evolua suas habilidades
        </p>
      </div>

      {/* TABELA */}
      <div className="flex-1 overflow-hidden bg-white/5 rounded-xl">

        <div className="h-full overflow-x-auto">
          <div className="min-w-[900px]">

            {/* HEADER TABELA */}
            <div className="grid grid-cols-6 px-6 py-3 text-sm text-white/60 border-b border-white/10">
              <span>Status</span>
              <span>#</span>
              <span>Nome</span>
              <span>Dificuldade</span>
              <span>Resoluções</span>
              <span>Tentativas</span>
            </div>

            {/* LINHAS */}
            {challenges.map((c, index) => (
              <div
                key={c.publicId || c._id}
                onClick={() => navigate(`/app/challenges/${c.publicId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/app/challenges/${c.publicId}`);
                  }
                }}
                className="grid grid-cols-6 px-6 py-3 border-b border-white/5 hover:bg-white/10 cursor-pointer transition"
              >
                <span>{getStatusUI(c.userStatus)}</span>
                <span className="text-white/70">{index + 1}</span>
                <span className="font-medium">{c.title}</span>
                <span>{getDifficultyUI(c.difficulty)}</span>
                <span>{c.solvedCount.toLocaleString()}</span>
                <span>{c.attempts}</span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}