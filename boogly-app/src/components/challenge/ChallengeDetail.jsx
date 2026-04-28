import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChallengeIntro } from "./ChanllengeIntro";
import { LoadingPage } from "../pages/LoadingPage";
import { AppContext } from "../../app_configuration/AppContext";

import { useNavigate } from "react-router-dom";

export default function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  const { domainUrl } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadChallenge() {
      try {
        const res = await fetch(`${domainUrl}/challenges/${id}`);
        const data = await res.json();
        setChallenge(data);
      } catch (err) {
        console.error(err);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [domainUrl, id]);

  // 🔥 loading inicial
  if (loading) return <LoadingPage />;

  // 🔥 loading ao iniciar desafio
  if (starting) return <LoadingPage />;

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Desafio não encontrado
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm"
      >
        ← Voltar
      </button>
      {!started ? (
        
        <ChallengeIntro
          challenge={challenge}
          onStart={() => {
            setStarting(true);

            setTimeout(() => {
              setStarting(false);
              setStarted(true);
            }, 1500); // ⬅️ reduzi (10s estava exagerado)
          }}
        />
      ) : (
        <div>
          <p>Workspace do desafio (próximo passo)</p>
        </div>
      )}
    </div>
  );
}