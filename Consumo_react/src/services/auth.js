// =============================================================
// SERVIÇO: auth.js
// -------------------------------------------------------------
// Autenticação local com hash SHA-256 (Web Crypto API nativa).
// Salva usuários e sessão no localStorage.
//
// IMPORTANTE: em produção real, substituir por backend com
// bcrypt + JWT. Aqui usamos hash no front só para o protótipo.
// =============================================================

const USERS_KEY = "wavunder_users";
const SESSION_KEY = "wavunder_session";

// ── Hash SHA-256 com salt fixo ────────────────────────────────
// crypto.subtle é nativo no browser, sem dependência externa
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "wavunder_salt_2024");
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Helpers de storage ───────────────────────────────────────
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// ── Cadastro ─────────────────────────────────────────────────
// Valida duplicidade, salva hash (nunca a senha em texto puro)
export async function register({ nome, email, password }) {
  const users = getUsers();

  if (users.find((u) => u.email === email))
    throw new Error("E-mail já cadastrado.");

  const hash = await hashPassword(password);
  const newUser = { id: Date.now(), nome, email, hash };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

  // Salva sessão sem expor o hash
  const { hash: _, ...safeUser } = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

// ── Login ────────────────────────────────────────────────────
export async function login({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) throw new Error("E-mail não encontrado.");
  if ((await hashPassword(password)) !== user.hash)
    throw new Error("Senha incorreta.");

  const { hash: _, ...safeUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

// ── Sessão ───────────────────────────────────────────────────
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

// ── Logout ───────────────────────────────────────────────────
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
