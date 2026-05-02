import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

import "../../blockly/blocks/stackBlocks";
import "../../blockly/blocks/queueBlocks";
import "../../blockly/blocks/listBlocks";

import "../../blockly/generators/stackGenerator";
import "../../blockly/generators/listGenerator";
import "../../blockly/generators/queueGenerator";

import { javascriptGenerator } from "blockly/javascript";
import { cGenerator } from "../../blockly/generators/cGenerator";

import { useTheme } from "../../theme/useTheme";

export default function BlocklyEditor({ toolbox, setCode, setCCode }) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const debounceRef = useRef(null);

  const [category, setCategory] = useState("list");
  const [initError, setInitError] = useState(false);

  const { theme } = useTheme();

  const isListToolbox = toolbox?.list;

  // 🔥 CRIA WORKSPACE COM TRATAMENTO DE ERRO
  useEffect(() => {
    try {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox?.list || toolbox,
        trashcan: true,
        grid: {
          spacing: 20,
          length: 3,
          colour: theme.border,
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
        },
      });

      workspaceRef.current.addChangeListener((event) => {
        if (event.isUiEvent) return;

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
          try {
            const codeJS =
              javascriptGenerator.workspaceToCode(workspaceRef.current);

            setCode(codeJS);

            const codeC = cGenerator(workspaceRef.current);
            setCCode(codeC);

          } catch (err) {
            console.error("Erro ao gerar código:", err);
          }
        }, 200);
      });

    } catch (err) {
      console.error("Erro ao iniciar Blockly:", err);
      setInitError(true);
    }

    return () => {
      workspaceRef.current?.dispose();
    };
  }, [setCCode, setCode, theme.border, toolbox]);

  // 🔥 ATUALIZA TOOLBOX
  useEffect(() => {
    try {
      if (workspaceRef.current && toolbox?.list) {
        workspaceRef.current.updateToolbox(toolbox[category]);
      }
    } catch (err) {
      console.error("Erro ao atualizar toolbox:", err);
    }
  }, [category, toolbox]);

  // 🔥 THEME BLOCKLY
  useEffect(() => {
    try {
      if (!workspaceRef.current) return;

      const customTheme = Blockly.Theme.defineTheme("custom-theme", {
        base: Blockly.Themes.Classic,

        blockStyles: {
          list_blocks: {
            colourPrimary: theme.blocks.list
          },
          stack_blocks: {
            colourPrimary: theme.blocks.stack
          },
          queue_blocks: {
            colourPrimary: theme.blocks.queue
          },
          logic_blocks: {
            colourPrimary: theme.blocks.logic
          }
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
      console.error("Erro ao aplicar tema:", err);
    }
  }, [theme]);

  // ❌ FALLBACK UI (SEM QUEBRAR APP)
  if (initError) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{ background: theme.workspace, color: theme.danger }}
      >
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">
            ⚠️ Erro ao carregar o editor
          </h2>
          <p style={{ color: theme.muted }}>
            Tente recarregar a página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full rounded-xl"
      style={{ background: theme.workspace }}
    >

      {/* 🔥 SIDEBAR */}
      {isListToolbox && (
        <div
          className="w-14 border-r flex flex-col items-center gap-4 py-3"
          style={{ background: theme.toolbox, borderColor: theme.border }}
        >

          <CategoryButton
            label="Lista"
            active={category === "list"}
            onClick={() => setCategory("list")}
            theme={theme}
          />

          <CategoryButton
            label="Variáveis"
            active={category === "variables"}
            onClick={() => setCategory("variables")}
            theme={theme}
          />

          <CategoryButton
            label="Condições"
            active={category === "conditions"}
            onClick={() => setCategory("conditions")}
            theme={theme}
          />

          <CategoryButton
            label="Laços"
            active={category === "loops"}
            onClick={() => setCategory("loops")}
            theme={theme}
          />

          <CategoryButton
            label="Estado"
            active={category === "state"}
            onClick={() => setCategory("state")}
            theme={theme}
          />

          <CategoryButton
            label="Ordenação"
            active={category === "sort"}
            onClick={() => setCategory("sort")}
            theme={theme}
          />

        </div>
      )}

      {/* 🔥 WORKSPACE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div
          className="px-4 py-3 flex justify-between items-center border-b"
          style={{
            background: theme.header,
            borderColor: theme.border,
            color: theme.text
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-full font-semibold"
              style={{
                background: theme.primary,
                color: "#fff"
              }}
            >
              Área de Programação
            </div>

            <span style={{ color: theme.muted }}>
              arraste e conecte os blocos
            </span>
          </div>
        </div>

        {/* BLOCKLY */}
        <div className="flex-1">
          <div ref={blocklyDiv} className="h-full w-full" />
        </div>

      </div>
    </div>
  );
}

// 🔥 BOTÃO DA SIDEBAR
function CategoryButton({ label, active, onClick, theme }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className="w-10 h-10 rounded-full transition"
        style={{
          background: active ? theme.primary : theme.hover,
          transform: active ? "scale(1.1)" : "scale(1)"
        }}
      />

      {/* TOOLTIP */}
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