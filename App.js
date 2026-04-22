import { useState } from "react";

// ─── PALETA EXTRAÍDA DA LOGO ───────────────────────────────────────────────
const C = {
  bg: "#0A172E",
  surface: "#0F2040",
  card: "#152C58",
  cardHover: "#1A3568",
  border: "#1E3F7A",
  borderSub: "#132650",
  blue: "#5BBFFF",
  blueDim: "#1A6CA8",
  blueSoft: "#2A82CC",
  gold: "#F0A500",
  goldLight: "#FFD060",
  goldDim: "#7A5400",
  teal: "#2EDCB0",
  tealDim: "#0E8A6C",
  violet: "#A78BFA",
  text: "#EEF4FF",
  textSub: "#6A90C0",
  textMuted: "#3A5A80",
  danger: "#FF5A72",
};

const fabItems = [
  { id: "agua", icon: "💧", label: "Água", color: C.blue },
  { id: "energia", icon: "⚡", label: "Energia", color: C.gold },
  { id: "dicas", icon: "🌿", label: "Dicas", color: C.teal },
  { id: "relatorios", icon: "📊", label: "Relatórios", color: C.violet },
];

const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: `radial-gradient(circle at 38% 38%, ${C.blue}, ${C.blueDim})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 17,
        boxShadow: `0 0 14px ${C.blue}55, inset 0 1px 0 ${C.blue}88`,
      }}
    >
      ⚡
    </div>
    <span
      style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 19,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      <span style={{ color: C.blue }}>wav</span>
      <span style={{ color: C.gold }}>under</span>
    </span>
  </div>
);

const Chip = ({ label, value, color, icon }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      background: `${color}16`,
      border: `1px solid ${color}38`,
      borderRadius: 10,
      padding: "7px 13px",
    }}
  >
    {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
    <span style={{ color: C.textSub, fontSize: 11 }}>{label}</span>
    <span style={{ color, fontWeight: 700, fontSize: 13 }}>{value}</span>
  </div>
);

const StatBar = ({ label, value, max, color, unit }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 7,
        }}
      >
        <span style={{ color: C.textSub, fontSize: 12 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontSize: 13 }}>
          {value} {unit}
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: `${color}1A`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${color}70, ${color})`,
            boxShadow: `0 0 10px ${color}88`,
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
};

