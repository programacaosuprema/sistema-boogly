import { StackSimulator } from "../simulator/StackSimulator";
import { QueueSimulator } from "../simulator/QueueSimulator";
import { ListSimulator } from "../simulator/ListSimulator";

const simulators = {
  stack: StackSimulator,
  queue: QueueSimulator,
  list: ListSimulator
};

export function executeChallenge(code, structure, testCases = []) {

  const Simulator = simulators[structure];
  if (!Simulator) return { success: false };

  let results = [];

  for (const test of testCases) {

    const simulator = new Simulator();
    const lines = code.split("\n");

    // 🔥 inicializa input
    if (structure === "list") {
      simulator.criar_lista("lista");

      test.input.forEach(v => {
        simulator.inserir(v, "lista");
      });
    }

    lines.forEach(line => {

      const match = line.match(/(\w+)\((.*?)\)/);
      if (!match) return;

      const operation = match[1];

      const args = match[2]
        ? match[2].split(",").map(arg => {
            const value = arg.trim();

            if (value.startsWith('"') && value.endsWith('"')) {
              return value.slice(1, -1);
            }

            return isNaN(value) ? value : Number(value);
          })
        : [];

      if (typeof simulator[operation] === "function") {
        simulator[operation](...args);
      }

    });

    const output = simulator.getState()["lista"] || [];

    const passed =
      JSON.stringify(output) === JSON.stringify(test.expectedOutput);

    results.push({
      input: test.input,
      expected: test.expectedOutput,
      output,
      passed
    });
  }

  return {
    success: results.every(r => r.passed),
    results
  };
}