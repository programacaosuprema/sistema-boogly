// src/pages/ChallengePage.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AppContext } from "../../app_configuration/AppContext";
import { LoadingPage } from "../pages/LoadingPage";
import { ErrorPage } from "../pages/ErrorPage";

import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";
import { useAuth } from "../../autenticator/useAuth";

/**
 * Retorna percentual (solved / attempts) formatado em pt-BR com 2 casas decimais.
 * Se attempts for 0 retorna "0,00 %".
 */
function getPercentageByResolutionsPTBR(solved = 0, attempts = 0) {
  solved = Number(solved) || 0;
  attempts = Number(attempts) || 0;

  if (attempts === 0) return "0,00 %";

  const pct = (solved / attempts) * 100;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(pct) + " %";
}

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { domainUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const { showError } = useError();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure") || "list";

  // pega token / user do hook de autenticação
  const { token } = useAuth() || {};

  useEffect(() => {
    setLoading(true);
    setHasError(false);

    async function loadChallenges() {
      try {
        // monta headers (se tiver token, envia)
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${domainUrl}/challenges?structure=${structure}`, {
          headers
        });

        if (!res.ok) {
          throw new Error("Erro ao carregar desafios");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato inválido da resposta");
        }

        // Se o backend já retornou userStatus/userAttempts em cada challenge, usa direto
        const hasUserStatus = data.length > 0 && typeof data[0].userStatus !== "undefined";
        const hasUserAttempts = data.length > 0 && typeof data[0].userAttempts !== "undefined";

        if (hasUserStatus && hasUserAttempts) {
          setChallenges(data);
          return;
        }

        // Caso backend não retorne userStatus/userAttempts: tenta buscar do usuário e mesclar
        if (token) {
          try {
            const meRes = await fetch(`${domainUrl}/users/me`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });

            if (meRes.ok) {
              const meData = await meRes.json();

              // POSSÍVEIS CAMPOS (varie conforme seu backend):
              // - meData.userChallenges : [{ challengeId, status, attempts }]
              // - meData.challenges : similar
              const userChallenges = meData.userChallenges || meData.challenges || [];

              // indexa por challengeId (pode ser _id ou publicId)
              const byChallengeId = new Map();
              for (const uc of userChallenges) {
                // uc.challengeId pode ser ObjectId ou objeto populado
                const key =
                  (uc.challengeId && (uc.challengeId._id || uc.challengeId)) ||
                  uc.challengePublicId ||
                  uc.challenge ||
                  uc.challengeId;

                if (key) byChallengeId.set(String(key), uc);
              }

              // mescla resultado: adiciona userStatus e userAttempts (se existir)
              const merged = data.map((c) => {
                const matchKeys = [
                  c._id && String(c._id),
                  c.publicId && String(c.publicId),
                ].filter(Boolean);

                let uc = null;
                for (const k of matchKeys) {
                  if (byChallengeId.has(k)) {
                    uc = byChallengeId.get(k);
                    break;
                  }
                }

                return {
                  ...c,
                  // status do usuário para este challenge
                  userStatus: uc?.status || c.userStatus || "pending",
                  // número de tentativas do usuário neste challenge
                  userAttempts: uc?.attempts ?? c.userAttempts ?? 0
                };
              });

              setChallenges(merged);
              return;
            }
          } catch (err) {
            // falhou ao buscar /users/me — ignora e segue com fallback
            console.warn("Não foi possível buscar user challenges:", err);
          }
        }

        // fallback: sem status específico -> assume pending, e sem tentativas individuais
        const fallback = data.map((c) => ({
          ...c,
          userStatus: c.userStatus || "pending",
          userAttempts: c.userAttempts ?? 0
        }));

        setChallenges(fallback);
      } catch (err) {
        console.error(err);
        showError(err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadChallenges();
  }, [domainUrl, showError, structure, token]);

  // 🔥 LOADING
  if (loading) return <LoadingPage />;

  // 🔥 ERRO DE TELA (CORRETO)
  if (hasError) {
    return <ErrorPage message="Não foi possível carregar os desafios." />;
  }

  // 🔥 LISTA VAZIA
  if (challenges.length === 0) {
    return (
      <div className="h-full flex items-center justify-center" style={{ color: theme.muted }}>
        Nenhum desafio encontrado
      </div>
    );
  }

  // 🔥 UI helpers (mantive seu visual)
  function getStatusUI(status) {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${theme.success}20`, color: theme.success }}>
            🟢 Concluído
          </span>
        );
      case "attempted":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${theme.warning}20`, color: theme.warning }}>
            🟡 Tentando
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${theme.danger}20`, color: theme.danger }}>
            🔴 Pendente
          </span>
        );
    }
  }

  function getDifficultyUI(difficulty) {
    switch (difficulty) {
      case "easy":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${theme.success}20`, color: theme.success }}>
            Fácil
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${theme.warning}20`, color: theme.warning }}>
            Médio
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${theme.danger}20`, color: theme.danger }}>
            Difícil
          </span>
        );
    }
  }

  return (
    <div className="h-full p-4 flex flex-col" style={{ background: theme.background, color: theme.text }}>
      {/* HEADER */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm"
          style={{ background: theme.card, color: theme.text }}
          onMouseEnter={(e) => (e.currentTarget.style.background = theme.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = theme.card)}
        >
          ← Voltar
        </button>

        {/* Use theme.primary para manter o h2 colorido em temas escuros */}
        <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>Desafios</h2>
        <p style={{ color: theme.muted }}>Resolva problemas e evolua suas habilidades</p>
      </div>

      {/* TABELA */}
      <div className="flex-1 overflow-hidden rounded-xl" style={{ background: theme.panel }}>
        <div className="h-full overflow-x-auto">
          <div className="min-w-[1050px]">

            {/* HEADER (agora 7 colunas) */}
            <div className="grid grid-cols-6 px-6 py-3 text-sm border-b" style={{ color: theme.muted, borderColor: theme.border }}>
              <span>#</span>
              <span>Status</span>
              <span>Nome</span>
              <span>Dificuldade</span>
              <span>Percentual acertos</span>
              <span>Minhas Tentativas</span>
            </div>

            {/* LINHAS */}
            {challenges.map((c, index) => (
              <div key={c.publicId || c._id}
                   onClick={() => navigate(`/app/challenges/${c.publicId || c._id}?structure=${structure}`)}
                   role="button"
                   tabIndex={0}
                   onKeyDown={(e) => { if (e.key === "Enter") navigate(`/app/challenges/${c.publicId || c._id}?structure=${structure}`); }}
                   className="grid grid-cols-6 px-6 py-3 border-b cursor-pointer transition"
                   style={{ borderColor: theme.border }}
                   onMouseEnter={(e) => (e.currentTarget.style.background = theme.hover)}
                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* index */}
                <span style={{ color: theme.muted }}>{index + 1}</span>

                {/* status visual */}
                <span>{getStatusUI(c.userStatus)}</span>

                {/* title */}
                <span className="font-medium">{c.title}</span>

                {/* difficulty */}
                <span>{getDifficultyUI(c.difficulty)}</span>

               {/* percentual (exibe 12.34%) */}
                <span style={{ color: theme.muted }}>
                  {getPercentageByResolutionsPTBR(c.solvedCount ?? 0, c.attempts ?? 0)}
                </span>

                {/* minhas tentativas (individual do usuário) */}
                <span style={{ color: theme.muted }}>
                  {/* se backend não enviou userAttempts e usuário não autenticado, mostra "-" */}
                  {typeof c.userAttempts !== "undefined" ? c.userAttempts : "-"}
                </span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}