import CGenerator from "./CGeneratorBase";

CGenerator.forBlock["queue_container"] = function (block) {
  const name = block.getFieldValue("NAME");
  return `criar_fila("${name}");\n`;
};

CGenerator.forBlock["enqueue"] = function (block) {
  const value = CGenerator.valueToCode(block, "VALUE", 0) || 0;
  const queue = block.getFieldValue("QUEUE");
  return `enfileirar("${queue}", ${value});\n`;
};

CGenerator.forBlock["dequeue"] = function (block) {
  const queue = block.getFieldValue("QUEUE");
  return `desenfileirar("${queue}");\n`;
};

CGenerator.forBlock["run_program"] = function (block) {
  const branch = CGenerator.statementToCode(block, "DO");

  return branch; // só retorna o conteúdo interno
};

export function generateQueueC(workspace) {
  CGenerator.init(workspace);

  const code = CGenerator.workspaceToCode(workspace);

  const header = `#include <stdio.h>\n\n`;

  return header + "int main() {\n" + code + "return 0;\n}";
}