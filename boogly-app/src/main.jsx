import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./autenticator/AuthProvider";
import { AppProvider } from './app_configuration/AppProvider';
import { ThemeProvider } from './theme/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  </ThemeProvider>
);