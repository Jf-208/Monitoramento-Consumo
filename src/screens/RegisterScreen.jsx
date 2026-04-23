// =============================================================
// TELA: RegisterScreen
// Formulário de cadastro com validação e hash de senha
// =============================================================
import { useState } from "react";
import { register } from "../services/auth";
import { C } from "../constants/colors";

export default function RegisterScreen({ onLogin, onGoLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!nome || !email || !password) return setError("Preencha todos os campos.");
    if (password.length < 6) return setError("Senha deve ter no mínimo 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setLoading(true);
    setError("");
    try {
      const user = await register({ nome, email, password });
      onLogin(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <p style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Criar conta</p>
        <p style={{ color: C.textSub, fontSize: 13, margin: 0 }}>Junte-se ao consumo sustentável</p>
      </div>

      {[
        { label: "Nome", value: nome, onChange: setNome, type: "text", placeholder: "Seu nome completo" },
        { label: "E-mail", value: email, onChange: setEmail, type: "email", placeholder: "seu@email.com" },
        { label: "Senha", value: password, onChange: setPassword, type: "password", placeholder: "Mínimo 6 caracteres" },
        { label: "Confirmar senha", value: confirm, onChange: setConfirm, type: "password", placeholder: "Repita a senha" },
      ].map((f) => <Field key={f.label} {...f} />)}

      {error && (
        <div style={{ background: `${C.danger}18`, border: `1px solid ${C.danger}44`, borderRadius: 12, padding: "10px 14px" }}>
          <p style={{ color: C.danger, fontSize: 13, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      <PrimaryButton label={loading ? "Cadastrando..." : "Criar conta"} color={C.teal} onClick={handleRegister} disabled={loading} />

      <div style={{ textAlign: "center" }}>
        <span style={{ color: C.textSub, fontSize: 13 }}>Já tem conta? </span>
        <button onClick={onGoLogin} style={{ background: "none", border: "none", color: C.blue, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Entrar
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <p style={{ color: C.textSub, fontSize: 11, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 14, fontSize: 14, background: C.card, color: C.text, outline: "none", border: `1px solid ${focused ? C.teal : C.border}`, transition: "border-color 0.2s", boxShadow: focused ? `0 0 0 3px ${C.teal}18` : "none" }} />
    </div>
  );
}

function PrimaryButton({ label, color, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: disabled ? `${color}55` : `linear-gradient(135deg, ${color}, ${color}BB)`, color: "#0A172E", fontWeight: 800, fontSize: 15, cursor: disabled ? "default" : "pointer", boxShadow: disabled ? "none" : `0 4px 20px ${color}55`, transition: "all 0.2s" }}>{label}</button>
  );
}