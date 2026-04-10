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

export default function QueueVisualizer({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Nenhuma fila
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(data).map(([name, queue]) => (
        <div key={name} className="space-y-3">

          <h3 className="text-lg font-semibold text-gray-700">{name}</h3>

          {queue.length === 0 ? (
            <div className="text-sm text-gray-400">Fila vazia</div>
          ) : (

            <div className="w-full overflow-x-auto">
              <div className="flex items-center gap-4 min-w-max py-3">

                <AnimatePresence initial={false}>
                  {queue.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === queue.length - 1;

                    return (
                      <motion.div
                        key={`${name}-${index}-${item}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-4"
                      >

                        {/* NODE */}
                        <div className="flex flex-col items-center">

                          <div className="mb-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                            {index}
                          </div>

                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white text-lg font-bold text-white shadow-lg"
                            style={{ backgroundColor: getNodeColor(index) }}
                          >
                            {item}
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            {isFirst && "Início"}
                            {isLast && "Fim"}
                          </div>

                        </div>

                        {/* ARROW */}
                        {!isLast && (
                          <div className="text-gray-400 text-xl">→</div>
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