import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["queue_container"] = function (block) {

  const name = block.getFieldValue("NAME");

  return `criar_fila("${name}")\n`;
};

javascriptGenerator.forBlock["enqueue"] = function (block) {
  const value = block.getFieldValue("VALUE");

  return `desenfileirar(${value})\n`;
};

javascriptGenerator.forBlock["dequeue"] = function () {

  return `enfileira()\n`;
};