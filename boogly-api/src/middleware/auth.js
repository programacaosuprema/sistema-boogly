import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token ausente" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 ESSENCIAL
    req.user = { id: decoded.id };

    next();

  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};