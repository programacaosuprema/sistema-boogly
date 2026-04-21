import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./autenticator/AuthProvider";
import { AppProvider } from './app_configuration/AppProvider';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
);