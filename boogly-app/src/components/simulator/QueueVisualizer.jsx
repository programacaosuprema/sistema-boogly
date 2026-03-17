export default function QueueVisualizer({ data = [] }) {
  return (
    <div className="queue">
      {data.map((value, index) => (
        <div key={index} className="queue-item">
          {value}
        </div>
      ))}
    </div>
  );
}