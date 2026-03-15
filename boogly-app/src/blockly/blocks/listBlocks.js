import * as Blockly from "blockly";

Blockly.Blocks['insert'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("inserir").
      appendField(new Blockly.FieldNumber(0), "VALUE");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(443);
  }
};

Blockly.Blocks['remove'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("remover");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(443);
  }
};