export default function StackVisualizer({ data = [] }) {
  return (
    <div className="stack">
      {data.map((value, index) => (
        <div key={index} className="stack-item">
          {value}
        </div>
      ))}
    </div>
  );
}