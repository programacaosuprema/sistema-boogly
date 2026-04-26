export function ErrorPage({ message }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Erro</h1>
      <p className="text-red-400 mb-4">{message || "Algo deu errado"}</p>

      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Tentar novamente
      </button>
    </div>
  );
}