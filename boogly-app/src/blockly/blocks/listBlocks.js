import * as Blockly from "blockly/core";
import "blockly/blocks";

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

/*Blockly.Blocks['list_create'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("criar lista")
        .appendField(new Blockly.FieldTextInput("minhaLista"), "NAME");
    this.appendStatementInput("DO").appendField("faça");
    this.setOutput(true, "Array");
    this.setColour(230);
  }
};*/