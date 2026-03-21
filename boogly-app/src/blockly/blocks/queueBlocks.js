import * as Blockly from "blockly";

Blockly.Blocks['queue_container'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("fila")
      .appendField(new Blockly.FieldTextInput("minhaFila"), "NAME");

    this.appendStatementInput("OPERATIONS")
      .setCheck("QUEUE_OPERATION")
      .appendField("faça");

    this.setColour(180);
  }
};

Blockly.Blocks['enqueue'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("enfileirar").
      appendField(new Blockly.FieldNumber(0), "VALUE");

    this.setPreviousStatement(true, "QUEUE_OPERATION");
    this.setNextStatement(true, "QUEUE_OPERATION");

    this.setColour(160);
  }
};

Blockly.Blocks['dequeue'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("desenfileirar");

    this.setPreviousStatement(true, "QUEUE_OPERATION");
    this.setNextStatement(true, "QUEUE_OPERATION");

    this.setColour(160);
  }
};