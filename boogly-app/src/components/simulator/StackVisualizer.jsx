import React from "react";

export default function StackVisualizer({ stack }) {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
        gap: "10px",
        marginTop: "20px"
      }}
    >

      {(stack || []).map((value, index) => (

        <div
          key={index}
          style={{
            width: "120px",
            height: "50px",
            background: "#2c7be5",
            color: "white",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease"
          }}
        >
          {value}
        </div>

      ))}

      <div style={{ marginTop: "10px", fontWeight: "bold" }}>
        TOPO
      </div>

    </div>
  );

}