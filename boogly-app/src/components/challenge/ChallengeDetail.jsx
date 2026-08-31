// src/pages/ChallengeDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../app_configuration/AppContext";
import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";
import { useAuth } from "../../autenticator/useAuth";

import { ChallengeIntro } from "../challenge/ChallengeIntro";
import ChallengeBlocklyEditor from "../challenge/ChallengeBlocklyEditor";
import ChallengeResult from "../challenge/ChallengeResult";

import { challengeToolbox } from "../../blockly/index"; // mapeamento toolbox: { list, queue, stack }

export default function ChallengeDetail() {
  const { id } = useParams();
  const { domainUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const { showError } = useError();
  const { token } = useAuth() || {};

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI / flow state
  const [started, setStarted] = useState(false);
  const [userAttempt, setUserAttempt] = useState(null);

  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${domainUrl}/challenges/${id}`, { headers });
        if (!res.ok) throw new Error("Erro ao carregar desafio");
        const data = await res.json();

        // Normalize some fields for UI convenience
        const normalized = {
          ...data,
          structure: data.structure || "list",
          userStatus: data.userStatus || "pending",
          userAttempts: data.userAttempts ?? 0
        };

        setChallenge(normalized);
      } catch (err) {
        showError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [domainUrl, id, showError, token]);

  async function handleStart(userAttemptResult) {
    setStarted(true);
    setUserAttempt(userAttemptResult);
    if (userAttemptResult) {
      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              userStatus: userAttemptResult.status,
              userAttempts: userAttemptResult.attempts
            }
          : prev
      );
    } else {
      // fallback mínimo (caso backend não retorne)
      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              userStatus: "attempted"
            }
          : prev
      );
    }
  }

  // Submeter solução: envia comandos extraídos do Blockly para backend
  async function handleRun(commands) {
    try {
      setRunning(true);

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${domainUrl}/challenges/${id}/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify({ commands })
      });

      if (!res.ok) {
        // backend pode retornar 400/500 com JSON descrevendo erro
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Erro ao submeter: ${res.status}`);
      }

      const data = await res.json();

      // data esperado: { success, message, output, expected, steps, userAttempt? }
      setResult({
        success: !!data.success,
        message: data.message || (data.success ? "Correto 🎉" : "Incorreto"),
        output: data.output ?? data.outputState ?? data.outputState ?? [],
        expected: data.expected ?? data.expectedOutput ?? null,
        steps: data.steps || []
      });

      // Atualiza status local do desafio conforme userAttempt retornado
      if (data.userAttempt) {
        setUserAttempt(data.userAttempt);

        setChallenge((prev) =>
          prev
            ? {
                ...prev,
                userStatus: data.userAttempt.status,
                userAttempts: data.userAttempt.attempts
              }
            : prev
        );
      } 
    } catch (err) {
      console.error("Erro ao submeter:", err);
      showError({ message: err.message || "Erro ao submeter solução" });
    } finally {
      setRunning(false);
    }
  }

  // opcional: refetch do desafio do servidor (útil para atualizar dados após tentativa)
  async function refreshChallengeFromServer() {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${domainUrl}/challenges/${id}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      setChallenge((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.warn("refreshChallengeFromServer error:", err);
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!challenge) return <div className="p-6">Desafio não encontrado</div>;

  // pick toolbox for the challenge structure (fallback to list)
  const chosenToolbox = (challengeToolbox && challengeToolbox[challenge.structure]) || challengeToolbox?.list;

  // --- RENDER ---
  return (
    <div className="h-full p-4" style={{ background: theme.background, color: theme.text }}>
      {/* Se ainda não iniciou o desafio, mostramos o ChallengeIntro modal-like.
          Ao clicar em "Começar desafio" o handleStart() é chamado (que já
          faz o POST /attempt via ChallengeIntro) e depois mostra o editor. */}
      {!started ? (
        <div className="h-full max-w-6xl mx-auto">
          <ChallengeIntro challenge={challenge} onStart={handleStart} />
        </div>
      ) : (
        // layout dividido: instruções (esquerda fixa) + editor (direita flex)
        <div className="h-full flex gap-4 min-h-0">
          {/* LEFT: INSTRUÇÕES / INFORMAÇÕES */}
          <aside
            className="w-96 flex flex-col rounded-xl p-4 overflow-auto"
            style={{
              background: theme.panel,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="mb-3">
              <h2 className="text-lg font-bold" style={{ color: theme.primary }}>
                {challenge.title}
              </h2>
            </div>
            {/* TABS: DESCRIÇÃO / ENTRADA / REGRAS */}
            <div className="mb-3 flex flex-col gap-2">
              <div className="text-xs font-semibold" style={{ color: theme.muted }}>
                Instruções
              </div>

              <div className="text-sm leading-relaxed p-2 rounded" style={{ background: theme.workspace }}>
                <div dangerouslySetInnerHTML={{ __html: challenge.description || "<em>Sem descrição</em>" }} />
              </div>
            </div>

            {/* Example test case (primeiro) */}
            {Array.isArray(challenge.testCases) && challenge.testCases.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-semibold mb-1" style={{ color: theme.muted }}>
                  Exemplo de entrada / saída
                </div>

                <div className="mb-2 text-xs">
                  <div className="mb-1">
                    <strong>Entrada:</strong>
                    <div className="mt-1 p-2 rounded text-xs break-words" style={{ background: theme.card, color: theme.text }}>
                      {JSON.stringify(challenge.testCases[0].input)}
                    </div>
                  </div>

                  <div>
                    <strong>Saída esperada:</strong>
                    <div className="mt-1 p-2 rounded text-xs break-words" style={{ background: theme.card, color: theme.text }}>
                      {JSON.stringify(challenge.testCases[0].expectedOutput)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REGRAS */}
            <div className="mt-auto">
              <div className="text-xs font-semibold mb-2" style={{ color: theme.muted }}>
                Regras
              </div>

              <ul className="text-xs space-y-2">
                {(challenge.rules || []).length > 0 ? (
                  challenge.rules.map((r, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span style={{ color: theme.success }}>✔</span>
                      <span>{r.description}</span>
                    </li>
                  ))
                ) : (
                  <li style={{ color: theme.muted }}>Nenhuma regra definida.</li>
                )}
              </ul>
            </div>
          </aside>

          {/* RIGHT: EDITOR (flex) */}
          <main className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ background: theme.workspace }}>
              <ChallengeBlocklyEditor
                toolbox={chosenToolbox}
                structure={challenge.structure}
                setBlockCount={() => {}}
                onRun={handleRun}
              />
            </div>

            {/* Resultado modal (overlay) */}
            <ChallengeResult result={result} onClose={() => setResult(null)} />
          </main>
        </div>
      )}

    </div>
  );
}