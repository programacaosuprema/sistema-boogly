// src/components/onboarding/OnboardingFlow.jsx
import { useState, useEffect, useCallback, useContext } from "react";
import { homeTheme } from "../../theme/HomeTheme";
import { AppContext } from "../../app_configuration/AppContext";
import { useAuth } from "../../autenticator/useAuth";

const steps = [
  { title: "Bem-vindo 👋", description: "Você vai aprender estruturas de dados de forma visual." },
  { title: "Arraste blocos 🧩", description: "Monte algoritmos conectando blocos." },
  { title: "Execute ▶️", description: "Teste sua solução em tempo real." },
  { title: "Evolua 🚀", description: "Resolva desafios e evolua." }
];

export default function OnboardingFlow({ onFinish }) {
  const [step, setStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  const { domainUrl } = useContext(AppContext);
  const { token, user, refreshUser } = useAuth(); // pega refreshUser

  const current = steps[step];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const finish = useCallback(async () => {
    try {
      // GUEST: usa sessionStorage (isolado por navegador)
      if (user?.guest) {
        if (dontShow) sessionStorage.setItem("onboarding_done", "true");
        else sessionStorage.removeItem("onboarding_done");
      }

      // USUÁRIO LOGADO (salva no backend)
      if (token && !user?.guest) {
        const res = await fetch(`${domainUrl}/users/me/onboarding`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ onboardingDone: !!dontShow })
        });
        console.log(res);
        // após salvar no backend, atualiza o user no contexto
        await refreshUser();
      }

      onFinish?.();
    } catch (err) {
      console.error("Erro onboarding:", err);
      // em erro, tentar ainda atualizar e fechar
      try { await refreshUser(); } catch(e) {console.log(e);}
      onFinish?.();
    }
  }, [dontShow, token, user, domainUrl, onFinish, refreshUser]);

  function next() {
    if (step === steps.length - 1) finish();
    else setStep((s) => s + 1);
  }

  function skip() {
    finish();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div className="w-full max-w-lg p-6 rounded-3xl shadow-2xl text-center"
        style={{ background: homeTheme.background, color: homeTheme.text }}
      >
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i}
              className="w-3 h-3 rounded-full transition"
              style={{ background: i === step ? homeTheme.primary : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-3">{current.title}</h2>
        <p className="mb-4 opacity-80">{current.description}</p>

        <label className="flex items-center justify-center gap-2 mb-6 text-sm">
          <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} />
          Não mostrar novamente
        </label>

        <div className="flex justify-between">
          <button onClick={skip} className="underline text-sm opacity-70">pular</button>

          <button onClick={next}
            className="px-6 py-2 rounded-lg font-semibold"
            style={{ background: homeTheme.primary, color: "#fff" }}
          >
            {step === steps.length - 1 ? "Começar" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}