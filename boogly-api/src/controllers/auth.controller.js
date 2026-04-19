let users = [];

export function register(req, res) {
  const { email, nick } = req.body;

  // 🔍 verifica se email já existe
  const emailExists = users.find(u => u.email === email);

  if (emailExists) {
    return res.status(400).json({
      message: "Email já cadastrado"
    });
  }

  let finalNick = nick;

  // 🔥 se não vier nick → gera automático
  if (!finalNick) {
    finalNick = generateUniqueNick(users);
  }

  // 🔥 verifica duplicado manual
  const nickExists = users.find(u => u.nick === finalNick);

  if (nickExists) {
    finalNick = generateUniqueNick(users);
  }

  const user = { email, nick: finalNick };

  users.push(user);

  return res.json({
    message: "Usuário criado",
    user,
  });
}

export function login(req, res) {
  const { email } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  return res.json({
    message: "Login realizado",
    user,
  });
}

export function getUsers(req, res) {
  return res.json({
    users
  });
}

function generateNick() {
  const roles = ["Convidado", "Player", "Coder"];
  const themes = ["Stack", "Queue", "List", "Node"];
  const num = Math.floor(Math.random() * 999);

  return `${roles[Math.floor(Math.random() * roles.length)]}_${themes[Math.floor(Math.random() * themes.length)]}_${num}`;
}

function generateUniqueNick(users) {
  let nick;
  let exists = true;

  while (exists) {
    nick = generateNick();

    exists = users.some(user => user.nick === nick);
  }

  return nick;
}