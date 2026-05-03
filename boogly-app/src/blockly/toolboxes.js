export const stackToolbox = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "push" },
    { kind: "block", type: "pop" }
  ]
};

export const queueToolbox = {
  list: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "run_program" },
      { kind: "block", type: "queue_container" },
      { kind: "block", type: "queue_fixed" },
      { kind: "block", type: "enqueue" },
      { kind: "block", type: "dequeue" }
    ]
  },

  state: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "queue_front" },
      { kind: "block", type: "queue_size" },
      { kind: "block", type: "queue_is_empty" },
      { kind: "block", type: "show" }
    ]
  },

  variables: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "variable" },
      { kind: "block", type: "text" },
      {kind: "block", type: "number"}
    ]
  },

  conditions: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "compare" },
      { kind: "block", type: "if" },
      { kind: "block", type: "if_else" }
    ]
  },

  loops: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "for_each" }
    ]
  }
};

export const toolboxCategories = {

  // 🔵 LISTA (estrutura principal)
  list: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "run_program" },
      { kind: "block", type: "list_container" },
      { kind: "block", type: "list_fixed" },
      { kind: "block", type: "insert" },
      { kind: "block", type: "remove_last" },
      { kind: "block", type: "remove_first" },
      { kind: "block", type: "remove_item" },
      { kind: "block", type: "remove_index" },
      { kind: "block", type: "sublist" },
      { kind: "block", type: "invert" },
    ]
  },

  // 🟢 CONSULTA / ESTADO
  state: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "is_empty" },
      { kind: "block", type: "size" },
      { kind: "block", type: "list_index" },
      { kind: "block", type: "item_position" },
      { kind: "block", type: "show" }

    ]
  },

  // 🟣 ORDENAÇÃO
  sort: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "sort_ascending" },
      { kind: "block", type: "sort_descending" },
    ]
  },

  // 🟡 VARIÁVEIS
  variables: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "variable" },
      { kind: "block", type: "text" },

    ]
  },

  // 🟢 CONDIÇÕES
  conditions: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "compare" },
      { kind: "block", type: "if" },
      { kind: "block", type: "if_else" },
    ]
  },

  // 🟠 LAÇOS
  loops: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "for_each" },
    ]
  }

};