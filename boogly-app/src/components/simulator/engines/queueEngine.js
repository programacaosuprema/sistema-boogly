import { executeCode } from "../executeCode";

export function runQueue(code) {
  return executeCode(code, "queue");
}