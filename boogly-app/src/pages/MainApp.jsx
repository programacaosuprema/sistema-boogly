  import { useState } from "react";

  import Header from "../components/layout/Header";
  import BlocklyEditor from "../components/blockly/BlocklyEditor";

  import StackVisualizer from "../components/simulator/StackVisualizer";
  import ListVisualizer from "../components/simulator/ListVisualizer";
  import QueueVisualizer from "../components/simulator/QueueVisualizer";

  import CodePanel from "../components/panels/CodePanel";

  export default function MainApp() {
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

        <header className="h-16 border-b border-white/10">
          <Header structure={structure} setStructure={setStructure} />
        </header>

        <main className="flex flex-1 min-h-0 gap-3 p-3">

          <section className="flex-1 bg-white/5 rounded-xl overflow-hidden">
            <BlocklyEditor
              structure={structure}
              setData={setData}
              setCode={setCode}
            />
          </section>

          <section className="flex-1 bg-white/5 rounded-xl p-4 overflow-auto">
            <SimulatorComponent data={data} />
          </section>

        </main>

        <footer className="h-56 bg-black/80 p-3 overflow-auto">
          <CodePanel code={code} />
        </footer>

      </div>
    );
  }