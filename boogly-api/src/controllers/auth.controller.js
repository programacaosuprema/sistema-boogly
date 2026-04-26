import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// 🔥 LOGIN OU REGISTER AUTOMÁTICO
export const authenticate = async (req, res) => {
  try {
    const { email, nick } = req.body;

    let user = await User.findOne({
      $or: [
        { email },
        { nickname: email } // 🔥 aqui permite login por nick
      ]
    });

    // 👉 se não existe → cria
    if (!user) {
      let finalNick = nick;

      if (!finalNick) {
        finalNick = generateNick();
      }

      user = await User.create({
        email,
        nickname: finalNick,
        points: 0,
      });
    }

    // 🔥 GERA TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Autenticado com sucesso",
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
      },
      token,
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

    const timestamp = Date.now().toString().slice(-6); // últimos 6 dígitos
    const random = Math.random().toString(36).substring(2, 5); // 3 letras

    const nickname = `Visitante_${timestamp}${random}`;

    const user = await User.create({
      email: `guest_${Date.now()}@guest.com`, // fake
      nickname,
      points: 0,
      guest: true // 🔥 importante
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        guest: true
      },
      token
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};