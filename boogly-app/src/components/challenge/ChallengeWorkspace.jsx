import { useState } from "react";
import BlocklyEditor from "../blockly/BlocklyEditor";
import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";

export function ChallengeWorkspace({ onTest }) {
  const [code, setCode] = useState("");
  const [structure] = useState("list");
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const { showError } = useError();

  async function handleTest() {
    if (!onTest) {
      showError({ message: "Função de teste não disponível" });
      return;
    }

    if (!code || code.trim().length === 0) {
      showError({ message: "Nenhum código gerado ainda" });
      return;
    }

    try {
      setLoading(true);

      await onTest(code, structure);

    } catch (err) {
      console.error(err);

      showError({
        message: "Erro ao testar a solução"
      });

    } finally {
      setLoading(false);
    }
  }

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
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 rounded-lg font-semibold transition"
        style={{
          background: loading ? theme.hover : theme.success,
          color: "#fff",
          opacity: loading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!loading)
            e.currentTarget.style.background = theme.hover;
        }}
        onMouseLeave={(e) => {
          if (!loading)
            e.currentTarget.style.background = theme.success;
        }}
      >
        {loading ? "Testando..." : "Testar solução"}
      </button>

    </div>
  );
}