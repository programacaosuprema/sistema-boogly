export default function Sidebar({ setStructure }) {

  return (

    <div className="sidebar">

      <h2>Boogly</h2>

      <button onClick={() => setStructure("stack")}>
        📚 Pilha
      </button>

      <button onClick={() => setStructure("queue")}>
        🧊 Fila
      </button>

      <button onClick={() => setStructure("list")}>
        📦 Lista
      </button>

      <hr />

      <h3>Desafios</h3>

      <p>Empilhar múltiplos</p>
      <p>Remover topo</p>

    </div>

  );

}