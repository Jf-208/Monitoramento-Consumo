// =============================================================
// SERVIÇO: auth.js
// Autenticação local com hash SHA-256 (Web Crypto API nativa)
// Em produção real: substituir por chamada a backend com bcrypt
// =============================================================

const USERS_KEY = "wavunder_users";
const SESSION_KEY = "wavunder_session";

// Gera hash SHA-256 da senha (assíncrono, retorna hex string)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "wavunder_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Retorna lista de usuários salvos
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// Cadastro: verifica duplicidade, faz hash e salva
export async function register({ nome, email, password }) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("E-mail já cadastrado.");
  }
  const hash = await hashPassword(password);
  const newUser = { id: Date.now(), nome, email, hash };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  // Já loga após cadastro
  const { hash: _, ...safeUser } = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

// Login: busca usuário, compara hash
export async function login({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("E-mail não encontrado.");
  const hash = await hashPassword(password);
  if (hash !== user.hash) throw new Error("Senha incorreta.");
  const { hash: _, ...safeUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

// Retorna usuário logado ou null
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

// Logout
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}