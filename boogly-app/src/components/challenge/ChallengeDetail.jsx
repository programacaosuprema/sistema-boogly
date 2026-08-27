import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ChallengeIntro } from "./ChallengeIntro";
import { LoadingPage } from "../pages/LoadingPage";
import { ErrorPage } from "../pages/ErrorPage";

import { AppContext } from "../../app_configuration/AppContext";
import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";

import ChallengeBlocklyEditor from "./ChallengeBlocklyEditor.jsx";

import { toolboxCategories, queueToolbox, stackToolbox } from "../../blockly/toolboxes.js";
import { buildToolbox } from "./toolboxBuilder.js"

import ChallengeResult from "./ChallengeResult.jsx"

export default function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  const { domainUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const { showError } = useError();

  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [cCode, setCCode] = useState("");
  const [blockCount, setBlockCount] = useState(0);

  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.timeLimit);
    }
  }, [challenge]);

  useEffect(() => {
    if (!started) return;

    if (timeLeft <= 0) {
      alert("Tempo esgotado ⏱");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, timeLeft]);

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

  const rawToolbox = challenge.structure === "list"
    ? toolboxCategories
    : challenge.structure === "queue"
    ? queueToolbox
    : stackToolbox;

  const safeToolbox = buildToolbox(rawToolbox);

  async function handleRun(commands) {
    try {
      const res = await fetch(
        `${domainUrl}/challenges/${challenge.publicId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ commands })
        }
      );

      const data = await res.json();

      setResult(data);
      setShowModal(true);

    } catch (err) {
      showError(err);
    }
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

        <div className="flex mt-6 gap-4 h-[80vh]">

        {/* 🧾 ESQUERDA — INSTRUÇÕES */}
        <div
          className="w-1/3 p-4 rounded-xl overflow-auto"
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 className="font-bold mb-2">{challenge.title}</h2>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-3 py-1 rounded text-xs font-bold"
              style={{
                background: timeLeft <= 10 ? "#ff4d4f" : `${theme.warning}20`,
                color: timeLeft <= 10 ? "#fff" : theme.warning
              }}
            >
              ⏱ {timeLeft}s
            </span>
          </div>

          <p className="text-sm mb-4">
            {challenge.description}
          </p>

          <h3 className="font-semibold mb-2">Exemplo:</h3>

          {challenge.testCases?.[0] && (
            <div className="text-xs space-y-2">
              <div>
                <strong>Entrada:</strong>
                <pre>{JSON.stringify(challenge.testCases[0].input)}</pre>
              </div>

              <div>
                <strong>Saída:</strong>
                <pre>{JSON.stringify(challenge.testCases[0].expectedOutput)}</pre>
              </div>
            </div>
          )}

          <h3 className="font-semibold mt-4 mb-2">Regras:</h3>

          <ul className="text-xs space-y-1">
            {(challenge.rules || []).map((r, i) => (
              <li key={i}>✔ {r.description}</li>
            ))}
          </ul>
        </div>

        {/* 🧩 DIREITA — EDITOR */}
        <div className="flex-1 rounded-xl overflow-hidden">
          <ChallengeBlocklyEditor
            toolbox={safeToolbox}
            setCode={setCode}
            setCCode={setCCode}
            setBlockCount={setBlockCount}
            onRun={handleRun} // preferível: o parent faz o fetch e abre modal
            challengeId={challenge.publicId} // opcional se você quer que o editor faça o POST
          />
        </div>
      </div>
      )}
      {showModal && (
        <ChallengeResult
          result={result}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}