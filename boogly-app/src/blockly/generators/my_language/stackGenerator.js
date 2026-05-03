import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.forBlock["push"] = function (block) {

  const value = block.getFieldValue("VALUE");
   
  return `push(${value})\n`;
};

javascriptGenerator.forBlock["pop"] = function () {

  return `pop()\n`;
};