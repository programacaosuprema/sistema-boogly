import { useEffect, useRef } from "react";
import * as Blockly from "blockly";

import { toolbox } from "../blockly/toolbox";

import "../blockly/blocks/stackBlocks";

export default function BlocklyEditor() {

  const blocklyDiv = useRef(null);

  useEffect(() => {

    Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox
    });

  }, []);

  return (
    <div
      ref={blocklyDiv}
      style={{ height: "500px", width: "100%" }}
    />
  );
}