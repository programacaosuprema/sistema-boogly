import { useState, useEffect } from "react";

import Header from "../components/layout/Header";
import BlocklyEditor from "../components/blockly/BlocklyEditor";

import StackVisualizer from "../components/simulator/StackVisualizer";
import ListVisualizer from "../components/simulator/ListVisualizer";
import QueueVisualizer from "../components/simulator/QueueVisualizer";

import CodePanel from "../components/panels/CodePanel";
import { useAuth } from "../context/useAuth";

export default function MainApp() {
  const { structure, setStructure } = useAuth();

  const [setData] = useState([]);
  const [code, setCode] = useState("");
  const [cCode, setCCode] = useState("");

  // 🔥 CONTROLE DE SIMULAÇÃO
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);


  const simulators = {
    stack: StackVisualizer,
    queue: QueueVisualizer,
    list: ListVisualizer,
  };

  const SimulatorComponent = simulators[structure];

  // 🔥 EXECUÇÃO AUTOMÁTICA
  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const interval = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(interval);
  }, [isRunning, currentStep, steps]);

  // 🔥 CONTROLES
  function handleRun() {
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
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
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* HEADER */}
      <header className="h-16 border-b border-white/10">
        <Header structure={structure} setStructure={setStructure} />
      </header>

      {/* MAIN */}
      <main className="flex flex-1 min-h-0 gap-3 p-3">

        {/* BLOCKLY */}
        <section className="flex-1 bg-white/5 rounded-xl overflow-hidden">
          <BlocklyEditor
            structure={structure}
            setData={setData}
            setCode={setCode}
            setCCode={setCCode} 
            setSteps={setSteps}              
            setCurrentStep={setCurrentStep}  
          />
        </section>

        {/* SIMULAÇÃO */}
        <section className="flex-1 bg-[#1E1E2E] rounded-xl p-4 flex flex-col gap-4">

          {/* 🔥 TOPO - CONTROLES */}
          <div className="flex items-center gap-3 flex-wrap">

            <button
              onClick={handleRun}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold shadow"
            >
              ▶ Executar
            </button>

            <button
              onClick={handlePause}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold shadow"
            >
              ⏸ Pausar
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

          </div>

          {/* 🔥 SIMULAÇÃO */}
          <div className="flex-1 bg-[#2A2A40] rounded-xl p-4 overflow-auto border border-white/10">

            <SimulatorComponent data={steps[currentStep]?.state || {}} />

          </div>

          {/* 🔥 HISTÓRICO */}
          <div className="bg-[#151521] rounded-xl p-4 h-40 overflow-auto border border-white/10">

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
                <div key={i} className="text-sm flex gap-2 items-center">

                  <span className={`${color} font-bold`}>
                    {symbol}
                  </span>

                  <span>
                    {step.message} → {JSON.stringify(Object.values(step.state)[0] || [])}
                  </span>

                </div>
              );
            })}

          </div>

        </section>
      </main>

      {/* CÓDIGO */}
      <footer className="h-56 bg-black/80 p-3 overflow-auto">
        <CodePanel
          cCode={cCode}
          output={steps.map(s => s.message).filter(Boolean)}
        />
      </footer>

    </div>
  );
}