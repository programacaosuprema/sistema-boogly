import { useEffect, useRef, useState } from "react";
import "../../styles/simulator.css";

export default function ListVisualizer({ data }) {

  const prevStateRef = useRef({});
  const [removingIndex, setRemovingIndex] = useState(null);

  useEffect(() => {

    if (!data) return;

    const prev = prevStateRef.current;
    const curr = data;

    const key = Object.keys(curr)[0];

    if (prev[key] && curr[key]) {
      if (prev[key].length > curr[key].length) {

        const index = prev[key].length - 1;

        setRemovingIndex(index);

        setTimeout(() => {
          setRemovingIndex(null);
        }, 400);
      }
    }

    prevStateRef.current = curr;

  }, [data]);

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
                <div key={index} style={{ display: "flex", alignItems: "center" }}>

                  {/* 🔥 NOVO WRAPPER */}
                  <div className="node-wrapper">

                    <div className="node-index">{index}</div>

                    <div className={`node ${removingIndex === index ? "bubble-pop" : ""}`}>
                      {item}
                    </div>

                    <div className="node-label">
                      {index === 0 && "Início"}
                      {index === list.length - 1 && "Fim"}
                    </div>

                  </div>

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