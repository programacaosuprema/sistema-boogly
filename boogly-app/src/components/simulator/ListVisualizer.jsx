export default function ListVisualizer({ data = [] }) {
  return (
    <div className="list">
      {data.map((value, index) => (
        <div key={index} className="list-item">
          {value}
        </div>
      ))}
    </div>
  );
}