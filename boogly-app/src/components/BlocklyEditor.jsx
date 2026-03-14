// src/components/BlocklyEditor.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

import { toolbox } from "../blockly/toolbox";
import "../blockly/blocks/stackBlocks";
import "../blockly/blocks/queueBlocks";
import "../blockly/blocks/listBlocks";
import "../blockly/generators/stackGenerator";
import "../blockly/generators/queueGenerator";

import { javascriptGenerator } from "blockly/javascript";

export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {

  workspaceRef.current = Blockly.inject(blocklyDiv.current, {
    toolbox: toolbox,
    grid: { spacing: 20, length: 2, colour: "#eee", snap: true },
    trashcan: true,
  });

  console.log("push generator:", javascriptGenerator.forBlock["push"]);
  console.log("enqueue generator:", javascriptGenerator.forBlock["enqueue"]);


  const onChange = (event) => {

    if (!workspaceRef.current) return;

    // ignora eventos visuais
    if (event.isUiEvent) return;

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

    console.log("Código gerado:", code);

    const codeArea = document.getElementById("generatedCode");

    if (codeArea) {
      codeArea.textContent = code;
    }
  };

  workspaceRef.current.addChangeListener(onChange);

  return () => {
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }
  };

  }, []);

  return <div ref={blocklyDiv} style={{ height: "600px", width: "100%" }} />;
}