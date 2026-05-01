import { StackSimulator } from "./StackSimulator";
import { QueueSimulator } from "./QueueSimulator";
import { ListSimulator } from "./ListSimulator";

const simulators = {
  stack: StackSimulator,
  queue: QueueSimulator,
  list: ListSimulator
};

export function executeCode(code, structure) {

  const operationMap = {
    insert: "inserir",
    remove_last: "remover_ultimo",
    remove_first: "remover_primeiro",
    remove_item: "remover_item",
    remove_index: "remover_da_posicao",
    sublist: "sublista",
    invert: "inverter",
    sort_ascending: "ordenar_crescente",
    sort_descending: "ordenar_decrescente",
    list_container: "criar_lista",
    list_fixed: "criar_lista_limitada"
  };

  const Simulator = simulators[structure];
  if (!Simulator) return [];

  // ❌ sem bloco EXECUTAR
  if (!code.includes("// INICIAR_EXECUCAO")) {
    return [
      {
        type: "error",
        message: "Adicione o bloco 'Quando EXECUTAR for clicado' para iniciar o programa.",
        state: {}
      }
    ];
  }

  // 🔥 bloco existe mas está vazio
  const runContent = code.split("// INICIAR_EXECUCAO")[1]?.split("// FIM_EXECUCAO")[0];

  if (!runContent || runContent.trim() === "") {
    return [
      {
        type: "warning",
        message: "O bloco EXECUTAR precisa ter instruções conectadas.",
        state: {}
      }
    ];
  }

  const linesInsideRun = runContent
  .split("\n")
  .map(line => line.trim())
  .filter(Boolean);

  let hasListCreation = false;

  for (const line of linesInsideRun) {

    // 🔥 criação de lista
    if (
      line.includes("list_container") ||
      line.includes("list_fixed")
    ) {
      hasListCreation = true;
    }

    // 🔥 TODAS operações reais de lista
    const isListOperation =
      line.includes("insert(") ||
      line.includes("remove_last(") ||
      line.includes("remove_first(") ||
      line.includes("remove_item(") ||
      line.includes("remove_index(") ||
      line.includes("sublist(") ||
      line.includes("invert(") ||
      line.includes("sort_ascending(") ||
      line.includes("sort_descending(");

    // ❌ erro: usou antes de criar
    if (isListOperation && !hasListCreation) {
      return [
        {
          type: "error",
          message: "Crie a lista antes de usar operações como inserir, remover ou ordenar.",
          state: {}
        }
      ];
    }
  }

  const simulator = new Simulator();

  const lines = code.split("\n");
  let isRunning = false;

  lines.forEach(line => {

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

    const match = line.match(/(\w+)\((.*?)\)/);
    if (!match) return;

    const rawOperation = match[1];
    const operation = operationMap[rawOperation] || rawOperation;

    const args = match[2]
      ? match[2].split(",").map(arg => {
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