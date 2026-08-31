import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

// blocos (igual ao principal)
import "../../blockly/blocks/stackBlocks";
import "../../blockly/blocks/queueBlocks";
import "../../blockly/blocks/listBlocks";
import "../../blockly/blocks/baseBlocks";

import { javascriptGenerator } from "blockly/javascript";
import { generateC } from "../../blockly/generators/c_language/CGenerateDispatcher";

import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";

/**
 * ChallengeBlocklyEditor
 *
 * Props:
 * - toolbox: objeto com categorias (toolbox.list, toolbox.state, etc.) ou toolbox completo
 * - structure (opcional): "list" | "queue" | "stack" — se fornecido, define as bolinhas
 * - setCode, setCCode, setBlockCount
 * - onRun(commands)  -> chamada quando o usuário aperta Testar solução
 *
 * Importante: NÃO HÁ salvamento/recuperação automática aqui.
 */

function CategoryButton({ label, active, onClick, theme }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className="w-10 h-10 rounded-full transition"
        style={{
          background: active ? theme.primary : theme.hover,
          transform: active ? "scale(1.06)" : "scale(1)"
        }}
      />
      <span
        className="absolute left-12 top-1/2 -translate-y-1/2
                   text-xs px-2 py-1 rounded whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition pointer-events-none z-50"
        style={{
          background: theme.panel,
          color: theme.text,
          border: `1px solid ${theme.border}`
        }}
      >
        {label}
      </span>
    </div>
  );
}

function detectStructureFromToolbox(toolbox) {
  if (!toolbox) return "list";
  if (toolbox.list) return "list";
  if (toolbox.queue) return "queue";
  if (toolbox.stack) return "stack";
  return "list";
}

function getToolboxForCategory(toolbox, category) {
  if (!toolbox) return null;
  return toolbox[category] || toolbox.list || toolbox.queue || toolbox.stack || toolbox;
}

/** Resolves a numeric value from a child block (tries common field names) */
function resolveValueFromBlock(block) {
  if (!block) return null;
  // common numeric field names used in your blocks
  const candidates = ["VALUE", "NUM", "NUMBER", "VALUE_NUM", "VAL"];
  for (const f of candidates) {
    try {
      const v = block.getFieldValue?.(f);
      if (v !== undefined && v !== null) {
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
      }
    } catch (e) {}
  }

  // if the child is a literal number shadow with field "NUM" etc:
  const fields = block.inputList?.flatMap(i =>
    (i.fieldRow || []).map(f => f && f.name && block.getFieldValue?.(f.name))
  ) || [];
  for (const val of fields) {
    if (val !== undefined) {
      const n = Number(val);
      if (!Number.isNaN(n)) return n;
    }
  }

  // fallback: try to generate JS and parse number
  try {
    const js = javascriptGenerator.blockToCode(block);
    const matched = js && js.match(/-?\d+/);
    if (matched) return Number(matched[0]);
  } catch (e) {}

  return null;
}

/** Extrai a sequência de comandos respeitando ligações VALUE / inputs */
function extractCommandsFromWorkspace(ws) {
  const topBlocks = ws.getTopBlocks(true); // ordered top blocks
  const commands = [];

  function walk(block) {
    if (!block) return;

    // build command for this block
    const type = block.type;

    // try get direct field "VALUE" / "NUM"
    let value = null;
    try {
      value = block.getFieldValue?.("VALUE") ?? block.getFieldValue?.("NUM") ?? null;
      if (value !== null) {
        const n = Number(value);
        if (!Number.isNaN(n)) value = n;
      }
    } catch (e) {
      value = null;
    }

    // if block has an input named "VALUE" or "VALUE_INPUT", try resolve its connected block
    if (value === null) {
      const possibleInputs = ["VALUE", "VALUE_INPUT", "INPUT", "ITEM", "NUM"];
      for (const inputName of possibleInputs) {
        try {
          const target = block.getInputTargetBlock(inputName);
          if (target) {
            const resolved = resolveValueFromBlock(target);
            if (resolved !== null) {
              value = resolved;
              break;
            }
          }
        } catch (e) {}
      }
    }

    // Special case: some "container" / header blocks shouldn't produce command
    // (we still return them so backend can ignore if needed)
    commands.push({ type, value });

    // proceed along next chain
    const next = block.getNextBlock && block.getNextBlock();
    if (next) walk(next);
  }

  topBlocks.forEach(t => walk(t));
  return commands;
}

