// =============================================================
// TELA: LoginScreen
// Formulário de login + link para cadastro
// =============================================================
import { useState } from "react";
import { login } from "../services/auth";
import { C } from "../constants/colors";

export default function LoginScreen({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) return setError("Preencha todos os campos.");
    setLoading(true);
    setError("");
    try {
      const user = await login({ email, password });
      onLogin(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Logo hero */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>⚡</div>
        <p style={{ color: C.textSub, fontSize: 13, margin: 0 }}>
          Monitore seu consumo sustentável
        </p>
      </div>

      <Field label="E-mail" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" />
      <Field label="Senha" value={password} onChange={setPassword} type="password" placeholder="••••••••" />

      {error && (
        <div style={{ background: `${C.danger}18`, border: `1px solid ${C.danger}44`, borderRadius: 12, padding: "10px 14px" }}>
          <p style={{ color: C.danger, fontSize: 13, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      <PrimaryButton label={loading ? "Entrando..." : "Entrar"} color={C.gold} onClick={handleLogin} disabled={loading} />

      <div style={{ textAlign: "center" }}>
        <span style={{ color: C.textSub, fontSize: 13 }}>Não tem conta? </span>
        <button onClick={onGoRegister} style={{ background: "none", border: "none", color: C.blue, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Cadastrar
        </button>
      </div>
    </div>
  );
}

// Sub-componentes internos
function Field({ label, value, onChange, type, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <p style={{ color: C.textSub, fontSize: 11, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 14, fontSize: 14,
          background: C.card, color: C.text, outline: "none",
          border: `1px solid ${focused ? C.blue : C.border}`,
          transition: "border-color 0.2s",
          boxShadow: focused ? `0 0 0 3px ${C.blue}18` : "none",
        }}
      />
    </div>
  );
}

function PrimaryButton({ label, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: 14, borderRadius: 14, border: "none",
        background: disabled ? `${color}55` : `linear-gradient(135deg, ${color}, ${color}BB)`,
        color: "#0A172E", fontWeight: 800, fontSize: 15, cursor: disabled ? "default" : "pointer",
        boxShadow: disabled ? "none" : `0 4px 20px ${color}55`,
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}