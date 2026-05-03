import { Generator } from "blockly";

export const CGenerator = new Generator("C");

// 🔹 EXPRESSÕES COMUNS
CGenerator.forBlock['compare'] = function(block) {
  let a = CGenerator.valueToCode(block, "A", 0) || "0";
  let b = CGenerator.valueToCode(block, "B", 0) || "0";
  const op = block.getFieldValue('OP');

  return [`${a} ${op} ${b}`, CGenerator.ORDER_NONE];
};

CGenerator.forBlock['variable'] = function(block) {
  return [block.getFieldValue('VAR'), CGenerator.ORDER_ATOMIC];
};

CGenerator.forBlock['text'] = function(block) {
  const text = block.getFieldValue('TEXT') || "";
  return [`"${text}"`, CGenerator.ORDER_ATOMIC];
};

export default CGenerator;