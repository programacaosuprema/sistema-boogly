import * as Blockly from "blockly";

Blockly.Blocks['push'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("enfileirar").
      appendField(new Blockly.FieldNumber(0), "VALUE")

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(210);
  }
};

Blockly.Blocks['pop'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("desenfileirar");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(210);
  }
};