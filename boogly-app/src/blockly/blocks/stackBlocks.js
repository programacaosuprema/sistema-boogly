import * as Blockly from "blockly";

Blockly.Blocks['stack_container'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("pilha")
      .appendField(new Blockly.FieldTextInput("minhaPilha"), "NAME");

    this.appendStatementInput("OPERATIONS")
      .setCheck("STACK_OPERATION") // 🔥 só aceita fila
      .appendField("faça");

    this.setColour(180);
  }
};

Blockly.Blocks['push'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("empilhar").
      appendField(new Blockly.FieldNumber(0), "VALUE")

    this.setPreviousStatement(true, "STACK_OPERATION");
    this.setNextStatement(true, "STACK_OPERATION");

    this.setColour(210);
  }
};

Blockly.Blocks['pop'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("desemplilhar");

    this.setPreviousStatement(true, "STACK_OPERATION");
    this.setNextStatement(true, "STACK_OPERATION");

    this.setColour(210);
  }
};