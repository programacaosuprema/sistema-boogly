export default function StackVisualizer({ stack = [] }) {

  return (
    <div className="stack">
      {stack.map((value, index) => (
        <div key={index} className="stack-item">
          {value}
        </div>
      ))}
    </div>
  );

}