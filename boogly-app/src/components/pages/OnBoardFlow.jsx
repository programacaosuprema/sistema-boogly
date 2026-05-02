import { useState, useEffect } from "react";
import { homeTheme } from "../../theme/HomeTheme";

const steps = [
  {
    title: "Bem-vindo 👋",
    description: "Você vai aprender estruturas de dados de forma visual e interativa."
  },
  {
    title: "Arraste blocos 🧩",
    description: "Monte algoritmos conectando blocos, como no Scratch."
  },
  {
    title: "Execute ▶️",
    description: "Teste sua solução e veja o resultado em tempo real."
  },
  {
    title: "Evolua 🚀",
    description: "Ganhe pontos e avance nos desafios."
  }
];

export default function OnboardingFlow({ onFinish }) {
  const [step, setStep] = useState(0);

  const current = steps[step];

  // 🔒 bloqueia scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ⌨️ teclado
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter") next();
      if (e.key === "Escape") skip();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, skip, step]);

  function finish() {
    try {
      localStorage.setItem("onboarding_done", "true");
      onFinish?.();
    } catch (err) {
      console.error("Erro no onboarding:", err);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function next() {
    if (step === steps.length - 1) {
      finish();
    } else {
      setStep((prev) => prev + 1);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function skip() {
    finish();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{
        background: "rgba(0,0,0,0.7)"
      }}
    >
      <div
        className="w-full max-w-lg p-8 rounded-3xl shadow-2xl text-center"
        style={{
          background: homeTheme.background,
          color: homeTheme.text,
          border: `1px solid rgba(255,255,255,0.1)`
        }}
      >

        {/* INDICADOR */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition"
              style={{
                background:
                  i === step
                    ? homeTheme.primary
                    : "rgba(255,255,255,0.2)",
                transform: i === step ? "scale(1.2)" : "scale(1)"
              }}
            />
          ))}
        </div>

        {/* CONTEÚDO */}
        <h2 className="text-2xl font-bold mb-3">
          {current?.title || "Onboarding"}
        </h2>

        <p className="mb-6 opacity-80">
          {current?.description || ""}
        </p>

        {/* AÇÕES */}
        <div className="flex justify-between items-center">

          <button
            onClick={skip}
            className="text-sm underline opacity-70 hover:opacity-100 transition"
          >
            pular
          </button>

          <button
            onClick={next}
            className="px-6 py-2 rounded-lg font-semibold transition"
            style={{
              background: homeTheme.primary,
              color: "#fff"
            }}
          >
            {step === steps.length - 1 ? "Começar" : "Próximo"}
          </button>

        </div>

      </div>
    </div>
  );
}