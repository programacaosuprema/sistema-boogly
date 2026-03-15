import React, { useState } from "react";

export default function StepController({ steps, setStack }) {

  const [currentStep, setCurrentStep] = useState(0);

  function nextStep() {

    if (currentStep >= steps.length) return;

    setStack(steps[currentStep].stack);
    setCurrentStep(currentStep + 1);

  }

  return (

    <div style={{ marginTop: "20px" }}>

      <button onClick={nextStep}>
        Próximo passo
      </button>

      <p>
        Passo: {currentStep}/{steps.length}
      </p>

    </div>

  );

}