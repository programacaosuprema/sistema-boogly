import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChallengePage() {

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/challenges", {
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
  }, []);

  function getStatusUI(status) {
    switch (status) {
      case "completed":
        return "🟢 Concluído";
      case "attempted":
        return "🟡 Tentando";
      default:
        return "⚪ Pendente";
    }
  }

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <div className="p-6 text-white">

      <h2 className="text-xl font-bold mb-4">
        Desafios
      </h2>

      <div className="bg-white/5 rounded-xl overflow-hidden">

        <div className="grid grid-cols-4 px-4 py-2 text-sm text-white/60 border-b border-white/10">
          <span>Status</span>
          <span>Nome</span>
          <span>Resoluções</span>
          <span>Tentativas</span>
        </div>

        {challenges.map((c) => (
          <div
            key={c._id}
            onClick={() => navigate(`/app/challenges/${c._id}`)}
            className="grid grid-cols-4 px-4 py-3 border-b border-white/5 hover:bg-white/10 cursor-pointer"
          >

            <span>{getStatusUI(c.userStatus)}</span>

            <span>{c.title}</span>

            <span>{c.solvedCount.toLocaleString()}</span>

            <span>{c.attempts}</span>

          </div>
        ))}
      </div>
    </div>
  );
}