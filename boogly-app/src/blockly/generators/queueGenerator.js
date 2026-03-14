import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["enqueue"] = function (block, generator) {

  const value = generator.valueToCode(block, "VALUE", generator.ORDER_ATOMIC) || 0;

  return `enqueue(${value});\n`;
};

javascriptGenerator.forBlock["dequeue"] = function () {

  return `dequeue();\n`;
};