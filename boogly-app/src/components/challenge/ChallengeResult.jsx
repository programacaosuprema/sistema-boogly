export function ChallengeResult({ result, attempts }) {

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

  if (result.success) {
    return (
      <div className="bg-green-500/10 p-6 rounded-xl">

        <h2 className="text-xl font-bold mb-3">
          🎉 Muito bem!
        </h2>

        <p>Você acertou a solução!</p>

        <div className="text-yellow-400 text-xl mt-2">
          {"⭐".repeat(stars)}
        </div>

        <div className="mt-3">
          +{calculatePoints(stars, attempts)} pontos
        </div>

        <button className="mt-4 bg-blue-500 px-4 py-2 rounded">
          Próximo desafio
        </button>
      </div>
    );
  }

  const failed = result.results.find(r => !r.passed);

  return (
    <div className="bg-red-500/10 p-6 rounded-xl">

      <h2 className="text-xl font-bold mb-3">
        ❌ Algo deu errado...
      </h2>

      <p>
        Entrada: {JSON.stringify(failed.input)}
      </p>

      <p>
        Esperado: {JSON.stringify(failed.expected)}
      </p>

      <p>
        Recebido: {JSON.stringify(failed.output)}
      </p>

    </div>
  );
}