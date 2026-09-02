// src/pages/Home.jsx
import React, { useState, useContext } from "react";
import AuthModal from "./AuthModal";
import OnboardingFlow from "./OnBoardFlow";

import { useAuth } from "../../autenticator/useAuth";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../app_configuration/useApp";
import { useError } from "../../error/useError";

import { homeTheme } from "../../theme/HomeTheme";
import { AppContext } from "../../app_configuration/AppContext";
import { useTheme } from "../../theme/useTheme";

/**
 * Home page atualizada para usar theme.js corretamente e evitar manipulação direta do DOM.
 * - Usa useTheme() para cores/typography/spacing.
 * - Mantém homeTheme apenas para gradientes dos cards.
 * - Não altera estilos diretamente no evento onMouseEnter/onMouseLeave.
 */

export default function Home() {
  const { user, token, loginAsGuest, setStructure } = useAuth();
  const { showError } = useError();
  const { domainUrl } = useContext(AppContext);
  const [openModal, setOpenModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const navigate = useNavigate();
  const { appName } = useApp();

  const { theme } = useTheme(); // usa o theme global

  // 🚀 INICIAR FLUXO
  async function handleStart(type) {
    if (!type) {
      showError({ message: "Estrutura inválida" });
      return;
    }

    // se não logado, abre modal de autenticação
    if (!user) {
      setOpenModal(true);
      return;
    }

    setSelectedStructure(type);

    try {
      // 👻 usuário guest
      if (user.guest) {
        const done = sessionStorage.getItem("onboarding_done");
        if (done === "true") {
          setStructure(type);
          navigate("/app");
          return;
        }
        setShowOnboarding(true);
        return;
      }

      // 👤 usuário real -> verifica se terminou onboarding
      const res = await fetch(`${domainUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        // caso servidor responda com erro, não bloqueia o fluxo; abre onboarding
        setShowOnboarding(true);
        return;
      }

      const data = await res.json();

      if (data.onboardingDone === true) {
        setStructure(type);
        navigate("/app");
      } else {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error(err);
      // se der erro de rede, permitimos continuar com onboarding local
      setShowOnboarding(true);
    }
  }

  // finaliza onboarding (muda estrutura e navega)
  function finishOnboarding() {
    if (!selectedStructure) {
      showError({ message: "Erro ao iniciar o desafio" });
      return;
    }

    try {
      setStructure(selectedStructure);
      setShowOnboarding(false);
      navigate("/app");
    } catch (err) {
      showError(err);
    }
  }

  // login como convidado
  async function handleGuest() {
    try {
      setLoadingGuest(true);
      await loginAsGuest();
    } catch (err) {
      showError(err);
    } finally {
      setLoadingGuest(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: theme?.background,
        color: theme?.text,
        fontFamily: theme?.typography?.body?.fontFamily || undefined
      }}
    >
      {/* container central (cartão) */}
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: theme?.spacing?.lg,
          padding: theme?.spacing?.lg,
          borderRadius: 16,
          boxSizing: "border-box"
        }}
      >
        {/* 🧠 TITLE */}
        <h1
          className="text-center"
          style={{
            margin: 0,
            color: theme?.text,
            ...theme?.typography?.h1,
            fontSize: "48px",
            lineHeight: 1
          }}
        >
          {appName}
        </h1>

        <p
          className="text-center"
          style={{
            color: theme?.muted,
            ...theme?.typography?.body,
            margin: 0
          }}
        >
          Escolha seu primeiro desafio!
        </p>

        {/* 🧩 CARDS */}
        <div
          className="flex flex-wrap justify-center gap-8"
          style={{ width: "100%", marginTop: theme?.spacing?.md }}
        >
          <HomeCard
            title="Lista"
            description="Aprenda como funciona uma lista (inserção, remoção, criação)."
            gradient={homeTheme.list?.gradient}
            onClick={() => handleStart("list")}
            theme={theme}
          />

          <HomeCard
            title="Pilha"
            description="Entenda com funciona empilhar e desempilhar com blocos"
            gradient={homeTheme.stack?.gradient}
            onClick={() => handleStart("stack")}
            theme={theme}
          />

          <HomeCard
            title="Fila"
            description="Enfileire e desenfileire elementos com operações simples."
            gradient={homeTheme.queue?.gradient}
            onClick={() => handleStart("queue")}
            theme={theme}
          />

          {/* NOVO: Árvore Binária — Em breve */}
          <HomeCard
            title="Árvore Binária"
            description="Entenda inserção, remoção e busca em profundidade em árvores binárias."
            gradient={homeTheme.tree?.gradient || theme?.card}
            onClick={undefined}
            disabled={true}
            theme={theme}
          />
        </div>

        {/* 🔥 ACTIONS */}
        <div
          className="mt-6 flex flex-col items-center gap-4"
          style={{ width: "100%", alignItems: "center" }}
        >
          {!user ? (
            <>
              <PrimaryButton onClick={() => setOpenModal(true)} text="Entrar / Criar Conta" theme={theme} />
              <GhostButton onClick={handleGuest} loading={loadingGuest} text={loadingGuest ? "Entrando..." : "Testar sem login"} theme={theme} />
            </>
          ) : null}

          <p className="text-sm" style={{ color: theme?.muted, marginTop: theme?.spacing?.sm }}>
            {!user
              ? "O progresso não será salvo sem login"
              : user.guest
              ? "Modo visitante ativo. Escolha uma estrutura de dados para começar."
              : `Bem-vindo, ${user.nickname}! Escolha uma estrutura de dados para estudar.`}
          </p>
        </div>

        {/* AUTH MODAL */}
        <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />

        {/* ONBOARDING */}
        {showOnboarding && <OnboardingFlow onFinish={finishOnboarding} />}
      </div>
    </div>
  );
}

/* ======= COMPONENTS AUXILIARES ======= */

/**
 * HomeCard com overlay adaptativo para legibilidade.
 * Props:
 * - title, description, gradient, onClick, disabled, theme
 */
function HomeCard({ title, description, gradient, onClick, disabled = false, theme }) {
  const [hover, setHover] = useState(false);

  // tenta extrair primeira cor do gradient (se for linear-gradient(...))
  function extractFirstColorFromGradient(g) {
    if (!g || typeof g !== "string") return null;
    // procura por #xxxxxx ou rgb(...)
    const hexMatch = g.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
    if (hexMatch) return hexMatch[0];
    const rgbMatch = g.match(/rgba?\([^\)]+\)/);
    if (rgbMatch) return rgbMatch[0];
    // se for "to right, #fff 0%, #000 100%" -> pega primeiro stop
    const stops = g.split(",").map(s => s.trim());
    for (let s of stops) {
      const h = s.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
      if (h) return h[0];
      const r = s.match(/rgba?\([^\)]+\)/);
      if (r) return r[0];
    }
    return null;
  }

  // helpers de parsing (hex / rgb) para obter rgb array
  function hexToRgb(hex) {
    if (!hex) return null;
    const h = hex.replace("#", "");
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16)
      ];
    }
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function rgbStringToArray(rgb) {
    const m = rgb && rgb.match && rgb.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    return m[1].split(",").slice(0, 3).map(s => parseInt(s.trim()));
  }

  function toRgbArray(color) {
    if (!color) return [15, 23, 42];
    if (typeof color !== "string") return [15, 23, 42];
    if (color.startsWith("#")) return hexToRgb(color);
    if (color.startsWith("rgb")) return rgbStringToArray(color);
    return hexToRgb(color);
  }

  function luminance([r, g, b]) {
    const srgb = [r, g, b].map(c => c / 255).map(c => (c <= 0.03928 ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4)));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  // determina se o fundo do cartão é escuro (usa a primeira cor do gradient se existente)
  const firstColor = extractFirstColorFromGradient(gradient) || theme?.background || "#0f172a";
  const firstColorArr = toRgbArray(firstColor);
  const isDarkBg = luminance(firstColorArr) < 0.45;

  // overlay adaptativo: usa a cor do theme.background com alpha
  const bgColorArr = toRgbArray(theme?.background ?? "#0f172a");
  const overlayAlpha = isDarkBg ? 0.56 : 0.18;
  const [r, g, b] = bgColorArr;
  const overlayColor = `rgba(${r}, ${g}, ${b}, ${overlayAlpha})`;

  const cardStyle = {
    background: gradient || theme?.card || theme?.workspace,
    position: "relative",
    width: 256,
    padding: 20,
    borderRadius: 20,
    boxShadow: hover ? "0 14px 40px rgba(2,6,23,0.12)" : "0 8px 20px rgba(2,6,23,0.06)",
    transform: hover ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
    transition: "all 180ms ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    minHeight: 160,
    overflow: "hidden",
    border: `1px solid ${theme?.border}`
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: overlayColor,
    pointerEvents: "none"
  };

  const contentStyle = {
    position: "relative",
    zIndex: 2,
    color: theme?.text,
    textShadow: isDarkBg ? "0 1px 6px rgba(0,0,0,0.6)" : "none"
  };

  const titleStyle = {
    margin: 0,
    color: theme?.text,
    ...theme?.typography?.h2,
    fontWeight: 800,
    letterSpacing: "0.2px"
  };

  const descStyle = {
    marginTop: 8,
    marginBottom: 0,
    color: isDarkBg ? "#e6eefb" : theme?.muted,
    ...theme?.typography?.body,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? theme?.border : theme?.success,
    color: "#000",
    marginTop: 12
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) onClick && onClick(); }}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={cardStyle}
      aria-disabled={disabled}
    >
      {/* overlay para legibilidade */}
      <div style={overlayStyle} aria-hidden="true" />

      {/* conteúdo */}
      <div style={contentStyle}>
        <div>
          <h2 style={titleStyle}>{title}</h2>
          <p style={descStyle}>{description}</p>
        </div>

        <div>
          <button style={buttonStyle} disabled={disabled} aria-label={`Iniciar ${title}`}>
            {disabled ? "Em breve" : "Iniciar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* PrimaryButton - estilo consistente com theme */
function PrimaryButton({ onClick, text, theme }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={text}
      className="px-6 py-2 rounded-lg font-semibold transition"
      style={{
        background: hover ? (theme?.hover || theme?.primary) : theme?.primary,
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: hover ? `0 10px 30px ${theme?.primary}22` : "none"
      }}
    >
      {text}
    </button>
  );
}

/* GhostButton - botão secundário / convidado */
function GhostButton({ onClick, text, loading = false, theme }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
      aria-label={text}
      className="px-6 py-2 rounded-lg transition"
      style={{
        background: hover ? (theme?.active || theme?.card) : theme?.card,
        color: theme?.text,
        border: `1px solid ${theme?.border}`,
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer"
      }}
    >
      {text}
    </button>
  );
}