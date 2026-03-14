import * as Blockly from "blockly";

Blockly.Blocks['enqueue'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("empilhar");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(160);
  }
};

Blockly.Blocks['dequeue'] = {
  init: function () {

    this.appendValueInput("VALUE")
      .appendField("desempilhar");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour(160);
  }
};