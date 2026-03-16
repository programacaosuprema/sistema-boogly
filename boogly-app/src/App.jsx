import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import BlocklyEditor from "./components/blockly/BlocklyEditor";
import StackVisualizer from "./components/simulator/StackVisualizer";

import RankingPanel from "./components/panels/RankingPanel";
import MissionPanel from "./components/panels/MissionPanel";
import CodePanel from "./components/panels/CodePanel";

import "./styles/layout.css";
import "./styles/sidebar.css"
import "./styles/stack.css"

import { useState } from "react";

function App() {
  const [structure, setStructure] = useState("stack");
  const [stack, setStack] = useState([]);

  return (

    <div className="app-grid">

      <div className="sidebar">
        <Sidebar setStructure={setStructure}/>
      </div>

      <div className="header">
        <Header />
      </div>

      <div className="ranking">
        <RankingPanel />
      </div>

      <div className="blockly-simulation">

        <div className="blockly">
          <BlocklyEditor  structure={structure} setStack={setStack}/>
        </div>

        <div className="simulation">
          <StackVisualizer stack={stack} />
        </div>

      </div>

      <div className="code">
        <CodePanel />
      </div>

      <div className="missions">
        <MissionPanel />
      </div>

    </div>

  );

}

export default App;