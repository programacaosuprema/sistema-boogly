export const stackToolbox = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "push" },
    { kind: "block", type: "pop" }
  ]
};

export const queueToolbox = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "enqueue" },
    { kind: "block", type: "dequeue" }
  ]
};

export const listToolbox = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "insert" },
    { kind: "block", type: "remove" }/*,
    {kind: "block", type: "list_create"}*/
  ]
};