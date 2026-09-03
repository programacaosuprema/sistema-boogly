// src/pages/EditorPage.jsx
import { useState, useRef, useEffect } from "react";

import BlocklyEditor from "../blockly/BlocklyEditor";

import StackVisualizer from "../simulator/StackVisualizer";
import ListVisualizer from "../simulator/ListVisualizer";
import QueueVisualizer from "../simulator/QueueVisualizer";

import CodePanel from "../panels/CodePanel";
import { useAuth } from "../../autenticator/useAuth";
import { useTheme } from "../../theme/useTheme";
import { useError } from "../../error/useError";

import { runStack } from "../simulator/engines/stackEngine";
import { runQueue } from "../simulator/engines/queueEngine";
import { runList } from "../simulator/engines/listEngine";

import {
  stackToolbox,
  queueToolbox,
  toolboxCategories
} from "../../blockly/toolboxes";

/* If you want the tour mounted only for this page, import GuidedTour here:
   import GuidedTour from "../../components/tour/GuidedTour";
   and render <GuidedTour /> at the end of the JSX below.
*/

export default function EditorPage() {
  const { theme } = useTheme();
  const { showError } = useError();
  const historyRef = useRef(null);

  const { structure } = useAuth();

  const [code, setCode] = useState("");
  const [cCode, setCCode] = useState("");

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [speed, setSpeed] = useState(1);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];

  // 🔥 MAPS
  const simulators = {
    stack: StackVisualizer,
    queue: QueueVisualizer,
    list: ListVisualizer
  };

  const engines = {
    stack: runStack,
    queue: runQueue,
    list: runList
  };

  const toolboxes = {
    stack: stackToolbox,
    queue: queueToolbox,
    list: toolboxCategories
  };

  const currentToolbox = toolboxes[structure];
  const runEngine = engines[structure];
  const SimulatorComponent = simulators[structure];

  const [blockCount, setBlockCount] = useState(0);

  // Refs para controlar scroll/overflow do wrapper da simulação
  const outerSimWrapperRef = useRef(null); // wrapper pai do visualizador
  const innerScrollWrapperRef = useRef(null); // wrapper que contém overflow da visualização

  // 🔥 EXECUÇÃO AUTOMÁTICA
  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const baseTime = 800;
    const adjustedTime = baseTime / Math.abs(speed || 1);

    const interval = setTimeout(() => {
      setCurrentStep((prev) => {
        if (speed > 0) {
          return Math.min(prev + 1, steps.length - 1);
        } else {
          return Math.max(prev - 1, 0);
        }
      });
    }, adjustedTime);

    return () => clearTimeout(interval);
  }, [isRunning, currentStep, steps, speed]);

  // 🔥 AUTO SCROLL do histórico (mantive)
  useEffect(() => {
    if (!historyRef.current) return;

    const container = historyRef.current;
    const activeItem = container.children[currentStep];

    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [currentStep]);

  // 🔥 EXECUTAR
  function handleRun() {
    if (!code) {
      showError({ message: "Nenhum código para executar" });
      return;
    }

    try {
      const stepsResult = runEngine(code);

      if (!stepsResult || !Array.isArray(stepsResult)) {
        throw new Error("Resultado inválido");
      }

      setSteps(stepsResult);
      setCurrentStep(0);
      setIsRunning(true);
      setIsPaused(false);
    } catch (err) {
      console.error(err);

      showError({
        message: "Erro ao executar o algoritmo"
      });
    }
  }

  function handlePause() {
    setIsRunning(false);
    setIsPaused(true);
  }

  function handleContinue() {
    setIsRunning(true);
    setIsPaused(false);
  }

  function handleNextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleClear() {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
  }

  // 🔥 SEGURANÇA DO SIMULADOR
  const safeStep = steps[currentStep] || {};
  const safeData = safeStep.state || {};

  const hasInvalidState = steps.length > 0 && !steps[currentStep];

  if (hasInvalidState) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: theme.danger }}
      >
        ⚠️ Erro na simulação
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Lógica para título centralizado (exibe apenas uma vez - primeiro nome)
  // -----------------------------------------------------------------------
  const firstListName = (() => {
    try {
      const names = Object.keys(safeData || {}).filter((n) => n !== "variables");
      return names.length ? names[0] : null;
    } catch (e) {
      return null;
    }
  })();

  // Detecta eixo correto para scroll reset / foco
  const isHorizontalStructure = structure === "list" || structure === "queue";
  const isStackStructure = structure === "stack";

  // Reset robusto de scroll no eixo apropriado quando safeData muda
  useEffect(() => {
    if (safeStep && safeStep.type === "traverse") return;

    const outer = outerSimWrapperRef.current;
    const inner = innerScrollWrapperRef.current;
    if (!outer && !inner) return;

    const attempts = [0, 30, 120, 300];
    attempts.forEach((delay) => {
      setTimeout(() => {
        try {
          if (isHorizontalStructure) {
            if (outer) outer.scrollLeft = 0;
            if (inner) inner.scrollLeft = 0;
          } else if (isStackStructure) {
            if (outer) outer.scrollTop = 0;
            if (inner) inner.scrollTop = 0;
          } else {
            // fallback: reset ambos eixos
            if (outer) {
              outer.scrollLeft = 0;
              outer.scrollTop = 0;
            }
            if (inner) {
              inner.scrollLeft = 0;
              inner.scrollTop = 0;
            }
          }
        } catch (e) {
          // ignore
        }
      }, delay);
    });
  }, [JSON.stringify(safeData), safeStep?.type, structure]);

  return (
    <div
      className="flex flex-col h-full gap-3"
      style={{ background: theme.background }}
    >
      {/* MAIN: duas colunas 50% / 50% */}
      <div className="flex flex-1 min-h-0 gap-3">
        {/* ESQUERDA — EDITOR (50%) */}
        {/* ADDED data-tour="editor" */}
        <section
          data-tour="editor"
          className="w-1/2 min-h-0 rounded-xl overflow-hidden"
          style={{ background: theme.workspace }}
        >
          <BlocklyEditor
            toolbox={currentToolbox}
            setCode={setCode}
            setCCode={setCCode}
            setBlockCount={setBlockCount}
            blockCount={blockCount}
          />
        </section>

        {/* DIREITA — SIMULAÇÃO + HISTÓRICO + CÓDIGO (50%) */}
        <section className="w-1/2 min-h-0 flex flex-col gap-3">
          {/* SIMULAÇÃO (top) */}
          <div
            className="flex-[3] min-h-0 rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
            style={{ background: theme.panel }}
            /* You could place data-tour on the simulation wrapper or on inner scroll wrapper below.
               I placed it on the inner scroll wrapper for precise highlighting. */
          >
            {/* CONTROLES */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  if (!isRunning && !isPaused) return handleRun();
                  if (isRunning) return handlePause();
                  if (isPaused) return handleContinue();
                }}
                className="px-4 py-2 rounded-lg font-semibold"
                style={{ background: theme.success, color: "#fff" }}
              >
                {!isRunning && !isPaused && "▶ Executar"}
                {isRunning && "⏸ Pausar"}
                {isPaused && "▶ Continuar"}
              </button>

              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-lg font-semibold"
                style={{ background: theme.primary, color: "#fff" }}
              >
                ⏭ Passo
              </button>

              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-lg font-semibold"
                style={{ background: theme.danger, color: "#fff" }}
              >
                🧹 Limpar
              </button>

              {/* speed control (mantido) */}
              <div className="flex items-center gap-3 w-64 ml-auto">
                <span style={{ color: theme.text }} className="text-sm w-10">
                  {speed}x
                </span>

                <input
                  type="range"
                  min="0"
                  max={speedOptions.length - 1}
                  step="1"
                  value={speedOptions.indexOf(speed)}
                  onChange={(e) => {
                    const index = Number(e.target.value);
                    setSpeed(speedOptions[index]);
                  }}
                  className="w-full cursor-pointer"
                  style={{
                    background: theme.border,
                    accentColor: theme.primary
                  }}
                />
              </div>
            </div>

            {/* VISUALIZAÇÃO — wrapper que foca/centraliza e limita overflow */}
            <div
              className="flex-1 min-h-0 rounded-xl p-3 border"
              style={{
                background: theme.card,
                borderColor: theme.border,
                display: "flex",
                flexDirection: "column",
                // garante que o container não empurre a coluna
                overflow: "hidden",
                boxSizing: "border-box"
              }}
            >
              {/* Inner wrapper ajustado: mostra título centralizado UMA vez e mantém o simulador responsável pela rolagem */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  overflow: "hidden",
                  minWidth: 0
                }}
              >
                {/* -------------------------
                    Nome da primeira estrutura
                    (aparece apenas uma vez, centralizado)
                    ------------------------- */}
                {firstListName && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: theme.spacing.sm,
                      paddingTop: theme.spacing.xs,
                      paddingBottom: theme.spacing.xs,
                      boxSizing: "border-box"
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: `6px ${theme.spacing.md}`,
                        borderRadius: 8,
                        background: theme.card,
                        border: `1px solid ${theme.border}`
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          color: theme.text,
                          ...theme.typography.h2,
                          textTransform: "none"
                        }}
                      >
                        {firstListName}
                      </h2>
                    </div>
                  </div>
                )}

                {/* visualizador: wrapper adaptativo por estrutura */}
                <div
                  ref={outerSimWrapperRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                    minWidth: 0
                  }}
                >
                  {/* ADDED data-tour="simulator" on the inner scroll wrapper so Tour highlights the scrolling area */}
                  <div
                    ref={innerScrollWrapperRef}
                    data-tour="simulator"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      // para listas/filas, queremos a linha horizontal e alinhamento ao início
                      justifyContent: isHorizontalStructure ? "flex-start" : "center",
                      alignItems: isHorizontalStructure ? "center" : "flex-start",
                      overflowX: isHorizontalStructure ? "auto" : "hidden",
                      overflowY: isHorizontalStructure ? "hidden" : "auto",
                      paddingLeft: theme.spacing.sm,
                      paddingRight: theme.spacing.sm,
                      boxSizing: "border-box",
                      minWidth: 0
                    }}
                  >
                    {/* Aqui o ajuste crítico: quando horizontal, o filho NÃO deve forçar width:100% */}
                    <div
                      style={{
                        minWidth: isHorizontalStructure ? "max-content" : 0,
                        width: isHorizontalStructure ? "auto" : "100%"
                      }}
                    >
                      {/* Passa showTitle={false} para evitar duplicação */}
                      <SimulatorComponent data={safeData} step={safeStep} showTitle={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HISTÓRICO (abaixo da simulação, dentro da mesma coluna direita) */}
            {/* ADDED data-tour="history" */}
            <div
              ref={historyRef}
              data-tour="history"
              className="rounded-xl p-4 h-28 overflow-auto border"
              style={{
                background: theme.toolbox,
                borderColor: theme.border
              }}
            >
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: theme.muted }}
              >
                Histórico
              </h3>

              {steps.length === 0 && (
                <p style={{ color: theme.muted }} className="text-sm">
                  Nenhuma execução ainda
                </p>
              )}

              {steps.slice(0, currentStep + 1).map((step, i) => {
                const color =
                  step.type === "add"
                    ? theme.success
                    : step.type === "remove"
                    ? theme.danger
                    : step.type === "create"
                    ? theme.primary
                    : theme.text;

                const symbol =
                  step.type === "add"
                    ? "+"
                    : step.type === "remove"
                    ? "-"
                    : "•";

                return (
                  <div
                    key={i}
                    className="text-sm flex gap-2 items-center px-2 py-1 rounded"
                    style={{
                      background: i === currentStep ? theme.hover : "transparent",
                      borderLeft: i === currentStep ? `4px solid ${theme.primary}` : "none",
                      opacity: i === currentStep ? 1 : 0.6
                    }}
                  >
                    <span style={{ color }} className="font-bold">
                      {symbol}
                    </span>

                    <span style={{ color: theme.text }}>
                      {step.message} → {JSON.stringify(Object.values(step.state)[0] || [])}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RODAPÉ — CÓDIGO (fixo) */}
          {/* ADDED data-tour="code" to the CodePanel wrapper */}
          <div data-tour="code" className="h-56 rounded-xl overflow-hidden" style={{ background: theme.panel }}>
            <CodePanel cCode={cCode} />
          </div>
        </section>
      </div>

      {/* If you prefer a local tour just for this Editor page, add GuidedTour here:
          <GuidedTour />  (after creating src/components/tour/GuidedTour.jsx)
      */}
    </div>
  );
}