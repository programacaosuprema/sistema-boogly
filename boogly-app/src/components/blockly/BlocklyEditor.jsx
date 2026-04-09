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

export default function BlocklyEditor({ structure, setData, setCode}) {

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const debounceRef = useRef(null);

  // Escolhe toolbox baseado na estrutura
  const toolbox = useMemo(() => {
    if (structure === "stack") return stackToolbox;
    if (structure === "queue") return queueToolbox;
    if (structure === "list") return listToolbox;
    return queueToolbox;
  }, [structure]);

  useEffect(() => {

    if (!workspaceRef.current) {

      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox,
        grid: { spacing: 20, length: 3, colour: "#eac", snap: true },
        trashcan: true,

        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.9,
          maxScale: 2,
          minScale: 0.5,
          scaleSpeed: 1.1
        },

        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        }
      });

      workspaceRef.current.addChangeListener((event) => {

        if (event.isUiEvent) return;

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {

          const generatedCode = javascriptGenerator.workspaceToCode(workspaceRef.current); // getting the workspace generated code

          setCode(generatedCode);

          const steps = executeCode(generatedCode, structure) || [];

          if (steps.length > 0) {

            const lastStep = steps[steps.length - 1];

            // Detecta automaticamente qual estrutura veio
            const newState = lastStep?.state ?? [];

            setData(newState);

          } else {
            setData([]);
          }

        }, 200);

      });

    } else {
      workspaceRef.current.dispose();

      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox,
        grid: { spacing: 20, length: 3, colour: "#eac", snap: true },
        trashcan: true
      });
    }

    setTimeout(() => {
      Blockly.svgResize(workspaceRef.current);
    }, 100);

  }, [toolbox, structure, setData, setCode]);

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