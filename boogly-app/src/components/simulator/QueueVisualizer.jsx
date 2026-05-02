import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../theme/useTheme";

// 🔒 cor segura
function getNodeColor(index, theme) {
  const palette = [
    theme.primary,
    theme.success,
    theme.warning,
    theme.danger,
    theme.blocks?.structure,
    theme.blocks?.logic
  ].filter(Boolean);

  return palette[index % palette.length];
}

// 🔒 transforma qualquer valor em string segura
function safeValue(value) {
  if (value === null || value === undefined) return "∅";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function QueueVisualizer({ data }) {
  const { theme } = useTheme();

  // 🔒 sanitização global
  const safeData =
    data && typeof data === "object" && !Array.isArray(data)
      ? data
      : {};

  if (Object.keys(safeData).length === 0) {
    return (
      <div
        className="flex h-full items-center justify-center text-sm"
        style={{ color: theme.muted }}
      >
        Nenhuma fila
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(safeData).map(([name, queue]) => {

        // 🔒 garante array
        const safeQueue = Array.isArray(queue) ? queue : [];

        return (
          <div key={name || "queue"} className="space-y-3">

            {/* 🔤 NOME */}
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.text }}
            >
              {name || "Fila"}
            </h3>

            {/* 🚫 VAZIO */}
            {safeQueue.length === 0 ? (
              <div
                className="text-sm"
                style={{ color: theme.muted }}
              >
                Fila vazia
              </div>
            ) : (

              <div className="w-full overflow-x-auto">
                <div className="flex items-center gap-4 min-w-max py-3">

                  <AnimatePresence initial={false}>
                    {safeQueue.map((item, index) => {
                      const isFirst = index === 0;
                      const isLast = index === safeQueue.length - 1;

                      return (
                        <motion.div
                          key={`${name}-${index}-${safeValue(item)}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center gap-4"
                        >

                          {/* 🔵 NODE */}
                          <div className="flex flex-col items-center">

                            {/* INDEX */}
                            <div
                              className="mb-2 rounded-full px-3 py-1 text-xs"
                              style={{
                                background: theme.card,
                                color: theme.muted,
                                border: `1px solid ${theme.border}`
                              }}
                            >
                              {index}
                            </div>

                            {/* BLOCO */}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-lg font-bold shadow-lg"
                              style={{
                                background: getNodeColor(index, theme),
                                color: "#fff",
                                borderColor: theme.background
                              }}
                            >
                              {safeValue(item)}
                            </motion.div>

                            {/* LABEL */}
                            <div
                              className="mt-2 text-xs"
                              style={{ color: theme.muted }}
                            >
                              {isFirst && "Front"}
                              {isLast && "Rear"}
                            </div>

                          </div>

                          {/* ➡️ ARROW */}
                          {!isLast && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xl"
                              style={{ color: theme.muted }}
                            >
                              →
                            </motion.div>
                          )}

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                </div>
              </div>

            )}
          </div>
        );
      })}
    </div>
  );
}