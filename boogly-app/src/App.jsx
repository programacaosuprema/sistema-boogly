import BlocklyEditor from "./components/BlocklyEditor";

function App() {

  return (
    <div style={{ padding: 20 }}>

      <h1>Simulador de Estruturas de Dados</h1>

      <BlocklyEditor />

      <h2>Código Gerado</h2>
      <pre id="generatedCode"></pre>

      <h2>Simulador</h2>
      <pre id="simulatedCode"></pre>
    </div>
  );
}

export default App;