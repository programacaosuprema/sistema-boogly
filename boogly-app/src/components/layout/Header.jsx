import { Star, Trophy } from "lucide-react";

const STRUCTURE_LABELS = {
  list: "Lista",
  stack: "Pilha",
  queue: "Fila",
};

export default function Header({ structure, points = 950 }) {
  const mode = STRUCTURE_LABELS[structure] || "Lista";

  return (
    <div className="w-full h-full flex items-center justify-between px-6">

      {/* 🔥 ESQUERDA → LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-md" />
        <h1 className="text-lg font-semibold text-white">
          Estrutura de Dados com Blocos
        </h1>
      </div>

      {/* 🔥 DIREITA → CONTROLES */}
      <div className="flex items-center gap-3">

        {/* MODO */}
        <div className="px-4 py-2 bg-white/10 rounded-full text-sm text-white">
          modo: <span className="font-semibold">{mode}</span>
        </div>

        {/* DESAFIOS */}
        <button className="px-4 py-2 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 transition">
          desafios {mode.toLowerCase()}
        </button>

        {/* PONTOS */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-white">
          <Star className="w-4 h-4 text-yellow-400" />
          {points} pontos
        </div>

        {/* RANKING */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 transition">
          <Trophy className="w-4 h-4 text-yellow-300" />
          ranking
        </button>

      </div>
    </div>
  );
}