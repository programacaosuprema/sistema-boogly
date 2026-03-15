import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["enqueue"] = function (block) {

  const value = block.getFieldValue("VALUE");

  return `enqueue(${value})\n`;
};

javascriptGenerator.forBlock["dequeue"] = function () {

  return `dequeue()\n`;
};