import { StackSimulator } from "./StackSimulator";

export function executeCode(code) {

  const simulator = new StackSimulator();

  const lines = code.split("\n");

  lines.forEach(line => {

    if (line.startsWith("push")) {

      const value = line.match(/\d+/)?.[0];

      if (value) simulator.push(Number(value));

    }

    if (line.startsWith("pop")) {
      simulator.pop();
    }

  });

  return simulator.steps;

}