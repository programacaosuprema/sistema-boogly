import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["run_program"] = function (block) {
  const branch = javascriptGenerator.statementToCode(block, "DO");

  return `// INICIAR_EXECUCAO\n${branch}// FIM_EXECUCAO\n`;
};

javascriptGenerator.forBlock["queue_container"] = function (block) {
  const name = block.getFieldValue("NAME");
  return `criar_fila("${name}")\n`;
};

javascriptGenerator.forBlock["queue_fixed"] = function (block) {
  const name = block.getFieldValue("NAME");
  const size = Number(block.getFieldValue("SIZE") || 0);
  return `criar_fila_fixa("${name}", ${size})\n`;
};

javascriptGenerator.forBlock["enqueue"] = function (block) {
  const value = javascriptGenerator.valueToCode(block, "VALUE", 0) || 0;
  const queue = block.getFieldValue("QUEUE");
  return `enfileirar("${queue}", ${value})\n`;
};

javascriptGenerator.forBlock["dequeue"] = function (block) {
  const queue = block.getFieldValue("QUEUE");
  return `desenfileirar("${queue}")\n`;
};

javascriptGenerator.forBlock["queue_front"] = function (block) {
  const queue = block.getFieldValue("QUEUE");
  return [`ver_inicio("${queue}")`, 0];
};

javascriptGenerator.forBlock["queue_size"] = function (block) {
  const queue = block.getFieldValue("QUEUE");
  return [`tamanho_fila("${queue}")`, 0];
};

javascriptGenerator.forBlock["queue_is_empty"] = function (block) {
  const queue = block.getFieldValue("QUEUE");
  return [`fila_vazia("${queue}")`, 0];
};

javascriptGenerator.forBlock["number"] = function (block) {
  const value = block.getFieldValue("VALUE");
  return [value, 0];
};