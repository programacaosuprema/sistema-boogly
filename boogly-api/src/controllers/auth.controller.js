import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res) => {
  try {
    const { email, nick } = req.body;

    let user = await User.findOne({
      $or: [
        { email },
        { nickname: email }
      ]
    });

    if (!user) {
      let finalNick = nick || generateNick();

      user = await User.create({
        email,
        nickname: finalNick,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProd = process.env.NODE_ENV === "production";

    // 🔥 AQUI ESTÁ O QUE FALTAVA
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: !!isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 3600 * 1000,
      path: "/"
    });

    return res.json({
      message: "Autenticado com sucesso",
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
      }
      // ❌ não precisa mais retornar token
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 🔥 LISTAR USUÁRIOS (debug)
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// 🔥 GERADOR DE NICK
function generateNick() {
  const roles = ["Convidado", "Player", "Coder"];
  const themes = ["Stack", "Queue", "List", "Node"];
  const num = Math.floor(Math.random() * 999);

  return `${roles[Math.floor(Math.random() * roles.length)]}_${themes[Math.floor(Math.random() * themes.length)]}_${num}`;
}

export const loginGuest = async (req, res) => {
  try {
    // gera nickname e email fake
    const timestamp = Date.now().toString().slice(-6); // últimos 6 dígitos
    const random = Math.random().toString(36).substring(2, 5); // 3 chars
    const nickname = `Visitante_${timestamp}${random}`;

    // cria user guest no DB
    const user = await User.create({
      email: `guest_${Date.now()}@nolabguest.com`,
      nickname,
      guest: true
    });

    // payload do JWT (pode adicionar mais claims)
    const payload = { id: user._id, guest: true };
    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    const isProd = process.env.NODE_ENV === "production";

    // seta cookie httpOnly (browser não acessa via JS)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: !!isProd, // em dev = false, em produção com https = true
      sameSite: isProd ? "none" : "lax", // sameSite none exige secure:true
      maxAge: 7 * 24 * 3600 * 1000, // 7 dias
      path: "/"
    });

    console.log("[AUTH.CONTROLLER] loginGuest criado:", { nickname: user.nickname, id: user._id.toString().slice(-6) });

    // retorna também o token e dados do user (útil para debug / UI)
    return res.status(201).json({
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        guest: true
      },
      token
    });
  } catch (error) {
    console.error("[AUTH.CONTROLLER] loginGuest error:", error && (error.stack || error.message || error));
    return res.status(500).json({ error: "Erro interno" });
  }
};