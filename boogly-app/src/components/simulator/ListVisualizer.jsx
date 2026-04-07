import { useEffect, useRef, useState } from "react";
import "../../styles/simulator.css";

export default function ListVisualizer({ data }) {

  const prevStateRef = useRef({});
  const [shiftStartIndex, setShiftStartIndex] = useState(null);

  useEffect(() => {

  if (!data) return;

  const prev = prevStateRef.current;
  const curr = data;

  const key = Object.keys(curr)[0];

  let newShiftIndex = null;

  if (prev[key] && curr[key]) {

    if (prev[key].length > curr[key].length) {

      let removedIndex = -1;

      for (let i = 0; i < prev[key].length; i++) {
        if (prev[key][i] !== curr[key][i]) {
          removedIndex = i;
          break;
        }
      }

      if (removedIndex === -1) {
        removedIndex = curr[key].length;
      }

      newShiftIndex = removedIndex;
    }
  }

  // 🔥 só atualiza se realmente mudou
  if (newShiftIndex !== null) {
    setTimeout(() => {
      setShiftStartIndex(newShiftIndex);

      setTimeout(() => {
        setShiftStartIndex(null);
      }, 400);

    }, 0); // 🔥 quebra execução síncrona
  }

  prevStateRef.current = curr;

}, [data]);

  // 🔥 estado vazio
  if (!data || Object.keys(data).length === 0) {
    return <div className="empty">Nenhuma lista</div>;
  }

  return (
    <div className="list-container">

      {Object.entries(data).map(([name, list]) => (
        <div key={name}>

          <h3>{name}</h3>

          {list.length === 0 ? (
            <div className="empty">Lista vazia</div>
          ) : (
            <div className="list-box">

              {list.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >

                  {/* 🔥 wrapper completo */}
                  <div className="node-wrapper">

                    {/* índice */}
                    <div className="node-index">{index}</div>

                    {/* nó com animação */}
                    <div
                      className={`node 
                        ${
                          shiftStartIndex !== null && index >= shiftStartIndex
                            ? "shift"
                            : ""
                        }
                      `}
                    >
                      {item}
                    </div>

                    {/* label */}
                    <div className="node-label">
                      {index === 0 && "Início"}
                      {index === list.length - 1 && "Fim"}
                    </div>

                  </div>

                  {/* seta */}
                  {index < list.length - 1 && (
                    <div className="arrow">→</div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}