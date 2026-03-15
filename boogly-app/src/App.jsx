import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import BlocklyEditor from "./components/blockly/BlocklyEditor";
import StackVisualizer from "./components/simulator/StackVisualizer";

import RankingPanel from "./components/panels/RankingPanel";
import MissionPanel from "./components/panels/MissionPanel";
import CodePanel from "./components/panels/CodePanel";

import "./styles/layout.css";
import { useState } from "react";

function App() {
  // eslint-disable-next-line no-empty-pattern
  const [] = useState([]);
  return (

    <div className="app-grid">

      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="header">
        <Header />
      </div>

      <div className="ranking">
        <RankingPanel />
      </div>

      <div className="blockly">
        <BlocklyEditor />
      </div>

      <div className="simulation">
        <StackVisualizer />
      </div>

      <div className="missions">
        <MissionPanel />
      </div>

      <div className="code">
        <CodePanel />
      </div>

    </div>

  );

}

export default App;