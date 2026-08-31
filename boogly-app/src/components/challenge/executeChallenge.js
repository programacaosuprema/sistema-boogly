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

  if (!Simulator) {
    return { success: false, error: "Invalid structure" };
  }

  const results = [];

  for (const test of testCases) {
    const simulator = new Simulator();

    // 🔥 1. INICIALIZAÇÃO CORRETA
    if (structure === "list") {
      simulator.criar_lista?.("lista");
      test.input.forEach(v => simulator.inserir?.(v, "lista"));
    }

    if (structure === "stack") {
      simulator.criar_pilha?.("pilha");
      test.input.forEach(v => simulator.empilhar?.(v, "pilha"));
    }

    if (structure === "queue") {
      simulator.criar_fila?.("fila");
      test.input.forEach(v => simulator.enfileirar?.(v, "fila"));
    }

    // 🔥 2. EXECUÇÃO DO CÓDIGO (regex corrigida)
    const lines = code.split("\n");

    for (const line of lines) {
      const match = line.match(/(\w+)\((.*?)\)/); // ✅ corrigido

      if (!match) continue;

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
    }

    // 🔥 3. PEGAR ESTADO CORRETO
    const state = simulator.getState();

    let output = [];

    if (structure === "list") {
      output = state.lista?.data || state.lista || [];
    }

    if (structure === "stack") {
      output = state.pilha?.data || state.pilha || [];
    }

    if (structure === "queue") {
      output = state.fila?.data || state.fila || [];
    }

    // 🔥 4. VALIDAÇÃO
    const passed =
      JSON.stringify(output) === JSON.stringify(test.expectedOutput);

    results.push({
      input: test.input,
      expected: test.expectedOutput,
      output,
      passed
    });
  }

  const first = results[0];

  // 🔥 5. RETORNO COMPATÍVEL COM FRONT
  return {
    success: results.every(r => r.passed),
    output: first?.output || [],
    expected: first?.expected || [],
    results
  };
}