import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChallengeIntro } from "./ChanllengeIntro";
import { LoadingPage } from "../pages/LoadingPage";
import { AppContext } from "../../app_configuration/AppContext";

export default function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  const { domainUrl } = useContext(AppContext);

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