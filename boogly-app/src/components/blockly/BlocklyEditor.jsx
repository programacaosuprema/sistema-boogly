import React, { useEffect, useRef } from "react";
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

export default function BlocklyEditor({ structure }) {

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getToolbox() {

    if (structure === "stack") return stackToolbox;
    if (structure === "queue") return queueToolbox;
    if (structure === "list") return listToolbox;

  }

  useEffect(() => {

    const toolbox = getToolbox();

    if (!workspaceRef.current) {

      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        grid: { spacing: 20, length: 2, colour: "#eee", snap: true },
        trashcan: true
      });

    } else {

      workspaceRef.current.updateToolbox(toolbox);

    }

  }, [getToolbox, structure]);

  return (
    <div
      ref={blocklyDiv}
      style={{ height: "600px", width: "100%" }}
    />
  );

}