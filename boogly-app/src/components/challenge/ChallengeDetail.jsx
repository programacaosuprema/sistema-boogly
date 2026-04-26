import { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";

import { ChallengeIntro } from "./ChanllengeIntro";

import { AppContext } from "../../app_configuration/AppContext";

export default function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  const { domainUrl } = useContext(AppContext);

  useEffect(() => {
    fetch(`${domainUrl}/challenges/${id}`)
      .then(res => res.json())
      .then(data => {
        setChallenge(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [domainUrl, id]);

  if (loading) {
    return <div className="h-dvh bg-gray-100 flex items-center justify-center text-white">Carregando desafio...</div>;
  }

  if (!challenge) {
    return <div className="h-dvh bg-gray-100 flex items-center justify-center text-red-400">Desafio não encontrado</div>;
  }

  return (
    <div className="h-full overflow-hidden">
      {!started ? (
        <ChallengeIntro
          challenge={challenge}
          onStart={() => setStarted(true)}
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <p>Workspace do desafio</p>
        </div>
      )}
    </div>
  );
}