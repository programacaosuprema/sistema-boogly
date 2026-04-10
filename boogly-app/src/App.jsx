import { useState } from "react";

import Header from "./components/layout/Header";
import BlocklyEditor from "./components/blockly/BlocklyEditor";

import StackVisualizer from "./components/simulator/StackVisualizer";
import ListVisualizer from "./components/simulator/ListVisualizer";
import QueueVisualizer from "./components/simulator/QueueVisualizer";

import CodePanel from "./components/panels/CodePanel";

function App() {
  const [structure, setStructure] = useState("list");
  const [data, setData] = useState([]);
  const [code, setCode] = useState("");

  const simulators = {
    stack: StackVisualizer,
    queue: QueueVisualizer,
    list: ListVisualizer,
  };

  const SimulatorComponent = simulators[structure];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* HEADER */}
      <header className="h-16 border-b border-white/10 backdrop-blur-md">
        <Header structure={structure} setStructure={setStructure} />
      </header>

      {/* MAIN */}
      <main className="flex flex-1 min-h-0 gap-3 p-3">

        {/* BLOCKLY */}
        <section className="flex-1 min-w-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <BlocklyEditor
            structure={structure}
            setData={setData}
            setCode={setCode}
          />
        </section>

        {/* VISUALIZER */}
        <section className="flex-1 min-w-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 overflow-auto">
          {SimulatorComponent && <SimulatorComponent data={data} />}
        </section>

      </main>

      {/* CODE */}
      <footer className="h-56 bg-black/80 border-t border-white/10 p-3 overflow-auto">
        <CodePanel code={code} />
      </footer>

    </div>
  );
}

export default App;