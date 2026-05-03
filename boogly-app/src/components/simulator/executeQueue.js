import { QueueSimulator } from "./QueueSimulator";

export function executeQueue(code) {
  const simulator = new QueueSimulator();

  if (!code.includes("// INICIAR_EXECUCAO")) {
    return [
      {
        type: "error",
        message: "Adicione o bloco 'Quando EXECUTAR for clicado' para iniciar o programa.",
        state: {}
      }
    ];
  }

  const lines = code.split("\n");

  let isRunning = false;
  let shouldExecute = true;
  const conditionStack = [];

  lines.forEach((line) => {
    line = line.trim();

    if (line === "// INICIAR_EXECUCAO") {
      isRunning = true;
      return;
    }

    if (line === "// FIM_EXECUCAO") {
      isRunning = false;
      return;
    }

    if (!isRunning) return;

    if (line.startsWith("if")) {
      const condition = line.match(/if\s*\((.*)\)/)?.[1];
      let result = false;

      try {
        result = eval(condition);
      } catch {
        result = false;
      }

      conditionStack.push(result);
      shouldExecute = result;
      return;
    }

    if (line.startsWith("} else {")) {
      const last = conditionStack.pop();
      const result = !last;
      conditionStack.push(result);
      shouldExecute = result;
      return;
    }

    if (line === "}") {
      conditionStack.pop();
      shouldExecute =
        conditionStack.length === 0
          ? true
          : conditionStack[conditionStack.length - 1];
      return;
    }

    if (!shouldExecute) return;

    const match = line.match(/(\w+)\((.*?)\)/);
    if (!match) return;

    const operation = match[1];
    const args = match[2]
      ? match[2].split(",").map((arg) => {
          const value = arg.trim();

          if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
          }

          return Number(value);
        })
      : [];

    if (typeof simulator[operation] === "function") {
      simulator[operation](...args);
    }
  });

  return simulator.steps;
}