export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      <style>{`
        @keyframes blockFloat {
          0%   { transform: translateY(0px) rotate(0deg) scale(1); }
          25%  { transform: translateY(-6px) rotate(8deg) scale(1.05); }
          50%  { transform: translateY(0px) rotate(0deg) scale(1); }
          75%  { transform: translateY(6px) rotate(-8deg) scale(1.05); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }

        @keyframes blockSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: .45; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.08); }
        }

        .block-float {
          animation: blockFloat 1.8s ease-in-out infinite;
        }

        .block-spin {
          animation: blockSpin 2.8s linear infinite;
        }

        .glow {
          animation: pulseGlow 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-cyan-400/10 blur-2xl glow" />

          <div className="relative block-spin w-28 h-28">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-blue-500 shadow-lg flex items-center justify-center block-float">
              <span className="text-xs font-bold">1</span>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-purple-500 shadow-lg flex items-center justify-center block-float" style={{ animationDelay: "0.15s" }}>
              <span className="text-xs font-bold">2</span>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-indigo-500 shadow-lg flex items-center justify-center block-float" style={{ animationDelay: "0.3s" }}>
              <span className="text-xs font-bold">3</span>
            </div>

            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-cyan-500 shadow-lg flex items-center justify-center block-float" style={{ animationDelay: "0.45s" }}>
              <span className="text-xs font-bold">4</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl flex items-center justify-center">
                <div className="w-6 h-6 rounded-md bg-white/90" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Carregando workspace</h2>
          <p className="text-white/70 mt-2">Montando os blocos e preparando o desafio...</p>
        </div>
      </div>
    </div>
  );
}