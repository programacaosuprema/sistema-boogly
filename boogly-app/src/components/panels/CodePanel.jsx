// src/components/panels/CodePanel.jsx
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "../../theme/useTheme";
import ActionButton from "../ui/ActionButton";
import { Download, Clipboard } from "lucide-react";

export default function CodePanel({ cCode }) {
  const [language, setLanguage] = useState("c");
  const [copied, setCopied] = useState(false);

  const { theme } = useTheme();

  // copiar código
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
      setCopied(false);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([cCode || ""], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "codigo.c";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Erro ao baixar:", err);
    }
  };

  useEffect(() => {
    setCopied(false);
  }, [cCode]);

  return (
    // ocupa toda a altura do contêiner pai (use h-full no pai)
    <div className="flex flex-col h-full overflow-hidden" style={{ background: theme.panel, borderColor: theme.border }}>
      {/* HEADER fixo */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Código Gerado
          </h3>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm px-2 py-1 rounded"
            style={{ background: theme.toolbox, color: theme.text }}
          >
            <option value="c">C</option>
            {/* se quiser suportar mais linguagens, adicione aqui */}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton onClick={handleDownload} icon={Download} variant="success">
            Baixar .c
          </ActionButton>

          <ActionButton onClick={handleCopy} icon={Clipboard} variant="primary">
            {copied ? "Copiado!" : "Copiar código"}
          </ActionButton>
        </div>
      </div>

      {/* EDITOR - ocupa o resto do espaço */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          theme={theme.editor}
          value={cCode || ""}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false
          }}
        />
      </div>
    </div>
  );
}