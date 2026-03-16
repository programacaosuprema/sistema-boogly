import React, { useEffect, useRef, useMemo } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

import {
  stackToolbox,
  queueToolbox,
  listToolbox
} from "../../blockly/toolboxes";

import "../../blockly/blocks/stackBlocks";
import "../../blockly/blocks/queueBlocks";
import "../../blockly/blocks/listBlocks";

import "../../blockly/generators/stackGenerator";
import "../../blockly/generators/listGenerator";
import "../../blockly/generators/queueGenerator";

import { executeCode } from "../simulator/executeCode";
import { javascriptGenerator } from "blockly/javascript";

export default function BlocklyEditor({ structure, setStack }) {

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const debounceRef = useRef(null);

  // Escolhe toolbox baseado na estrutura
  const toolbox = useMemo(() => {
    if (structure === "stack") return stackToolbox;
    if (structure === "queue") return queueToolbox;
    if (structure === "list") return listToolbox;
    return stackToolbox;
  }, [structure]);

  useEffect(() => {

    if (!workspaceRef.current) {

      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox,
        grid: { spacing: 20, length: 2, colour: "#eee", snap: true },
        trashcan: true
      });

      workspaceRef.current.addChangeListener((event) => {

        if (event.isUiEvent) return;

        // Debounce para evitar execução excessiva
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {

          const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
          const steps = executeCode(code) || [];

          if (steps.length > 0) {

            const lastStep = steps[steps.length - 1];

            const newStack = Array.isArray(lastStep)
              ? lastStep
              : (lastStep?.stack ?? []);

            setStack(newStack);

          } else {

            setStack([]);

          }

        }, 200);

      });

    } else {

      workspaceRef.current.updateToolbox(toolbox);

    }

    // Ajusta tamanho do workspace
    setTimeout(() => {
      Blockly.svgResize(workspaceRef.current);
    }, 100);

  }, [toolbox, setStack]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={blocklyDiv}
      style={{ height: "600px", width: "100%" }}
    />
  );

}