export default function ChallengeBlocklyEditor({
  toolbox,
  setCode,
  setCCode,
  setBlockCount,
  onRun,
  structure: propStructure
}) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  const { theme } = useTheme();
  const { showError } = useError();

  const [category, setCategory] = useState(null);
  const [toolboxVisible, setToolboxVisible] = useState(true);
  const [blockCountLocal, setBlockCountLocal] = useState(0);
  const [running, setRunning] = useState(false);

  const detectedStructure = propStructure || detectStructureFromToolbox(toolbox);
  const categoriesByStructure = {
    list: [
      ["list", "Lista"],
      ["variables", "Variáveis"],
      ["conditions", "Condições"],
      ["loops", "Laços"],
      ["state", "Estado"],
      ["sort", "Ordenação"]
    ],
    queue: [
      ["queue", "Fila"],
      ["variables", "Variáveis"],
      ["conditions", "Condições"],
      ["state", "Estado"],
      ["loops", "Laços"]
    ],
    stack: [
      ["stack", "Pilha"],
      ["variables", "Variáveis"],
      ["conditions", "Condições"],
      ["state", "Estado"],
      ["loops", "Laços"]
    ]
  };

  useEffect(() => {
    // init workspace once
    try {
      if (!blocklyDiv.current) return;

      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox?.list || toolbox?.queue || toolbox?.stack || toolbox,
        trashcan: true,
        collapse: true,
        grid: {
          spacing: 20,
          length: 3,
          colour: theme.border,
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true
        }
      });

      // change listener (no autosave)
      workspaceRef.current.addChangeListener(() => {
        try {
          const ws = workspaceRef.current;
          if (!ws) return;

          // JS
          let codeJS = "";
          try {
            codeJS = javascriptGenerator.workspaceToCode(ws) || "";
            setCode && setCode(codeJS);
          } catch (err) {
            // non-fatal: still set empty
            setCode && setCode("");
          }

          // C
          try {
            const codeC = generateC(ws) || "";
            setCCode && setCCode(codeC);
          } catch (err) {
            setCCode && setCCode("");
          }

          // block count
          const count = ws.getAllBlocks(false).length;
          setBlockCount && setBlockCount(count);
          setBlockCountLocal(count);
        } catch (err) {
          console.error("Erro no change listener:", err);
        }
      });
    } catch (err) {
      console.error("Erro ao iniciar editor:", err);
      setBlockCount && setBlockCount(0);
      showError({ message: "Erro ao iniciar editor" });
    }

    return () => {
      try {
        workspaceRef.current?.dispose();
        workspaceRef.current = null;
      } catch (err) {
        console.warn("Erro ao destruir workspace:", err);
      }
    };
    // only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update theme
  useEffect(() => {
    try {
      if (!workspaceRef.current) return;
      const customTheme = Blockly.Theme.defineTheme("challenge-theme", {
        base: Blockly.Themes.Classic,
        blockStyles: {
          list_blocks: { colourPrimary: theme.blocks?.list || "#1f9" },
          stack_blocks: { colourPrimary: theme.blocks?.stack || "#9f1" },
          queue_blocks: { colourPrimary: theme.blocks?.queue || "#19f" },
          logic_blocks: { colourPrimary: theme.blocks?.logic || "#f19" }
        },
        componentStyles: {
          workspaceBackgroundColour: theme.workspace,
          toolboxBackgroundColour: theme.toolbox,
          toolboxForegroundColour: theme.text,
          flyoutBackgroundColour: theme.toolbox,
          flyoutForegroundColour: theme.text,
          scrollbarColour: theme.border,
          insertionMarkerColour: theme.primary,
          insertionMarkerOpacity: 0.3,
          cursorColour: theme.primary
        }
      });
      workspaceRef.current.setTheme(customTheme);
    } catch (err) {
      console.warn("Erro ao aplicar tema:", err);
    }
  }, [theme]);

  // update toolbox when category changes
  useEffect(() => {
    try {
      if (!workspaceRef.current) return;

      // 🔴 OCULTAR TOOLBOX
      if (!toolboxVisible) {
        workspaceRef.current.updateToolbox({
          kind: "flyoutToolbox",
          contents: []
        });
        return;
      }

      // 🟢 MOSTRAR TOOLBOX
      const nextToolbox = getToolboxForCategory(toolbox, category);

      if (!nextToolbox || !nextToolbox.contents) return;

      workspaceRef.current.updateToolbox(nextToolbox);

    } catch (err) {
      console.error("Erro ao atualizar toolbox:", err);
      showError({ message: "Erro ao atualizar toolbox" });
    }
  }, [category, toolboxVisible, toolbox, showError]);

  // set initial category from structure
  useEffect(() => {
    setCategory(detectedStructure);
  }, [detectedStructure]);

  // LOAD generators by structure (dynamic imports like main editor)
  useEffect(() => {
    if (detectedStructure === "list") {
      import("../../blockly/generators/my_language/listGenerator").catch(() => {});
    } else if (detectedStructure === "queue") {
      import("../../blockly/generators/my_language/queueGenerator").catch(() => {});
    } else if (detectedStructure === "stack") {
      import("../../blockly/generators/my_language/stackGenerator").catch(() => {});
    }
  }, [detectedStructure]);

  // RUN handler: extrai comandos e chama onRun
  async function handleRun() {
    try {
      if (!workspaceRef.current) return;
      setRunning(true);
      const ws = workspaceRef.current;

      // extrai comandos
      const commands = extractCommandsFromWorkspace(ws);
      // chama parent
      await onRun?.(commands);
    } catch (err) {
      showError({ message: err.message || "Erro ao executar" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex h-full w-full rounded-xl" style={{ background: theme.workspace }}>
      {/* SIDEBAR */}
      <div
        className="w-14 border-r flex flex-col items-center gap-4 py-3"
        style={{ background: theme.toolbox, borderColor: theme.border }}
      >
        {(categoriesByStructure[detectedStructure] || []).map(([key, label]) => (
          <CategoryButton
            key={key}
            label={label}
            active={category === key}
            onClick={() => setCategory(key)}
            theme={theme}
          />
        ))}
      </div>

      {/* WORKSPACE + HEADER */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 flex justify-between items-center border-b" style={{ background: theme.header, borderColor: theme.border, color: theme.text }}>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full font-semibold" style={{ background: theme.primary, color: "#fff" }}>
              Área de Programação
            </div>
            <span style={{ color: theme.muted }}>arraste e conecte os blocos</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setToolboxVisible(!toolboxVisible)}
              className="px-3 py-2 rounded-lg font-semibold transition"
              style={{ background: theme.primary, color: "#fff" }}
            >
              {toolboxVisible ? "📂 Ocultar Blocos" : "📁 Mostrar Blocos"}
            </button>

            <button
              onClick={handleRun}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{ background: theme.primary, color: "#fff" }}
            >
              {running ? "Executando..." : "▶ Testar solução"}
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {/* 🧩 CONTADOR DE BLOCOS (overlay igual editor principal) */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold z-50"
            style={{
              background: theme.card,
              color: theme.text,
              border: `1px solid ${theme.border}`
            }}
          >
            🧩 {blockCountLocal} blocos
          </div>

          <div ref={blocklyDiv} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}