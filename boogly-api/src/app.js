import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// 🔥 defina suas origens permitidas
const allowedOrigins = [
  "http://localhost:5173",           // dev
  "https://nolab-az4nvobov-nolab1.vercel.app"       // PRODUÇÃO 
];

// 🔥 CORS CORRETO PARA COOKIES
app.use(cors({
  origin: function (origin, callback) {
    // permite ferramentas como curl/postman (sem origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS bloqueado: " + origin));
  },
  credentials: true, // 🔥 ESSENCIAL PARA COOKIES
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());
app.use(cookieParser()); // 🔥 obrigatório para ler cookies

// rotas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/challenges", challengeRoutes);

export default app;

// src/app.js
/*import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"; // ajuste caminho se necessário
import challengeRoutes from "./routes/challenge.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With"]
}));

app.use(express.json());
app.use(cookieParser()); // <-- essencial

// monte rotas públicas primeiro
app.use("/auth", authRoutes);

// se tiver middleware global de auth, coloque-o **depois** do /auth
// app.use(authMiddleware);
 app.use("/users", userRoutes);
 app.use("/challenges", challengeRoutes);

export default app;*/