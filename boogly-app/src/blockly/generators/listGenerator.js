import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["insert"] = function (block) {

  const value = block.getFieldValue("VALUE");

  return `insert(${value})\n`;
};

javascriptGenerator.forBlock["remove"] = function () {

  return `remove()\n`;
};