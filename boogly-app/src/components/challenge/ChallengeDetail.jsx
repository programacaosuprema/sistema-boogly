import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ChallengeIntro } from "./ChanllengeIntro";
import { LoadingPage } from "../pages/LoadingPage";
import { ErrorPage } from "../pages/ErrorPage";

import { AppContext } from "../../app_configuration/AppContext";
import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";

export default function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  const { domainUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const { showError } = useError();

  const navigate = useNavigate();

  useEffect(() => {
    async function loadChallenge() {
      try {
        const res = await fetch(`${domainUrl}/challenges/${id}`);

        if (!res.ok) {
          throw new Error("Erro ao carregar desafio");
        }

        const data = await res.json();

        if (!data) {
          throw new Error("Desafio não encontrado");
        }

        setChallenge(data);

      } catch (err) {
        console.error(err);

        showError(err); // 🔥 toast global

        setChallenge(null);

      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [domainUrl, id, showError]);

  // 🔥 loading inicial
  if (loading) return <LoadingPage />;

  // 🔥 loading ao iniciar desafio
  if (starting) return <LoadingPage />;

  // 🔥 ERRO DA TELA (aqui é o lugar certo)
  if (!challenge) {
    return (
      <ErrorPage message="Não foi possível carregar o desafio." />
    );
  }

  return (
    <div
      className="p-6 min-h-screen"
      style={{
        background: theme.background,
        color: theme.text
      }}
    >

      {/* 🔙 BOTÃO VOLTAR */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm"
        style={{
          background: theme.card,
          color: theme.text,
          border: `1px solid ${theme.border}`
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = theme.hover)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = theme.card)
        }
      >
        ← Voltar
      </button>

      {/* 🔥 CONTEÚDO */}
      {!started ? (

        <ChallengeIntro
          challenge={challenge}
          onStart={() => {
            setStarting(true);

            setTimeout(() => {
              setStarting(false);
              setStarted(true);
            }, 1500);
          }}
        />

      ) : (

        <div
          className="mt-6 p-6 rounded-xl"
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`
          }}
        >
          <p style={{ color: theme.muted }}>
            Workspace do desafio (próximo passo)
          </p>
        </div>

      )}
    </div>
  );
}