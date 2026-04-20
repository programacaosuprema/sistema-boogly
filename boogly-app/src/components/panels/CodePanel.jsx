import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CodePanel({ cCode }) {
  const [height, setHeight] = useState(220);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("c");

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

    // 🔥 boa prática (liberar memória)
    URL.revokeObjectURL(link.href);
  };

  // 🔥 parar drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const [copied, setCopied] = useState(false); 

  useEffect(() => {
    setCopied(false);
  }, [cCode]);

  return (
    <div
      style={{ height }}
      className="bg-black/90 border-t border-white/10 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 🔥 DRAG HANDLE */}
      <div
        onMouseDown={handleMouseDown}
        className="h-2 cursor-row-resize bg-white/10 hover:bg-white/20"
      />

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">

        {/* ESQUERDA */}
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-white">
            Código Gerado
          </h3>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#1E1E2E] text-white text-sm px-2 py-1 rounded"
          >
            <option value="c">C</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
          >
            ⬇ Baixar .c
          </button>

          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
          >
            {copied ? "✅ Copiado!" : "📋 Copiar código"}
          </button>
        </div>
      </div>

      {/* 🔥 MONACO */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
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