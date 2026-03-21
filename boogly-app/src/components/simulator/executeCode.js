import { StackSimulator } from "./StackSimulator";
import { QueueSimulator } from "./QueueSimulator";
import { ListSimulator } from "./ListSimulator";

const simulators = {
  stack: StackSimulator,
  queue: QueueSimulator,
  list: ListSimulator
};

export function executeCode(code, structure) {

  const Simulator = simulators[structure];

  if (!Simulator) return [];

  const simulator = new Simulator();

  const lines = code.split("\n");

  lines.forEach(line => {

    const match = line.match(/(\w+)\((.*?)\)/);

    if (!match) return;

    const operation = match[1];

    const args = match[2]
      ? match[2].split(",").map(arg => Number(arg.trim()))
      : [];

    if (typeof simulator[operation] === "function") {
      simulator[operation](...args);
    }

  });

  return simulator.steps;
}