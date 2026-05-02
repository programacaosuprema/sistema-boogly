import { useState } from "react";
import BlocklyEditor from "../blockly/BlocklyEditor";
import { useTheme } from "../../theme/useTheme";

export function ChallengeWorkspace({ onTest }) {
  const [code, setCode] = useState("");
  const [structure] = useState("list");

  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col gap-3 h-full"
      style={{ background: theme.background }}
    >

      {/* 🧠 EDITOR */}
      <div
        className="flex-1 rounded-xl overflow-hidden"
        style={{
          background: theme.panel,
          border: `1px solid ${theme.border}`
        }}
      >
        <BlocklyEditor
          structure={structure}
          setCode={setCode}
        />
      </div>

      {/* 🚀 BOTÃO */}
      <button
        onClick={() => onTest(code, structure)}
        className="px-4 py-2 rounded-lg font-semibold transition"
        style={{
          background: theme.success,
          color: "#fff"
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = theme.hover)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = theme.success)
        }
      >
        Testar solução
      </button>

    </div>
  );
}