import { Copy } from "lucide-react";

export default function CodePanel({ cCode, output }) {

  function copyCode() {
    navigator.clipboard.writeText(cCode);
  }

  const lines = cCode?.split("\n") || [];

  return (
    <div className="h-56 bg-[#0f172a] rounded-xl border border-white/10 overflow-hidden flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">

        <div className="flex items-center gap-3">
          <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
            Código C
          </span>

          <span className="text-gray-400 text-sm">
            Estrutura de Dados
          </span>
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition"
        >
          <Copy size={16} />
          Copiar Código
        </button>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* CÓDIGO */}
        <div className="flex-1 overflow-auto p-3 font-mono text-sm text-green-400">

          {lines.map((line, index) => (
            <div key={index} className="flex gap-4">

              {/* NUMERO */}
              <span className="text-gray-500 w-6 text-right select-none">
                {index + 1}
              </span>

              {/* CÓDIGO */}
              <span className="whitespace-pre">
                {line || " "}
              </span>

            </div>
          ))}

        </div>

        {/* SAÍDA */}
        <div className="w-64 border-l border-white/10 bg-black/40 p-3 text-sm">

          <h3 className="text-gray-300 font-semibold mb-2">
            Saída
          </h3>

          <div className="text-gray-400 space-y-1">
            {output?.length ? (
              output.map((line, i) => (
                <div key={i}>{line}</div>
              ))
            ) : (
              <div>Nenhuma saída</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}