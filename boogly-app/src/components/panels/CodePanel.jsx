import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "../../theme/useTheme";
import ActionButton from "../ui/ActionButton";
import { Download, Clipboard } from "lucide-react";

export default function CodePanel({ cCode }) {
  const [height, setHeight] = useState(220);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("c");
  const [copied, setCopied] = useState(false);

  const { theme } = useTheme();

  const startY = useRef(0);
  const startHeight = useRef(0);

  // 🔥 copiar código
  const handleCopy = () => {
    navigator.clipboard.writeText(cCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  // 🔥 iniciar drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = height;
  };

  // 🔥 movimento
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const delta = startY.current - e.clientY;
    setHeight(Math.max(150, startHeight.current + delta));
  };

  const handleDownload = () => {
    const blob = new Blob([cCode], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "codigo.c";

    link.click();
    URL.revokeObjectURL(link.href);
  };

  // 🔥 parar drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setCopied(false);
  }, [cCode]);

  return (
    <div
      style={{ height }}
      className="flex flex-col border-t"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // 🔥 AQUI SÓ COR
      style={{
        height,
        background: theme.panel,
        borderColor: theme.border
      }}
    >
      {/* 🔥 DRAG HANDLE */}
      <div
        onMouseDown={handleMouseDown}
        className="h-2 cursor-row-resize"
        style={{ background: theme.border }}
      />

      {/* 🔥 HEADER */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: theme.border }}
      >
        {/* ESQUERDA */}
        <div className="flex items-center gap-4">
          <h3
            className="text-sm font-semibold"
            style={{ color: theme.text }}
          >
            Código Gerado
          </h3>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm px-2 py-1 rounded"
            style={{
              background: theme.toolbox,
              color: theme.text
            }}
          >
            <option value="c">C</option>
          </select>
        </div>
            <div className="flex items-center gap-2">
                <ActionButton
                  onClick={handleDownload}
                  icon={Download}
                  variant="success"
                >
                  Baixar .c
                </ActionButton>

                <ActionButton
                  onClick={handleCopy}
                  icon={Clipboard}
                  variant="primary"
                >
                  {copied ? "Copiado!" : "Copiar código"}
                </ActionButton>
              </div>
        </div>
      

      {/* 🔥 MONACO */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme={theme.editor} // 🔥 DINÂMICO
          value={cCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true
          }}
        />
      </div>
    </div>
  );
}