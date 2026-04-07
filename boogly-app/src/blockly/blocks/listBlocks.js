import * as Blockly from "blockly/core";
import "blockly/blocks";

/* =====================================================
   🔹 UTIL: verificar nomes duplicados de listas
===================================================== */
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

/* =====================================================
   🔹 UTIL: obter listas disponíveis
===================================================== */
function getLists(workspace) {
  if (!workspace) return [["-", "-"]];

  const blocks = workspace.getAllBlocks();

  const lists = blocks
    .filter(b => b.type === "list_container" || b.type === "list_fixed")
    .map(b => b.getFieldValue("NAME"))
    .filter(name => name && name.trim() !== "");

  if (lists.length === 0) return [["-", "-"]];

  return lists.map(name => [name, name]);
}

/* =====================================================
   🔹 BLOCO: LISTA SIMPLES
===================================================== */
Blockly.Blocks['list_container'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("criar lista")
      .appendField(new Blockly.FieldTextInput("minha_lista"), "NAME");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(130);
  },

  onchange: function () {
    blockSameName(this);
  }
};

/* =====================================================
   🔹 BLOCO: LISTA FIXA
===================================================== */
Blockly.Blocks['list_fixed'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("criar lista")
      .appendField(new Blockly.FieldTextInput("minha_lista_fixa"), "NAME")
      .appendField("tamanho")
      .appendField(new Blockly.FieldNumber(3, 0), "SIZE");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(130);
  },

  onchange: function () {
    blockSameName(this);
  }
};

/* =====================================================
   🔹 BLOCO: INSERIR
===================================================== */
Blockly.Blocks['insert'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("inserir")
      .appendField(new Blockly.FieldNumber(0), "VALUE")
      .appendField("em")
      .appendField(new Blockly.FieldDropdown(() => getLists(this.workspace)), "LIST");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
  }
};

/* =====================================================
   🔹 BLOCO: REMOVER (último)
===================================================== */
Blockly.Blocks['remove'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("remover último de")
      .appendField(new Blockly.FieldDropdown(() => getLists(this.workspace)), "LIST");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(0);
  }
};

/* =====================================================
   🔹 BLOCO: REMOVER ITEM (valor)
===================================================== */
Blockly.Blocks['remove_item'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("remover item")
      .appendField(new Blockly.FieldNumber(0), "VALUE")
      .appendField("de")
      .appendField(new Blockly.FieldDropdown(() => getLists(this.workspace)), "LIST");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(0);
  }
};

/* =====================================================
   🔹 BLOCO: REMOVER POR ÍNDICE
===================================================== */
Blockly.Blocks['remove_index'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("remover posição")
      .appendField(new Blockly.FieldNumber(0, 0), "INDEX")
      .appendField("de")
      .appendField(new Blockly.FieldDropdown(() => getLists(this.workspace)), "LIST");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(0);
  }
};

/* =====================================================
   🔹 BLOCO: TAMANHO
===================================================== */
Blockly.Blocks['size'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("tamanho de")
      .appendField(new Blockly.FieldDropdown(() => getLists(this.workspace)), "LIST");

    this.setOutput(true, "Number");
    this.setColour(200);
  }
};

/* =====================================================
   🔹 BLOCO: VERIFICAR SE VAZIA
===================================================== */
Blockly.Blocks['is_empty'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("lista")
      .appendField(new Blockly.FieldDropdown(() => getLists(this.workspace)), "LIST")
      .appendField("está vazia");

    this.setOutput(true, "Boolean");
    this.setColour(200);
  }
};