import * as Blockly from "blockly/core";
import "blockly/blocks";

function blockSameName(block) {

  if (!block.workspace) return;

  const name = block.getFieldValue("NAME");

  const allBlocks = block.workspace.getAllBlocks();

  const sameName = allBlocks.filter(b =>
    (b.type === "list_container" || b.type === "list_fixed") &&
    b.id !== block.id &&
    b.getFieldValue("NAME") === name
  );

  if (sameName.length > 0) {
    block.setWarningText("Já existe uma lista com esse nome!");
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(230);
  }
}

Blockly.Blocks['list_container'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("lista")
      .appendField(new Blockly.FieldTextInput("minha lista"), "NAME");

    this.appendStatementInput("OPERATIONS")
      .setCheck("LIST_OPERATION")
      .appendField("faça");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
  },
    onchange: function () {
      blockSameName(this);
  }
  
};

Blockly.Blocks['list_fixed'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("lista")
      .appendField(new Blockly.FieldTextInput("minha lista fixa"), "NAME")
      .appendField("tamanho")
      .appendField(new Blockly.FieldNumber(3, 0), "SIZE");

    this.appendStatementInput("OPERATIONS")
      .setCheck("LIST_OPERATION")
      .appendField("faça");

    this.setColour(230);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },

  onchange: function () {
    blockSameName(this);
    if (!this.workspace) return;

    const maxSize = Number(this.getFieldValue("SIZE"));
    let current = this.getInputTargetBlock("OPERATIONS");

    let count = 0;

    while (current) {
      count++;
      current = current.getNextBlock();
    }

    if (count > maxSize) {
      this.setWarningText(`Limite de ${maxSize} elementos excedido!`);
      this.setColour(0);
    } else {
      this.setWarningText(null);
    }
  }
};

Blockly.Blocks['insert'] = {
  init: function () {

    this.appendDummyInput("VALUE")
      .appendField("inserir").
      appendField(new Blockly.FieldNumber(0), "VALUE");

    this.setPreviousStatement(true, "LIST_OPERATION");
    this.setNextStatement(true, "LIST_OPERATION"); //this fix the list dependencie

    this.setColour(333);
  }
};

Blockly.Blocks['remove'] = {
  init: function () {

    this.appendDummyInput("VALUE")
      .appendField("remover");

    this.setPreviousStatement(true, "LIST_OPERATION");
    this.setNextStatement(true, "LIST_OPERATION");

    this.setColour(443);
  }
};

Blockly.Blocks['remove_item'] = {
  init: function () {

    this.appendDummyInput()
      .appendField("remover item")
      .appendField(new Blockly.FieldNumber(0), "VALUE");

    this.setPreviousStatement(true, "LIST_OPERATION");
    this.setNextStatement(true, "LIST_OPERATION");

    this.setColour(443);
  }
};

Blockly.Blocks['remove_index'] = {
  init: function () {

    this.appendDummyInput()
      .appendField("remover posição")
      .appendField(new Blockly.FieldNumber(0, 0), "INDEX");

    this.setPreviousStatement(true, "LIST_OPERATION");
    this.setNextStatement(true, "LIST_OPERATION");

    this.setColour(443);
  }
};

Blockly.Blocks['size'] = {
  init: function () {

    this.appendDummyInput()
      .appendField("tamanho da lista");

    this.setOutput(true, "Number"); 

    this.setColour(200);
  }
};

Blockly.Blocks['is_empty'] = {
  init: function () {

    this.appendDummyInput()
      .appendField("lista está vazia");

    this.setOutput(true, "Boolean");

    this.setColour(200);
  }
};