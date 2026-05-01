import { useState, useEffect, useRef } from "react";

import BlocklyEditor from "../blockly/BlocklyEditor";

import StackVisualizer from "../simulator/StackVisualizer";
import ListVisualizer from "../simulator/ListVisualizer";
import QueueVisualizer from "../simulator/QueueVisualizer";

import CodePanel from "../panels/CodePanel";
import { useAuth } from "../../autenticator/useAuth";

import { runStack } from "../simulator/engines/stackEngine";
import { runQueue } from "../simulator/engines/queueEngine";
import { runList } from "../simulator/engines/listEngine";


import { stackToolbox, queueToolbox, toolboxCategories } from "../../blockly/toolboxes";


export default function EditorPage() {

  const historyRef = useRef(null);

  const { structure } = useAuth();
  const [code, setCode] = useState("");
  const [cCode, setCCode] = useState("");

  // 🔥 CONTROLE DE SIMULAÇÃO
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [speed, setSpeed] = useState(1);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];

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

  console.log(SimulatorComponent);

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

  // 🔥 CONTROLES
  function handleRun() {
    if (!code) return;

    const stepsResult = runEngine(code);

    setSteps(stepsResult);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
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

  return (
    <div className="flex flex-col h-full gap-3">

      {/* MAIN */}
      <div className="flex flex-1 min-h-0 gap-3">

        {/* BLOCKLY */}
        <section className="flex-1 bg-white/5 rounded-xl overflow-hidden">
          <BlocklyEditor
            toolbox={currentToolbox}
            setCode={setCode}
            setCCode={setCCode}
          />
        </section>

        {/* SIMULAÇÃO */}
        <section className="flex-1 min-h-0 bg-[#1E1E2E] rounded-xl p-4 flex flex-col gap-4 overflow-hidden">

          {/* CONTROLES */}
          <div className="flex items-center gap-3 flex-wrap">

            <button
              onClick={() => {
                if (!isRunning && !isPaused) return handleRun();
                if (isRunning) return handlePause();
                if (isPaused) return handleContinue();
              }}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold shadow"
            >
              {!isRunning && !isPaused && "▶ Executar"}
              {isRunning && "⏸ Pausar"}
              {isPaused && "▶ Continuar"}
            </button>

            <button
              onClick={handleNextStep}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold shadow"
            >
              ⏭ Passo a passo
            </button>

            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold shadow"
            >
              🧹 Limpar
            </button>

            <div className="flex items-center gap-3 w-64">

              <span className="text-white text-sm w-10">
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
                className="w-full cursor-pointer appearance-none h-2 rounded-lg bg-gray-700 accent-blue-500"
              />

            </div>

          </div>

          {/* VISUALIZAÇÃO */}
          <div className="flex-1 min-h-0 bg-[#2A2A40] rounded-xl p-4 overflow-auto border border-white/10">
            <SimulatorComponent
              data={steps[currentStep]?.state || {}}
              step={steps[currentStep]}
            />
          </div>

          {/* HISTÓRICO */}
          <div
            ref={historyRef}
            className="bg-[#151521] rounded-xl p-4 h-40 overflow-auto border border-white/10"
        >

            <h3 className="text-sm font-semibold mb-2 text-white/70">
              Histórico de Execução
            </h3>

            {steps.length === 0 && (
              <p className="text-white/40 text-sm">
                Nenhuma execução ainda
              </p>
            )}

            {steps.slice(0, currentStep + 1).map((step, i) => {

              const color =
                step.type === "add"
                  ? "text-green-400"
                  : step.type === "remove"
                  ? "text-red-400"
                  : step.type === "create"
                  ? "text-blue-400"
                  : "text-white";

              const symbol =
                step.type === "add"
                  ? "+"
                  : step.type === "remove"
                  ? "-"
                  : "•";

              return (
                <div
                  key={i}
                  className={`text-sm flex gap-2 items-center px-2 py-1 rounded transition-all
                    ${i === currentStep
                      ? "bg-white/20 border-l-4 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)] "
                      : "opacity-60"}
                  `}
                >

                  <span className={`${color} font-bold`}>
                    {symbol}
                  </span>

                  <span>
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
      <footer className="h-56 bg-black/80 p-3 overflow-hidden">
        <CodePanel cCode={cCode} />
      </footer>

    </div>
  );
}