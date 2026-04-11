import { useAuth } from "./context/useAuth";

import Home from "./pages/Home";
import MainApp from "./pages/MainApp";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Home />;
  }

  return <MainApp />;
}