import { useState, useEffect, useRef } from "react";

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
    list: ListVisualizer,
  };

  const engines = {
    stack: runStack,
    queue: runQueue,
    list: runList,
  };

  const toolboxes = {
    stack: stackToolbox,
    queue: queueToolbox,
    list: toolboxCategories,
  };

  const currentToolbox = toolboxes[structure];
  const runEngine = engines[structure];
  const SimulatorComponent = simulators[structure];

  const [blockCount, setBlockCount] = useState(0);

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

  // 🔥 AUTO SCROLL
  useEffect(() => {
    if (!historyRef.current) return;

    const container = historyRef.current;
    const activeItem = container.children[currentStep];

    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
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

  const hasInvalidState =
    steps.length > 0 && !steps[currentStep];

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

  return (
    <div
      className="flex flex-col h-full gap-3"
      style={{ background: theme.background }}
    >

      {/* MAIN */}
      <div className="flex flex-1 min-h-0 gap-3">

        {/* BLOCKLY */}
        <section
          className="flex-1 rounded-xl overflow-hidden"
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

        {/* SIMULAÇÃO */}
        <section
          className="flex-1 min-h-0 rounded-xl p-4 flex flex-col gap-4 overflow-hidden"
          style={{ background: theme.panel }}
        >

          {/* CONTROLES */}
          <div className="flex items-center gap-3 flex-wrap">

            <button
              onClick={() => {
                if (!isRunning && !isPaused) return handleRun();
                if (isRunning) return handlePause();
                if (isPaused) return handleContinue();
              }}
              className="px-4 py-2 rounded-lg font-semibold shadow transition"
              style={{ background: theme.success, color: "#fff" }}
            >
              {!isRunning && !isPaused && "▶ Executar"}
              {isRunning && "⏸ Pausar"}
              {isPaused && "▶ Continuar"}
            </button>

            <button
              onClick={handleNextStep}
              className="px-4 py-2 rounded-lg font-semibold shadow transition"
              style={{ background: theme.primary, color: "#fff" }}
            >
              ⏭ Passo
            </button>

            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg font-semibold shadow transition"
              style={{ background: theme.danger, color: "#fff" }}
            >
              🧹 Limpar
            </button>

            {/* SPEED */}
            <div className="flex items-center gap-3 w-64">

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

          {/* VISUALIZAÇÃO */}
          <div
            className="flex-1 min-h-0 rounded-xl p-4 overflow-auto border"
            style={{
              background: theme.card,
              borderColor: theme.border
            }}
          >
            <SimulatorComponent
              data={safeData}
              step={safeStep}
            />
          </div>

          {/* HISTÓRICO */}
          <div
            ref={historyRef}
            className="rounded-xl p-4 h-40 overflow-auto border"
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
                    background:
                      i === currentStep ? theme.hover : "transparent",
                    borderLeft:
                      i === currentStep
                        ? `4px solid ${theme.primary}`
                        : "none",
                    opacity: i === currentStep ? 1 : 0.6
                  }}
                >

                  <span style={{ color }} className="font-bold">
                    {symbol}
                  </span>

                  <span style={{ color: theme.text }}>
                    {step.message} →{" "}
                    {JSON.stringify(Object.values(step.state)[0] || [])}
                  </span>

                </div>
              );
            })}

          </div>

        </section>

      </div>

      {/* CÓDIGO */}
      <footer
        className="h-56 p-3 overflow-hidden"
        style={{ background: theme.panel }}
      >
        <CodePanel cCode={cCode} />
      </footer>

    </div>
  );
}