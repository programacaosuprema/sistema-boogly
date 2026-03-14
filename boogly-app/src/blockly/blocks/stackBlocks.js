import * as Blockly from "blockly";

Blockly.Blocks['push'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .setCheck("Number")
      .appendField("empilhar");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(210);
  }
};