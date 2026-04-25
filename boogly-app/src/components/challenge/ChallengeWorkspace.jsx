import { useState } from "react";
import BlocklyEditor from "../blockly/BlocklyEditor";

export function ChallengeWorkspace({  onTest }) {

  const [code, setCode] = useState("");
  const [structure] = useState("list");

  return (
    <div className="flex flex-col gap-3 h-full">

      <div className="flex-1 bg-white/5 rounded-xl">
        <BlocklyEditor
          structure={structure}
          setCode={setCode}
        />
      </div>

      <button
        onClick={() => onTest(code, structure)}
        className="bg-green-500 px-4 py-2 rounded-lg"
      >
        Testar solução
      </button>
    </div>
  );
}