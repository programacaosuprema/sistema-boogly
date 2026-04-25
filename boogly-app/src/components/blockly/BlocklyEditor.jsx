import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

import "../../blockly/blocks/stackBlocks";
import "../../blockly/blocks/queueBlocks";
import "../../blockly/blocks/listBlocks";

import "../../blockly/generators/stackGenerator";
import "../../blockly/generators/listGenerator";
import "../../blockly/generators/queueGenerator";

import { javascriptGenerator } from "blockly/javascript";
import { cGenerator } from "../../blockly/generators/cGenerator";
import { executeCode } from "../simulator/executeCode";

import { toolboxCategories } from "../../blockly/toolboxes";

export default function BlocklyEditor({
  structure,
  setCode,
  setCCode,
  setSteps,
  setCurrentStep,
}) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const debounceRef = useRef(null);

  // 🔥 categoria ativa
  const [category, setCategory] = useState("list");

  const toolboxMap = toolboxCategories;

  // 🔥 CRIA WORKSPACE
  useEffect(() => {
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxMap[category],
      trashcan: true,
      grid: { spacing: 20, length: 3, colour: "#eac", snap: true },
      zoom: {
        controls: true,
        wheel: true,
      },
    });

    workspaceRef.current.addChangeListener((event) => {
      if (event.isUiEvent) return;

      clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const codeJS =
          javascriptGenerator.workspaceToCode(workspaceRef.current);

        setCode(codeJS);

        const codeC = cGenerator(workspaceRef.current);
        setCCode(codeC);

        const steps = executeCode(codeJS, structure);
        setSteps(steps);
        setCurrentStep(0);
      }, 200);
    });

    return () => {
      workspaceRef.current?.dispose();
    };
  }, [category, setCCode, setCode, setCurrentStep, setSteps, structure, toolboxMap]);

  // 🔥 ATUALIZA TOOLBOX AO TROCAR CATEGORIA
  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.updateToolbox(toolboxMap[category]);
    }
  }, [category, toolboxMap]); 

  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-visible">

      <div className="w-14 bg-gray-50 border-r flex flex-col items-center gap-4 py-3 relative overflow-visible">

        {/* LISTA */}
        <div className="group relative">
          <button
            onClick={() => setCategory("list")}
            className={`w-10 h-10 rounded-full transition ${
              category === "list"
                ? "bg-blue-600 scale-110"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          />
          <span className="absolute left-12 top-1/2 -translate-y-1/2 
          bg-black text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition 
          whitespace-nowrap z-50 pointer-events-none">
          Lista
        </span>
        </div>

        {/* VARIÁVEIS */}
        <div className="group relative">
          <button
            onClick={() => setCategory("variables")}
            className={`w-10 h-10 rounded-full transition ${
              category === "variables"
                ? "bg-yellow-500 scale-110"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          />
         <span className="absolute left-12 top-1/2 -translate-y-1/2 
          bg-black text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition 
          whitespace-nowrap z-50 pointer-events-none">
          Váriaveis
        </span>
        </div>

        {/* CONDIÇÕES */}
        <div className="group relative">
          <button
            onClick={() => setCategory("conditions")}
            className={`w-10 h-10 rounded-full transition ${
              category === "conditions"
                ? "bg-green-600 scale-110"
                : "bg-green-500 hover:bg-green-600"
            }`}
          />
          <span className="absolute left-12 top-1/2 -translate-y-1/2 
          bg-black text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition 
          whitespace-nowrap z-50 pointer-events-none">
          Condições
        </span>
        </div>

        {/* LAÇOS */}
        <div className="group relative">
          <button
            onClick={() => setCategory("loops")}
            className={`w-10 h-10 rounded-full transition ${
              category === "loops"
                ? "bg-purple-600 scale-110"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          />
          <span className="absolute left-12 top-1/2 -translate-y-1/2 
          bg-black text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition 
          whitespace-nowrap z-50 pointer-events-none">
          Laços
        </span>
        </div>

        {/* ESTADO */}
        <div className="group relative">
          <button
            onClick={() => setCategory("state")}
            className={`w-10 h-10 rounded-full transition ${
              category === "state"
                ? "bg-teal-600 scale-110"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          />
          <span className="absolute left-12 top-1/2 -translate-y-1/2 
          bg-black text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition 
          whitespace-nowrap z-50 pointer-events-none">
          Estado
        </span>
        </div>

        {/* ORDENAÇÃO */}
        <div className="group relative">
          <button
            onClick={() => setCategory("sort")}
            className={`w-10 h-10 rounded-full transition ${
              category === "sort"
                ? "bg-indigo-600 scale-110"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          />
          <span className="absolute left-12 top-1/2 -translate-y-1/2 
          bg-black text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition 
          whitespace-nowrap z-50 pointer-events-none">
          Ordenação
        </span>
        </div>

      </div>

      {/* 🔥 WORKSPACE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-cyan-100 px-4 py-3 flex justify-between items-center border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
              Área de Programação
            </div>
            <span className="text-sm font-semibold text-gray-700">
              arraste e conecte os blocos
            </span>
          </div>
        </div>

        {/* Blockly */}
        <div className="flex-1">
          <div ref={blocklyDiv} className="h-full w-full" />
        </div>

      </div>
    </div>
  );
}