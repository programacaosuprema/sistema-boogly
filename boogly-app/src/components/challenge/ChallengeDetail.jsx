import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ChallengeIntro } from "./ChanllengeIntro";

export default function ChallengeDetail() {

  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/challenges/${id}`)
      .then(res => res.json())
      .then(data => {
        setChallenge(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-white">Carregando desafio...</div>;
  }

  if (!challenge) {
    return <div className="text-red-400">Desafio não encontrado</div>;
  }

  return (
    <div className="p-6 text-white">

      {!started ? (
        <ChallengeIntro
          challenge={challenge}
          onStart={() => setStarted(true)}
        />
      ) : (
        <div>
          {/* 🔥 AQUI VAI SEU WORKSPACE DE DESAFIO */}
          <p>Workspace do desafio (próximo passo)</p>
        </div>
      )}

    </div>
  );
}