import { useState, useEffect } from "react";

// ============================================================
// ESTILOS GLOBALES
// ============================================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --sand: #f5efe6;
    --cream: #fdfaf5;
    --bark: #3d2b1f;
    --moss: #4a5c3f;
    --sky: #6b8fa3;
    --gold: #c8a96e;
    --fog: #e8dfd0;
    --shadow: rgba(61, 43, 31, 0.12);
  }

  html, body {
    height: 100%;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--bark);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: none; }
  }

  @keyframes drift {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

// ============================================================
// INYECTAR ESTILOS
// ============================================================
const StyleInjector = () => {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = globalStyles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
};

// ============================================================
// ÍCONOS SVG
// ============================================================
const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const MountainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ============================================================
// PÁGINA DE LOGIN
// ============================================================
const LoginPage = ({ onLogin, onGoRegister }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ── Llamada real al backend ──────────────────────────────
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // El backend devuelve { error: "mensaje" } con status 401
        setError(data.error || "Error al iniciar sesión.");
      } else {
        // data = { username: "...", rol: "ADMIN" | "CLIENTE" }
        onLogin({ username: data.username, rol: data.rol });
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Panel izquierdo — ilustración */}
      <div style={{ width: "52%", background: "var(--bark)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "48px" }}>
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(200,169,110,0.08)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(74,92,63,0.15)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "20%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(107,143,163,0.1)" }} />

        {/* Ilustración cabaña SVG */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-65%)", animation: "drift 6s ease-in-out infinite" }}>
          <svg width="260" height="220" viewBox="0 0 260 220" fill="none">
            <path d="M0 180 L80 60 L160 180 Z" fill="rgba(74,92,63,0.25)" />
            <path d="M60 180 L160 40 L260 180 Z" fill="rgba(74,92,63,0.18)" />
            <rect x="70" y="130" width="120" height="70" rx="2" fill="rgba(245,239,230,0.12)" />
            <path d="M55 130 L130 75 L205 130 Z" fill="rgba(200,169,110,0.45)" />
            <rect x="112" y="160" width="36" height="40" rx="3" fill="rgba(61,43,31,0.6)" />
            <rect x="78" y="142" width="28" height="22" rx="2" fill="rgba(107,143,163,0.5)" />
            <rect x="154" y="142" width="28" height="22" rx="2" fill="rgba(107,143,163,0.5)" />
            <rect x="150" y="85" width="14" height="28" rx="1" fill="rgba(200,169,110,0.55)" />
            <circle cx="157" cy="78" r="5" fill="rgba(245,239,230,0.2)" />
            <circle cx="162" cy="68" r="4" fill="rgba(245,239,230,0.12)" />
            <path d="M30 180 L46 140 L62 180 Z" fill="rgba(74,92,63,0.4)" />
            <path d="M198 180 L212 148 L226 180 Z" fill="rgba(74,92,63,0.4)" />
            <path d="M0 195 Q65 180 130 190 Q195 200 260 185 L260 220 L0 220 Z" fill="rgba(74,92,63,0.2)" />
            <circle cx="40" cy="40" r="2" fill="rgba(200,169,110,0.6)" />
            <circle cx="200" cy="30" r="1.5" fill="rgba(200,169,110,0.5)" />
            <circle cx="230" cy="60" r="1" fill="rgba(200,169,110,0.4)" />
            <circle cx="20" cy="90" r="1.5" fill="rgba(200,169,110,0.4)" />
          </svg>
        </div>

        {/* Texto inferior */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "12px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <LeafIcon /> Reservas Mar Azul
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", lineHeight: 1.2, color: "var(--cream)", fontWeight: 300 }}>
            Donde la naturaleza<br /><em>te abraza</em>
          </p>
          <p style={{ marginTop: "16px", color: "rgba(245,239,230,0.55)", fontSize: "14px", lineHeight: 1.7, maxWidth: "340px" }}>
            Cabañas de montaña con vistas únicas. Descansa, desconéctate y disfruta.
          </p>
          <div style={{ display: "flex", gap: "4px", marginTop: "20px", color: "var(--gold)" }}>
            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
            <span style={{ color: "rgba(245,239,230,0.5)", fontSize: "13px", marginLeft: "8px" }}>4.9 · 230 reseñas</span>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 72px", animation: "fadeUp 0.7s ease both" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "52px" }}>
          <div style={{ width: "36px", height: "36px", background: "var(--bark)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
            <MountainIcon />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "var(--bark)", letterSpacing: "0.02em" }}>Mar Azul</span>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 400, color: "var(--bark)", lineHeight: 1.1, marginBottom: "8px" }}>Bienvenido</h1>
        <p style={{ color: "#8a7060", fontSize: "15px", marginBottom: "40px" }}>Inicia sesión para acceder a tu cuenta</p>

        {/* Campo username */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "8px" }}>Usuario</label>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focused === "username" ? "var(--moss)" : "#b0a090", transition: "color 0.2s" }}>
              <UserIcon />
            </div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              placeholder="tu_usuario"
              style={{ width: "100%", padding: "14px 16px 14px 44px", border: `1.5px solid ${focused === "username" ? "var(--moss)" : "var(--fog)"}`, borderRadius: "10px", fontSize: "15px", outline: "none", background: "white", color: "var(--bark)", transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

        {/* Campo password */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "8px" }}>Contraseña</label>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focused === "password" ? "var(--moss)" : "#b0a090", transition: "color 0.2s" }}>
              <LockIcon />
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={{ width: "100%", padding: "14px 16px 14px 44px", border: `1.5px solid ${focused === "password" ? "var(--moss)" : "var(--fog)"}`, borderRadius: "10px", fontSize: "15px", outline: "none", background: "white", color: "var(--bark)", transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "15px", background: loading ? "var(--fog)" : "var(--bark)", color: loading ? "#8a7060" : "var(--cream)", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: "0.03em", fontFamily: "'DM Sans', sans-serif" }}
        >
          {loading ? "Verificando..." : "Iniciar sesión"}
        </button>

        {/* Separador */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--fog)" }} />
          <span style={{ color: "#b0a090", fontSize: "13px" }}>¿No tienes cuenta?</span>
          <div style={{ flex: 1, height: "1px", background: "var(--fog)" }} />
        </div>

        <button
          onClick={onGoRegister}
          style={{ width: "100%", padding: "14px", background: "transparent", color: "var(--bark)", border: "1.5px solid var(--fog)", borderRadius: "10px", fontSize: "15px", cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--moss)"; e.currentTarget.style.color = "var(--moss)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--fog)"; e.currentTarget.style.color = "var(--bark)"; }}
        >
          Crear cuenta
        </button>

        <p style={{ textAlign: "center", marginTop: "32px", color: "#c0b0a0", fontSize: "12px" }}>
          Sistema de gestión · Mar Azul © 2025
        </p>
      </div>
    </div>
  );
};

