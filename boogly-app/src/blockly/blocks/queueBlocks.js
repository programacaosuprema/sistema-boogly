import * as Blockly from "blockly/core";
import "blockly/blocks";

/* =====================================================
   🔹 UTIL: verificar nomes duplicados de filas
===================================================== */
function blockSameName(block) {
  if (!block.workspace) return;

  const name = block.getFieldValue("NAME");
  const allBlocks = block.workspace.getAllBlocks();

  const sameName = allBlocks.filter(b =>
    (b.type === "queue_container" || b.type === "queue_fixed") &&
    b.id !== block.id &&
    b.getFieldValue("NAME") === name
  );

  if (sameName.length > 0) {
    block.setWarningText("Já existe uma fila com esse nome!");
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(200);
  }
}

/* =====================================================
   🔹 UTIL: obter filas disponíveis
===================================================== */
function getQueues(workspace) {
  if (!workspace) return [["-", "-"]];

  const blocks = workspace.getAllBlocks();

  const queues = blocks
    .filter(b => b.type === "queue_container" || b.type === "queue_fixed")
    .map(b => b.getFieldValue("NAME"))
    .filter(name => name && name.trim() !== "");

  if (queues.length === 0) return [["-", "-"]];

  return queues.map(name => [name, name]);
}

/* =====================================================
   🔹 BLOCO: CRIAR FILA
===================================================== */
Blockly.Blocks["queue_container"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("criar fila")
      .appendField(new Blockly.FieldTextInput("minha_fila"), "NAME");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(130);
  },

  onchange: function () {
    blockSameName(this);
  }
};

/* =====================================================
   🔹 BLOCO: CRIAR FILA FIXA
===================================================== */
Blockly.Blocks["queue_fixed"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("criar fila")
      .appendField(new Blockly.FieldTextInput("minha_fila_fixa"), "NAME")
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
   🔹 BLOCO: ENFILEIRAR
   Ex.: enfileirar 10 na minha_fila
===================================================== */
Blockly.Blocks["enqueue"] = {
  init: function () {
    this.appendValueInput("VALUE")
      .setCheck("Number")
      .appendField("enfileirar");

    this.appendDummyInput()
      .appendField("na")
      .appendField(
        new Blockly.FieldDropdown(() => getQueues(this.workspace)),
        "QUEUE"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },

  onchange: function () {
    const field = this.getField("QUEUE");
    if (!field || !this.workspace) return;

    const options = getQueues(this.workspace);
    const current = field.getValue();

    const exists = options.some(([_, value]) => value === current);

    if (!exists) {
      field.setValue(options[0][1]);
    }
  }
};

/* =====================================================
   🔹 BLOCO: DESENFILEIRAR
   Ex.: desenfileirar da minha_fila
===================================================== */
Blockly.Blocks["dequeue"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("desenfileirar da")
      .appendField(
        new Blockly.FieldDropdown(() => getQueues(this.workspace)),
        "QUEUE"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },

  onchange: function () {
    const field = this.getField("QUEUE");
    if (!field || !this.workspace) return;

    const options = getQueues(this.workspace);
    const current = field.getValue();

    const exists = options.some(([_, value]) => value === current);

    if (!exists) {
      field.setValue(options[0][1]);
    }
  }
};

/* =====================================================
   🔹 BLOCO: VER INÍCIO DA FILA
===================================================== */
Blockly.Blocks["queue_front"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("ver início da")
      .appendField(new Blockly.FieldDropdown(() => getQueues(this.workspace)), "QUEUE");

    this.setOutput(true, null);
    this.setColour(60);
  }
};

/* =====================================================
   🔹 BLOCO: TAMANHO
===================================================== */
Blockly.Blocks["queue_size"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("tamanho da")
      .appendField(new Blockly.FieldDropdown(() => getQueues(this.workspace)), "QUEUE");

    this.setOutput(true, "Number");
    this.setColour(60);
  }
};

/* =====================================================
   🔹 BLOCO: VERIFICAR SE VAZIA
===================================================== */
Blockly.Blocks["queue_is_empty"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("fila")
      .appendField(new Blockly.FieldDropdown(() => getQueues(this.workspace)), "QUEUE")
      .appendField("está vazia");

    this.setOutput(true, "Boolean");
    this.setColour(60);
  }
};

/* =====================================================
   🔹 BLOCO: EXIBIR
   (reutiliza o estilo da lista)
===================================================== */
Blockly.Blocks["show"] = {
  init: function () {
    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField("exibir");

    this.appendDummyInput()
      .appendField("+");

    this.appendValueInput("VALUE").setCheck(null);

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);

    this.setTooltip("Exibe texto + valor");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["number"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), "VALUE");

    this.setOutput(true, "Number"); // 🔥 IMPORTANTE

    this.setColour(60);

    this.setTooltip("Número");
  }
};