import { useState } from "react";

export function ChallengeIntro({ challenge, onStart }) {
  const [tab, setTab] = useState("descricao");
  const test = challenge.testCases[0];

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center p-4">
      
      <div className="w-full max-w-4xl h-full max-h-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-5 py-3 text-lg font-bold shrink-0">
          {challenge.title}
        </div>

        {/* TABS */}
        <div className="flex border-b shrink-0">
          {["descricao", "entrada", "regras"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold ${
                tab === t
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 text-sm text-gray-700 overflow-hidden">

          {tab === "descricao" && (
            <p className="leading-relaxed line-clamp-4">
              {challenge.description}
            </p>
          )}

          {tab === "entrada" && (
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Entrada:</span>
                <div className="mt-1 bg-blue-500 text-white p-2 rounded text-xs break-words">
                  {JSON.stringify(test.input)}
                </div>
              </div>

              <div>
                <span className="font-semibold">Saída:</span>
                <div className="mt-1 bg-orange-400 text-white p-2 rounded text-xs break-words">
                  {JSON.stringify(test.expectedOutput)}
                </div>
              </div>
            </div>
          )}

          {tab === "regras" && (
            <ul className="space-y-2 text-xs">
              {challenge.rules.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-500">✔</span>
                  <span className="truncate">{r.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t flex justify-center shrink-0">
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Começar desafio
          </button>
        </div>

      </div>
    </div>
  );
}