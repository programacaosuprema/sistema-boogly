export function ChallengeIntro({ challenge, onStart }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        {challenge.title}
      </h2>

      <p className="mb-4 text-white/70">
        {challenge.description}
      </p>

      <div className="mb-3">
        <strong>Entrada:</strong> {JSON.stringify(challenge.testCases[0].input)}
      </div>

      <div className="mb-3">
        <strong>Saída esperada:</strong> {JSON.stringify(challenge.testCases[0].expectedOutput)}
      </div>

      <div className="mb-4">
        <strong>Regras:</strong>
        <ul className="list-disc ml-5">
          {challenge.rules.map((r, i) => (
            <li key={i}>{r.description}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStart}
        className="bg-blue-500 px-4 py-2 rounded-lg"
      >
        Começar desafio
      </button>
    </div>
  );
}