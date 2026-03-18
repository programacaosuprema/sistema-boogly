import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import BlocklyEditor from "./components/blockly/BlocklyEditor";
import StackVisualizer from "./components/simulator/StackVisualizer";
import ListVisualizer from "./components/simulator/ListVisualizer";
import QueueVisualizer from "./components/simulator/QueueVisualizer";

import RankingPanel from "./components/panels/RankingPanel";
import MissionPanel from "./components/panels/MissionPanel";
import CodePanel from "./components/panels/CodePanel";

import "./styles/layout.css";
import "./styles/sidebar.css"
import "./styles/simulator.css"

import { useState } from "react";


function App() {

  const [structure, setStructure] = useState("queue"); // how can i do to change dinamic structure
  const [data, setData] = useState([]);
  const [code, setCode] = useState("");


  const simulators = {
    stack: StackVisualizer,
    queue: QueueVisualizer,
    list: ListVisualizer
  };

  const SimulatorComponent = simulators[structure];

  return (

    <div className="app-grid">

      <div className="sidebar">
        <Sidebar structure={structure} setStructure={setStructure}/>
      </div>

      <div className="header">
        <Header />
      </div>

      <div className="ranking">
        <RankingPanel />
      </div>

      <div className="blockly-simulation">

        <div className="blockly">
          <BlocklyEditor structure={structure} setData={setData} setCode={setCode}/>
        </div>

        <div className="simulation">
          {SimulatorComponent && <SimulatorComponent data={data} />}
        </div>

      </div>

      <div className="code">
        <CodePanel code={code}/>
      </div>

      <div className="missions">
        <MissionPanel />
      </div>

    </div>

  );
} 

export default App;