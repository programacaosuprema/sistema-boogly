import { useTheme } from "../../theme/useTheme";

export function ChallengeResult({ result, attempts, onNext }) {
  const { theme } = useTheme();

  // 🔒 SEGURANÇA
  if (!result) {
    return (
      <div
        className="p-6 rounded-xl"
        style={{
          background: `${theme.warning}15`,
          border: `1px solid ${theme.warning}`
        }}
      >
        <p style={{ color: theme.text }}>
          ⚠️ Nenhum resultado disponível
        </p>
      </div>
    );
  }

  function calculateStars(result, attempts) {
    if (!result.success) return 0;
    if (attempts === 1) return 3;
    if (attempts <= 3) return 2;
    return 1;
  }

  function calculatePoints(stars, attempts) {
    let base = 200;

    if (stars === 3) base *= 1.2;
    if (stars === 2) base *= 1.1;

    base -= attempts * 10;

    return Math.max(base, 50);
  }

  const stars = calculateStars(result, attempts);

  // ✅ SUCESSO
  if (result.success) {
    return (
      <div
        className="p-6 rounded-xl"
        style={{
          background: `${theme.success}15`,
          border: `1px solid ${theme.success}`
        }}
      >

        <h2
          className="text-xl font-bold mb-3"
          style={{ color: theme.success }}
        >
          🎉 Muito bem!
        </h2>

        <p style={{ color: theme.text }}>
          Você acertou a solução!
        </p>

        {/* ⭐ ESTRELAS */}
        <div
          className="text-xl mt-2"
          style={{ color: theme.warning }}
        >
          {"⭐".repeat(stars)}
        </div>

        {/* 🧮 PONTOS */}
        <div
          className="mt-3 font-semibold"
          style={{ color: theme.text }}
        >
          +{calculatePoints(stars, attempts)} pontos
        </div>

        {/* 🚀 BOTÃO */}
        <button
          onClick={onNext}
          className="mt-4 px-4 py-2 rounded font-semibold transition"
          style={{
            background: theme.primary,
            color: "#fff"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = theme.hover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = theme.primary)
          }
        >
          Próximo desafio
        </button>

      </div>
    );
  }

  // ❌ ERRO (SEGURO)
  const failed =
    result.results?.find(r => !r.passed) || null;

  return (
    <div
      className="p-6 rounded-xl"
      style={{
        background: `${theme.danger}15`,
        border: `1px solid ${theme.danger}`
      }}
    >

      <h2
        className="text-xl font-bold mb-3"
        style={{ color: theme.danger }}
      >
        ❌ Algo deu errado...
      </h2>

      {failed ? (
        <>
          <p style={{ color: theme.text }}>
            <strong>Entrada:</strong>{" "}
            {JSON.stringify(failed.input)}
          </p>

          <p style={{ color: theme.text }}>
            <strong>Esperado:</strong>{" "}
            {JSON.stringify(failed.expected)}
          </p>

          <p style={{ color: theme.text }}>
            <strong>Recebido:</strong>{" "}
            {JSON.stringify(failed.output)}
          </p>
        </>
      ) : (
        <p style={{ color: theme.text }}>
          Não foi possível identificar o erro da execução.
        </p>
      )}

    </div>
  );
}