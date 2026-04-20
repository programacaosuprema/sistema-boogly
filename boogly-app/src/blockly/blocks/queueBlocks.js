import * as Blockly from "blockly";

Blockly.Blocks['queue_container'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("criar fila")
      .appendField(new Blockly.FieldTextInput("minha_fila"), "NAME");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(130);
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