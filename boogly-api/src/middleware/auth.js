import jwt from "jsonwebtoken";

/**
 * 🔓 Auth opcional (não quebra se não tiver auth)
 * - tenta cookie primeiro
 * - fallback para Authorization (opcional)
 */
export function optionalAuth(req, res, next) {
  try {
    let token = null;

    // 🍪 1. cookie (PRIORIDADE)
    if (req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    // 🔑 2. fallback header (opcional)
    else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.userId = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

  } catch (err) {
    req.userId = null;
  }

  next();
}

/**
 * 🔒 Auth obrigatório
 * - aceita cookie OU header
 */
export function requireAuth(req, res, next) {
  try {
    let token = null;

    // 🍪 1. cookie primeiro
    if (req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    // 🔑 2. fallback header (opcional)
    else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}