const HomeScreen = ({ onNav }) => (
  <div style={{ padding: "0 18px" }}>
    <div
      style={{
        background: `linear-gradient(135deg, #1A3A70 0%, #0F2A58 60%, #0A1E44 100%)`,
        border: `1px solid ${C.border}`,
        borderRadius: 22,
        padding: "20px 20px 18px",
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold}28, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blue}22, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <p
        style={{
          color: C.textSub,
          fontSize: 11,
          margin: "0 0 3px",
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        Nível sustentável
      </p>
      <p
        style={{
          color: C.teal,
          fontSize: 26,
          fontWeight: 800,
          margin: "0 0 14px",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Bom! 🌱
      </p>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        <Chip icon="💧" label="Água poupada" value="69 L" color={C.blue} />
        <Chip
          icon="⚡"
          label="Energia poupada"
          value="4.2 kWh"
          color={C.gold}
        />
      </div>
    </div>

    <p
      style={{
        color: C.textMuted,
        fontSize: 11,
        margin: "0 0 9px",
        textTransform: "uppercase",
        letterSpacing: 1.2,
      }}
    >
      Esta semana
    </p>
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <StatBar
        label="Consumo de Água"
        value={420}
        max={700}
        color={C.blue}
        unit="L"
      />
      <StatBar
        label="Consumo de Energia"
        value={6.3}
        max={15}
        color={C.gold}
        unit="kWh"
      />
    </div>
  </div>
);

const AguaScreen = () => {
  const [banho, setBanho] = useState(13);
  const litros = Math.round(banho * 7);
  const economia =
    banho > 10
      ? `Reduzir ${banho - 10} min economiza ${(banho - 10) * 7} L`
      : "Ótimo tempo de banho! 🌟";
  return (
    <div style={{ padding: "0 18px" }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 14,
        }}
      >
        <p
          style={{
            color: C.textSub,
            fontSize: 11,
            margin: "0 0 18px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Tempo de banho
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <button
            onClick={() => setBanho(Math.max(1, banho - 1))}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.textSub,
              fontSize: 22,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.blue)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            −
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span
              style={{
                color: C.blue,
                fontSize: 52,
                fontWeight: 800,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {banho}
            </span>
            <span style={{ color: C.textSub, fontSize: 17 }}> min</span>
          </div>
          <button
            onClick={() => setBanho(Math.min(60, banho + 1))}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: `1.5px solid ${C.blue}`,
              background: `${C.blue}22`,
              color: C.blue,
              fontSize: 22,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `${C.blue}44`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `${C.blue}22`)
            }
          >
            +
          </button>
        </div>
        <input
          type="range"
          min={1}
          max={60}
          value={banho}
          onChange={(e) => setBanho(+e.target.value)}
          style={{ width: "100%", accentColor: C.blue }}
        />
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: C.textSub, fontSize: 11, margin: "0 0 5px" }}>
              Você gastou
            </p>
            <p
              style={{
                color: C.blue,
                fontSize: 34,
                fontWeight: 800,
                margin: 0,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              💧 {litros} L
            </p>
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `conic-gradient(${C.blue} ${Math.min((litros / 200) * 360, 360)}deg, ${C.surface} 0)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 16px ${C.blue}44`,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: C.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: C.blue, fontSize: 11, fontWeight: 800 }}>
                {Math.min(Math.round((litros / 200) * 100), 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: banho > 10 ? `${C.gold}14` : `${C.teal}14`,
          border: `1px solid ${banho > 10 ? C.gold : C.teal}44`,
          borderRadius: 16,
          padding: 16,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 22 }}>{banho > 10 ? "💡" : "✅"}</span>
        <p
          style={{
            color: banho > 10 ? C.gold : C.teal,
            margin: 0,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {economia}
        </p>
      </div>
    </div>
  );
};

const EnergiaScreen = () => {
  const [aparelho, setAparelho] = useState("Chuveiro");
  const [potencia, setPotencia] = useState(5500);
  const [tempo, setTempo] = useState(15);
  const kWh = ((potencia * tempo) / 60 / 1000).toFixed(2);
  const custo = (parseFloat(kWh) * 0.87).toFixed(2);
  const aparelhos = [
    { nome: "Chuveiro", w: 5500 },
    { nome: "Ar-condicionado", w: 1500 },
    { nome: "Geladeira", w: 400 },
    { nome: 'TV 55"', w: 150 },
    { nome: "Computador", w: 300 },
  ];
  return (
    <div style={{ padding: "0 18px" }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 14,
        }}
      >
        <p
          style={{
            color: C.textSub,
            fontSize: 11,
            margin: "0 0 12px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Aparelho
        </p>
        <div
          style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {aparelhos.map((a) => (
            <button
              key={a.nome}
              onClick={() => {
                setAparelho(a.nome);
                setPotencia(a.w);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                cursor: "pointer",
                background: aparelho === a.nome ? `${C.gold}28` : C.surface,
                border: `1px solid ${aparelho === a.nome ? C.gold : C.border}`,
                color: aparelho === a.nome ? C.gold : C.textSub,
                transition: "all 0.18s",
                fontWeight: aparelho === a.nome ? 700 : 400,
              }}
            >
              {a.nome}
            </button>
          ))}
        </div>
        <p style={{ color: C.textSub, fontSize: 11, margin: "0 0 6px" }}>
          POTÊNCIA:{" "}
          <span style={{ color: C.gold, fontWeight: 700 }}>{potencia}W</span>
        </p>
        <input
          type="range"
          min={50}
          max={10000}
          value={potencia}
          onChange={(e) => setPotencia(+e.target.value)}
          style={{ width: "100%", accentColor: C.gold, marginBottom: 18 }}
        />
        <p style={{ color: C.textSub, fontSize: 11, margin: "0 0 6px" }}>
          TEMPO DE USO:{" "}
          <span style={{ color: C.gold, fontWeight: 700 }}>{tempo} min</span>
        </p>
        <input
          type="range"
          min={1}
          max={480}
          value={tempo}
          onChange={(e) => setTempo(+e.target.value)}
          style={{ width: "100%", accentColor: C.gold }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Consumo estimado", value: `${kWh} kWh`, color: C.gold },
          { label: "Custo aproximado", value: `R$ ${custo}`, color: C.teal },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: `${color}12`,
              border: `1px solid ${color}38`,
              borderRadius: 18,
              padding: 18,
              textAlign: "center",
            }}
          >
            <p style={{ color: C.textSub, fontSize: 11, margin: "0 0 7px" }}>
              {label}
            </p>
            <p
              style={{
                color,
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DicasScreen = () => {
  const dicas = [
    {
      icon: "🚿",
      title: "Banhos curtos",
      desc: "Banhos de até 5 min economizam até 60% da água",
      cor: C.blue,
    },
    {
      icon: "🔌",
      title: "Tirar da tomada",
      desc: "Desligar aparelhos em stand-by reduz até 12% no consumo",
      cor: C.gold,
    },
    {
      icon: "💡",
      title: "Lâmpadas LED",
      desc: "Consomem até 80% menos energia que as incandescentes",
      cor: C.teal,
    },
    {
      icon: "🌡️",
      title: "Ar-condicionado",
      desc: "Manter a 23°C reduz em 10% o consumo elétrico",
      cor: C.violet,
    },
    {
      icon: "🫙",
      title: "Reúso de água",
      desc: "Água do enxágue pode ser reaproveitada para limpeza",
      cor: C.blue,
    },
  ];
  return (
    <div
      style={{
        padding: "0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 11,
      }}
    >
      {dicas.map((d, i) => (
        <div
          key={i}
          style={{
            background: `linear-gradient(135deg, ${d.cor}14, ${d.cor}06)`,
            border: `1px solid ${d.cor}35`,
            borderRadius: 18,
            padding: 16,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(5px)";
            e.currentTarget.style.boxShadow = `0 6px 20px ${d.cor}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              flexShrink: 0,
              background: `${d.cor}20`,
              border: `1px solid ${d.cor}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {d.icon}
          </div>
          <div>
            <p
              style={{
                color: d.cor,
                fontWeight: 700,
                margin: "0 0 4px",
                fontSize: 14,
              }}
            >
              {d.title}
            </p>
            <p
              style={{
                color: C.textSub,
                fontSize: 13,
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {d.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const RelatoriosScreen = () => {
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const agua = [60, 75, 55, 80, 65, 40, 45];
  const energia = [0.9, 1.1, 0.8, 1.3, 1.0, 0.7, 0.5];
  const maxA = Math.max(...agua),
    maxE = Math.max(...energia);
  return (
    <div style={{ padding: "0 18px" }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 14,
        }}
      >
        <p
          style={{
            color: C.textSub,
            fontSize: 11,
            margin: "0 0 16px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Consumo semanal
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 5,
            height: 90,
          }}
        >
          {dias.map((d, i) => (
            <div
              key={d}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  height: 72,
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "55%",
                    height: `${(agua[i] / maxA) * 58}px`,
                    background: `linear-gradient(180deg, ${C.blue}, ${C.blue}88)`,
                    borderRadius: "3px 3px 0 0",
                    boxShadow: `0 0 6px ${C.blue}55`,
                  }}
                />
                <div
                  style={{
                    width: "55%",
                    height: `${(energia[i] / maxE) * 58}px`,
                    background: `linear-gradient(0deg, ${C.gold}, ${C.gold}88)`,
                    borderRadius: "0 0 3px 3px",
                    boxShadow: `0 0 6px ${C.gold}55`,
                  }}
                />
              </div>
              <span style={{ color: C.textMuted, fontSize: 9 }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[
            { label: "Água (L)", color: C.blue },
            { label: "Energia (kWh)", color: C.gold },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: color,
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
              <span style={{ color: C.textSub, fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <p
          style={{
            color: C.textSub,
            fontSize: 11,
            margin: "0 0 16px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Distribuição do consumo
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 88, height: 88, flexShrink: 0 }}>
            <svg
              viewBox="0 0 36 36"
              style={{ transform: "rotate(-90deg)", width: 88, height: 88 }}
            >
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={`${C.blue}33`}
                strokeWidth="4.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={C.blue}
                strokeWidth="4.5"
                strokeDasharray="45 55"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={C.gold}
                strokeWidth="4.5"
                strokeDasharray="35 65"
                strokeDashoffset="-45"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={C.violet}
                strokeWidth="4.5"
                strokeDasharray="20 80"
                strokeDashoffset="-80"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            {[
              { label: "Água", pct: "45%", color: C.blue },
              { label: "Energia", pct: "35%", color: C.gold },
              { label: "Outros", pct: "20%", color: C.violet },
            ].map(({ label, pct, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 9,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 5px ${color}`,
                    }}
                  />
                  <span style={{ color: C.textSub, fontSize: 13 }}>
                    {label}
                  </span>
                </div>
                <span style={{ color, fontWeight: 700, fontSize: 14 }}>
                  {pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PerfilScreen = () => (
  <div style={{ padding: "0 18px" }}>
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          margin: "0 auto 14px",
          background: `linear-gradient(135deg, #1A4494, ${C.blueSoft})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          boxShadow: `0 0 28px ${C.blue}44, 0 0 0 3px ${C.blue}22`,
        }}
      >
        👤
      </div>
      <p
        style={{
          color: C.text,
          fontWeight: 700,
          fontSize: 19,
          margin: "0 0 3px",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Cristiano Silva
      </p>
      <p style={{ color: C.textSub, fontSize: 13, margin: 0 }}>
        cristiano@email.com
      </p>
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <Chip icon="💧" label="Água poupada" value="69 L" color={C.blue} />
      <Chip icon="⚡" label="Energia poupada" value="4.2 kWh" color={C.gold} />
    </div>
    <div
      style={{
        background: `${C.teal}12`,
        border: `1px solid ${C.teal}38`,
        borderRadius: 18,
        padding: 18,
        display: "flex",
        gap: 14,
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <span style={{ fontSize: 30 }}>🌱</span>
      <div>
        <p
          style={{
            color: C.teal,
            fontWeight: 700,
            margin: "0 0 3px",
            fontSize: 14,
          }}
        >
          Nível: Iniciante Sustentável
        </p>
        <p style={{ color: C.textSub, fontSize: 12, margin: 0 }}>
          Continue assim para alcançar Pro!
        </p>
      </div>
    </div>
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {["Notificações", "Privacidade", "Ajuda"].map((item, i) => (
        <div
          key={item}
          style={{
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.cardHover)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ color: C.text, fontSize: 14 }}>{item}</span>
          <span style={{ color: C.textMuted, fontSize: 16 }}>›</span>
        </div>
      ))}
    </div>
    <button
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${C.danger}40`,
        background: `${C.danger}14`,
        color: C.danger,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${C.danger}28`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${C.danger}14`)}
    >
      Sair da conta
    </button>
  </div>
);

const FAB = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", zIndex: 200 }}>
      {open &&
        fabItems.map((item, i) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: `${42 + i * 56}px`,
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: 9,
              animation: `fabIn 0.24s ${i * 0.055}s both`,
            }}
          >
            <div
              style={{
                background: `${C.surface}F5`,
                border: `1px solid ${C.border}`,
                borderRadius: 11,
                padding: "5px 13px",
                color: item.color,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 6px 20px #00000088",
                backdropFilter: "blur(10px)",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </div>
            <button
              onClick={() => {
                onSelect(item.id);
                setOpen(false);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: `2px solid ${item.color}55`,
                background: `${item.color}22`,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px ${item.color}44`,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${item.color}44`;
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${item.color}22`;
                e.currentTarget.style.transform = "";
              }}
            >
              {item.icon}
            </button>
          </div>
        ))}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: -1 }}
        />
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "none",
          background: open
            ? `linear-gradient(135deg, ${C.danger}, #C0003A)`
            : `linear-gradient(135deg, ${C.gold}, #B07800)`,
          color: "#fff",
          fontSize: 22,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: open
            ? `0 2px 14px ${C.danger}88`
            : `0 2px 14px ${C.gold}77`,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "all 0.3s cubic-bezier(0.68,-0.6,0.32,1.6)",
        }}
      >
        +
      </button>
    </div>
  );
};

const BottomNav = ({ active, onNav }) => {
  const items = [
    { id: "home", label: "Início" },
    { id: "relatorios", label: "Relatórios" },
    { id: "perfil", label: "Perfil" },
  ];
  const icons = { home: "⊞", relatorios: "◫", perfil: "◯" };
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        background: `${C.surface}F4`,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${C.border}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 22px",
              borderRadius: 14,
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                fontSize: 20,
                opacity: isActive ? 1 : 0.38,
                color: isActive ? C.gold : C.text,
              }}
            >
              {icons[item.id]}
            </span>
            <span
              style={{
                fontSize: 10,
                color: isActive ? C.gold : C.textMuted,
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {item.label}
            </span>
            {isActive && (
              <div
                style={{
                  width: 16,
                  height: 3,
                  borderRadius: 2,
                  background: C.gold,
                  boxShadow: `0 0 8px ${C.gold}`,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const screenComponents = {
  home: HomeScreen,
  agua: AguaScreen,
  energia: EnergiaScreen,
  dicas: DicasScreen,
  relatorios: RelatoriosScreen,
  perfil: PerfilScreen,
};
const screenTitles = {
  home: null,
  agua: "💧 Consumo de Água",
  energia: "⚡ Consumo de Energia",
  dicas: "🌿 Dicas Sustentáveis",
  relatorios: "📊 Relatórios",
  perfil: "👤 Perfil",
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const Screen = screenComponents[screen] || HomeScreen;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #050E20; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
        @keyframes fabIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E3F7A; border-radius: 4px; }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 0%, #0F2A5A 0%, #050E20 65%)",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <div
          style={{
            width: 375,
            height: 780,
            background: C.bg,
            borderRadius: 42,
            overflow: "hidden",
            position: "relative",
            boxShadow: `0 40px 100px #00000099, 0 0 0 1px ${C.border}88, inset 0 1px 0 ${C.blue}18`,
          }}
        >
          {/* Status bar */}
          <div
            style={{
              height: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 22px",
              background: `linear-gradient(180deg, ${C.surface}CC, transparent)`,
            }}
          >
            <span style={{ color: C.textSub, fontSize: 12, fontWeight: 600 }}>
              9:41
            </span>
            <Logo />
            <FAB onSelect={setScreen} />
          </div>

          {/* Linha dourada decorativa */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`,
            }}
          />

          {/* Header interno */}
          {screenTitles[screen] && (
            <div
              style={{
                padding: "13px 18px 9px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() => setScreen("home")}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  color: C.textSub,
                  fontSize: 17,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.blue;
                  e.currentTarget.style.color = C.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.textSub;
                }}
              >
                ←
              </button>
              <span style={{ color: C.text, fontWeight: 700, fontSize: 17 }}>
                {screenTitles[screen]}
              </span>
            </div>
          )}

          {screen === "home" && (
            <div style={{ padding: "13px 18px 8px" }}>
              <p style={{ color: C.textSub, fontSize: 13, margin: "0 0 1px" }}>
                Olá, Cristiano 👋
              </p>
              <p
                style={{
                  color: C.text,
                  fontSize: 23,
                  fontWeight: 800,
                  margin: 0,
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Seu painel
              </p>
            </div>
          )}

          <div
            style={{
              overflowY: "auto",
              height: "calc(100% - 47px - 70px - 54px)",
              paddingBottom: 8,
            }}
          >
            <Screen onNav={setScreen} />
          </div>

          <BottomNav active={screen} onNav={setScreen} />
        </div>
      </div>
    </>
  );
}
