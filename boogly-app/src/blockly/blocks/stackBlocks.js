import * as Blockly from "blockly";

Blockly.Blocks['push'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("empilhar").
      appendField(new Blockly.FieldNumber(0), "VALUE")

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(210);
  }
};

Blockly.Blocks['pop'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("desemplilhar");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(210);
  }
};