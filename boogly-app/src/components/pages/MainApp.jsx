import { Outlet } from "react-router-dom";
import Header from "../panels/Header";
import { useAuth } from "../../autenticator/useAuth";

export default function MainApp() {

  const { structure, setStructure } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* HEADER */}
      <header className="h-16 border-b border-white/10">
        <Header structure={structure} setStructure={setStructure} />
      </header>

      {/* 🔥 AQUI TROCA A TELA */}
      <main className="flex-1 min-h-0 p-3">
        <Outlet />
      </main>

    </div>
  );
}