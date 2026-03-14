import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["push"] = function (block, generator) {

  const value =
    generator.valueToCode(block, "VALUE", generator.ORDER_ATOMIC) || 0;

  return `push(${value});\n`;
};

javascriptGenerator.forBlock["pop"] = function () {

  return `pop();\n`;
};