export default function Header({ structure, setStructure }) {
  return (
    <div className="h-full flex items-center justify-between px-6">

      <h1 className="text-xl font-bold text-purple-300">
        🧠 Boogly
      </h1>

      <div className="flex gap-2">
        {["list", "stack", "queue"].map((type) => (
          <button
            key={type}
            onClick={() => setStructure(type)}
            className={`
              px-4 py-1 rounded-full text-sm capitalize
              transition-all duration-200
              ${
                structure === type
                  ? "bg-purple-500 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/20"
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}