// ============================================================
// PÁGINA HOME / DASHBOARD
// ============================================================
const HomePage = ({ user, onLogout }) => {
  const esAdmin = user?.rol === "ADMIN";

  const cabanas = [
    { id: 1, zona: "Zona Alta",    categoria: "Premium",  capacidad: 6, precio: "$320/noche", amenidades: ["Vista al lago", "Jacuzzi", "Chimenea"] },
    { id: 2, zona: "Zona Bosque",  categoria: "Estándar", capacidad: 4, precio: "$180/noche", amenidades: ["Sendero privado", "Fogón", "Parrilla"] },
    { id: 3, zona: "Zona Río",     categoria: "Premium",  capacidad: 8, precio: "$450/noche", amenidades: ["Acceso al río", "Canotaje", "Deck"] },
    { id: 4, zona: "Zona Mirador", categoria: "Suite",    capacidad: 2, precio: "$520/noche", amenidades: ["Vista 360°", "Desayuno", "Spa"] },
  ];

  const stats = esAdmin
    ? [
        { label: "Cabañas activas",   value: "12",     color: "var(--moss)" },
        { label: "Reservas este mes", value: "47",     color: "var(--sky)" },
        { label: "Clientes totales",  value: "284",    color: "var(--gold)" },
        { label: "Ingresos (COP)",    value: "$18.4M", color: "var(--bark)" },
      ]
    : [
        { label: "Mis reservas",      value: "3",      color: "var(--moss)" },
        { label: "Próximo check-in",  value: "12 Jun", color: "var(--sky)" },
        { label: "Puntos fidelidad",  value: "840",    color: "var(--gold)" },
        { label: "Noches totales",    value: "14",     color: "var(--bark)" },
      ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navbar */}
      <header style={{ background: "white", borderBottom: "1px solid var(--fog)", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--bark)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
            <MountainIcon />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "var(--bark)" }}>Mar Azul</span>
          <span style={{ marginLeft: "8px", padding: "2px 10px", background: "var(--fog)", borderRadius: "20px", fontSize: "11px", fontWeight: 500, color: "#8a7060", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {esAdmin ? "Admin" : "Cliente"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 500 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: "14px", color: "var(--bark)", fontWeight: 500 }}>{user?.username}</span>
          </div>
          <button
            onClick={onLogout}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "transparent", border: "1px solid var(--fog)", borderRadius: "8px", color: "#8a7060", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--fog)"; e.currentTarget.style.color = "#8a7060"; }}
          >
            <LogoutIcon /> Salir
          </button>
        </div>
      </header>

      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg, var(--bark) 0%, #5a3d2b 60%, var(--moss) 100%)", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(200,169,110,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(107,143,163,0.08)" }} />
        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease both" }}>
          <p style={{ color: "var(--gold)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>
            {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--cream)", fontSize: "38px", fontWeight: 300, lineHeight: 1.2 }}>
            {esAdmin ? "Panel de administración" : `Hola de nuevo, ${user?.username}`}
          </h1>
          <p style={{ color: "rgba(245,239,230,0.6)", marginTop: "8px", fontSize: "15px" }}>
            {esAdmin ? "Gestiona cabañas, reservas y clientes." : "Tu próxima aventura en la montaña te espera."}
          </p>
        </div>
      </div>

      {/* Main content */}
      <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid var(--fog)", animation: `fadeUp 0.5s ease ${i * 0.08}s both`, boxShadow: "0 2px 8px var(--shadow)" }}>
              <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#b0a090", fontWeight: 500, marginBottom: "8px" }}>{s.label}</p>
              <p style={{ fontSize: "28px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Cabañas */}
        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, color: "var(--bark)" }}>
            {esAdmin ? "Gestión de cabañas" : "Cabañas disponibles"}
          </h2>
          {esAdmin && (
            <button style={{ padding: "8px 18px", background: "var(--bark)", color: "var(--cream)", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              + Nueva cabaña
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {cabanas.map((c, i) => <CabanaCard key={c.id} cabana={c} esAdmin={esAdmin} index={i} />)}
        </div>

        {/* Acciones rápidas (solo cliente) */}
        {!esAdmin && (
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, color: "var(--bark)", marginBottom: "16px" }}>
              Acciones rápidas
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              {["Nueva reserva", "Mis reservas", "Historial", "Mi perfil"].map((label, i) => (
                <button
                  key={i}
                  style={{ padding: "10px 20px", background: "white", color: "var(--bark)", border: "1.5px solid var(--fog)", borderRadius: "10px", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--moss)"; e.currentTarget.style.color = "var(--moss)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--fog)"; e.currentTarget.style.color = "var(--bark)"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================================
// TARJETA DE CABAÑA
// ============================================================
const CabanaCard = ({ cabana, esAdmin, index }) => {
  const [hovered, setHovered] = useState(false);

  const catColor = {
    "Premium":  { bg: "#fef3c7", text: "#92400e" },
    "Estándar": { bg: "#f0fdf4", text: "#166534" },
    "Suite":    { bg: "#faf5ff", text: "#6b21a8" },
  }[cabana.categoria] || { bg: "var(--fog)", text: "var(--bark)" };

  return (
    <div
      style={{ background: "white", borderRadius: "14px", border: `1.5px solid ${hovered ? "var(--moss)" : "var(--fog)"}`, overflow: "hidden", transition: "all 0.25s", transform: hovered ? "translateY(-3px)" : "none", boxShadow: hovered ? "0 8px 24px var(--shadow)" : "0 2px 8px var(--shadow)", animation: `fadeUp 0.5s ease ${index * 0.1}s both`, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: "8px", background: "linear-gradient(90deg, var(--moss), var(--sky))" }} />
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", background: catColor.bg, color: catColor.text, fontWeight: 500, letterSpacing: "0.05em" }}>
              {cabana.categoria}
            </span>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, color: "var(--bark)", marginTop: "8px" }}>
              {cabana.zona}
            </h3>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "var(--moss)" }}>{cabana.precio}</p>
        </div>

        <p style={{ fontSize: "13px", color: "#8a7060", marginBottom: "14px" }}>👥 Hasta {cabana.capacidad} personas</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {cabana.amenidades.map((a, i) => (
            <span key={i} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: "var(--fog)", color: "#6a5040" }}>{a}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {esAdmin ? (
            <>
              <button style={{ flex: 1, padding: "9px", background: "var(--bark)", color: "var(--cream)", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Editar</button>
              <button style={{ padding: "9px 14px", background: "transparent", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Eliminar</button>
            </>
          ) : (
            <button style={{ flex: 1, padding: "10px", background: "var(--moss)", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Reservar ahora</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PÁGINA DE REGISTRO
// ============================================================
const RegistroPage = ({ onBack }) => {
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", telefono: "",
    pais: "", username: "", password: "", fechaNacimiento: ""
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    // Validación básica en el frontend
    if (!form.nombre || !form.apellido || !form.email || !form.username || !form.password || !form.fechaNacimiento) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ── Llamada real al backend ──────────────────────────────
      const response = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          telefono: form.telefono || "000",
          pais: form.pais || "Colombia",
          username: form.username,
          password: form.password,
          fechaNacimiento: form.fechaNacimiento, // formato YYYY-MM-DD
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la cuenta.");
      } else {
        setOk(true);
        setTimeout(() => { setOk(false); onBack(); }, 2000);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "nombre",          label: "Nombre",              placeholder: "María",                    required: true },
    { name: "apellido",        label: "Apellido",            placeholder: "González",                 required: true },
    { name: "email",           label: "Email",               placeholder: "maria@email.com",          required: true },
    { name: "telefono",        label: "Teléfono",            placeholder: "+57 310 000 0000" },
    { name: "pais",            label: "País",                placeholder: "Colombia" },
    { name: "fechaNacimiento", label: "Fecha de nacimiento", placeholder: "",    type: "date",        required: true },
    { name: "username",        label: "Usuario",             placeholder: "maria_g",                  required: true },
    { name: "password",        label: "Contraseña",          placeholder: "Mínimo 8 caracteres", type: "password", required: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "480px", animation: "fadeUp 0.6s ease both" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#8a7060", fontSize: "14px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}
        >
          ← Volver al inicio
        </button>

        <div style={{ background: "white", borderRadius: "16px", padding: "40px", border: "1px solid var(--fog)", boxShadow: "0 4px 20px var(--shadow)" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, color: "var(--bark)", marginBottom: "6px" }}>Crear cuenta</h1>
          <p style={{ color: "#8a7060", fontSize: "14px", marginBottom: "28px" }}>Únete a la comunidad Mar Azul</p>

          {/* Mensaje de éxito */}
          {ok && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px", textAlign: "center" }}>
              ¡Registro exitoso! Redirigiendo...
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {fields.map(f => (
              <div key={f.name} style={{ gridColumn: ["email", "fechaNacimiento", "username", "password"].includes(f.name) ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "6px" }}>
                  {f.label}{f.required && <span style={{ color: "#dc2626" }}> *</span>}
                </label>
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={e => e.target.style.borderColor = "var(--moss)"}
                  onBlur={e => e.target.style.borderColor = "var(--fog)"}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "24px", width: "100%", padding: "14px", background: loading ? "var(--fog)" : "var(--bark)", color: loading ? "#8a7060" : "var(--cream)", border: "none", borderRadius: "10px", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// APP PRINCIPAL — Router simple
// ============================================================
export default function App() {
  const [page, setPage] = useState("login"); // "login" | "home" | "registro"
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  return (
    <>
      <StyleInjector />
      {page === "login"    && <LoginPage    onLogin={handleLogin} onGoRegister={() => setPage("registro")} />}
      {page === "home"     && <HomePage     user={user} onLogout={handleLogout} />}
      {page === "registro" && <RegistroPage onBack={() => setPage("login")} />}
    </>
  );
}
