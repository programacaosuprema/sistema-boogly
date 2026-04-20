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

import { cGenerator } from "../../blockly/generators/cGenerator";

export default function BlocklyEditor({
  structure,
  setCode,
  setCCode,
  setSteps,          
  setCurrentStep,
}) {

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const debounceRef = useRef(null);

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

          const generatedExecCode = javascriptGenerator.workspaceToCode(workspaceRef.current);
          setCode(generatedExecCode);

          // 🔥 NOVO → código C
          const generatedCCode = cGenerator(workspaceRef.current);
          console.log(generatedCCode);
          setCCode(generatedCCode);

          // 🔥 EXECUÇÃO
          const steps = executeCode(generatedExecCode, structure);
          setSteps(steps);
          setCurrentStep(0);


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

  }, [toolbox, structure, setSteps, setCurrentStep, setCode]);

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