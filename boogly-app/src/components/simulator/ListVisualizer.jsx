// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const NODE_COLORS = [
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#14B8A6", // teal
  "#0008FD", // strong blue
  "#F023AF", // pink
  "#22C55E", // green
  "#06B6D4", // cyan
  "#6366F1", // indigo
  "#0EA5E9", // sky blue
  "#10B981", // emerald
  "#7C3AED", // deep violet
  "#0891B2", // dark cyan
  "#2563EB", // darker blue
  "#9333EA", // purple
  "#059669", // dark green
];

function getNodeColor(index) {
  return NODE_COLORS[index % NODE_COLORS.length];
}

export default function ListVisualizer({ data, step }) {

  const activeIndex = step?.type === "traverse" ? step.index : null;

  const removingIndex = step?.type === "highlight_remove" ? step.index : null;

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Nenhuma lista
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(data).map(([name, list]) => (
        <div key={name} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">
            {name}
          </h3>

          {list.length === 0 ? (
            <div className="text-sm text-gray-400">
              Lista vazia
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex items-center gap-4 min-w-max py-3">
                <AnimatePresence initial={false}>
                  {list.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === list.length - 1;

                    //const isActive = index === activeIndex;
                    //const isRemoving = index === removingIndex;

                    return (
                      <motion.div
                        key={`${name}-${index}-${item}`}
                        layout
                        initial={{ opacity: 0, scale: 0.7, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          scale: 0.3,
                          y: 40,
                          rotate: 10
                        }}
                        transition={{ duration: 0.35 }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex flex-col items-center">

                          {/* POSIÇÃO */}
                          <div className="mb-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                            Posição {index}
                          </div>

                          <div className="flex flex-col items-center">

                            {/* INÍCIO */}
                            {isFirst && (
                              <div className="mb-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Início
                              </div>
                            )}

                            {/* FIM */}
                            {isLast && (
                              <div className="mb-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                Fim
                              </div>
                            )}

                            {/* 🔥 NODO */}
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-lg font-bold text-white shadow-lg transition-all duration-300 ${
                                activeIndex === index
                                  ? "scale-125 ring-4 ring-yellow-400"
                                  : removingIndex === index
                                  ? "scale-125 ring-4 ring-red-500 animate-bounce"
                                  : "border-white"
                                }`}
                                style={{
                                  backgroundColor:
                                    removingIndex === index
                                      ? "#DC2626" // 🔴 alvo
                                      : activeIndex === index
                                      ? "#FACC15" // 🟡 percurso
                                      : getNodeColor(index)
                                }}
                              >
                            {item}
                          </div>

                          </div>
                        </div>

                        {/* SETA */}
                        {!isLast && (
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-xs font-medium text-gray-400 mb-2">
                              Próximo
                            </div>
                            <svg
                              width="42"
                              height="24"
                              viewBox="0 0 42 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-gray-400"
                            >
                              <path
                                d="M2 12H36"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M28 5L36 12L28 19"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}