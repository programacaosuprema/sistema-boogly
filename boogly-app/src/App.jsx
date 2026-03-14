import BlocklyEditor from "./components/BlocklyEditor";

function App() {

  return (
    <div style={{ padding: 20 }}>

      <h1>Simulador de Estruturas de Dados</h1>

      <BlocklyEditor />

      <h2>Código Gerado</h2>
      <pre id="generatedCode"></pre>

    </div>
  );
}

export default App;