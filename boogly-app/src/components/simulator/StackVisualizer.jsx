import { motion, AnimatePresence } from "framer-motion";

const NODE_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#14B8A6",
  "#F59E0B",
  "#EF4444",
  "#22C55E",
];

function getNodeColor(index) {
  return NODE_COLORS[index % NODE_COLORS.length];
}

export default function StackVisualizer({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Nenhuma pilha
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      {Object.entries(data).map(([name, stack]) => (
        <div key={name} className="space-y-3 flex flex-col items-center">

          <h3 className="text-lg font-semibold text-gray-700">{name}</h3>

          {stack.length === 0 ? (
            <div className="text-sm text-gray-400">Pilha vazia</div>
          ) : (

            <div className="flex flex-col-reverse items-center gap-4">

              <AnimatePresence initial={false}>
                {stack.map((item, index) => {
                  const isTop = index === stack.length - 1;

                  return (
                    <motion.div
                      key={`${name}-${index}-${item}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 10 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3"
                    >

                      {/* LABEL LADO */}
                      <div className="text-xs text-gray-400 w-16 text-right">
                        Posição {index}
                      </div>

                      {/* NODE */}
                      <div className="flex flex-col items-center">

                        {isTop && (
                          <div className="mb-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            Topo
                          </div>
                        )}

                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white text-lg font-bold text-white shadow-lg"
                          style={{ backgroundColor: getNodeColor(index) }}
                        >
                          {item}
                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>

            </div>
          )}
        </div>
      ))}
    </div>
  );
}