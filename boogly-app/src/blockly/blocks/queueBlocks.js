import * as Blockly from "blockly";

Blockly.Blocks['enqueue'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("enfileirar").
      appendField(new Blockly.FieldNumber(0), "VALUE");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(160);
  }
};

Blockly.Blocks['dequeue'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("desenfileirar");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(160);
  }
};