export default function Sidebar({ structure, setStructure }) {

  return (

    <div className="sidebar">

      <h2>Boogly</h2>

      <div className="structurebar">

        <button
          className={structure === "stack" ? "active" : ""}
          onClick={() => setStructure("stack")}
        >
          📚 Pilha
        </button>

        <button
          className={structure === "queue" ? "active" : ""}
          onClick={() => setStructure("queue")}
        >
          🧊 Fila
        </button>

        <button
          className={structure === "list" ? "active" : ""}
          onClick={() => setStructure("list")}
        >
          📦 Lista
        </button>

      </div>

      <hr />

      <div>
        <h3>Desafios</h3>

        <p>Empilhar múltiplos</p>
        <p>Remover topo</p>

      </div>

    </div>

  );

}