import { useState, useEffect } from "react";

// ============================================================
// ESTILOS GLOBALES
// ============================================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Tema claro (por defecto) ── */
  :root {
    --cream: #fdfaf5; --bark: #3d2b1f; --moss: #4a5c3f;
    --sky: #6b8fa3; --gold: #c8a96e; --fog: #e8dfd0;
    --shadow: rgba(61,43,31,0.12);
    --surface: #ffffff; --surface2: #f5f0e8; --text-muted: #8a7060;
    --input-bg: #ffffff; --input-border: #e8dfd0;
  }

  /* ── Tema oscuro ── */
  [data-theme="dark"] {
    --cream: #1a1410; --bark: #f0e6d8; --moss: #7aad6a;
    --sky: #8ab4c8; --gold: #d4b87a; --fog: #2e2420;
    --shadow: rgba(0,0,0,0.4);
    --surface: #241c18; --surface2: #2e2420; --text-muted: #a09080;
    --input-bg: #2e2420; --input-border: #3e3028;
  }

  /* ── Tema automático (sigue preferencia del SO) ── */
  [data-theme="auto"] {
    --cream: #fdfaf5; --bark: #3d2b1f; --moss: #4a5c3f;
    --sky: #6b8fa3; --gold: #c8a96e; --fog: #e8dfd0;
    --shadow: rgba(61,43,31,0.12);
    --surface: #ffffff; --surface2: #f5f0e8; --text-muted: #8a7060;
    --input-bg: #ffffff; --input-border: #e8dfd0;
  }
  @media (prefers-color-scheme: dark) {
    [data-theme="auto"] {
      --cream: #1a1410; --bark: #f0e6d8; --moss: #7aad6a;
      --sky: #8ab4c8; --gold: #d4b87a; --fog: #2e2420;
      --shadow: rgba(0,0,0,0.4);
      --surface: #241c18; --surface2: #2e2420; --text-muted: #a09080;
      --input-bg: #2e2420; --input-border: #3e3028;
    }
  }

  html, body { height:100%; font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--bark); transition: background .3s, color .3s; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  @keyframes drift  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes shake  { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-7px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-5px)} 60%{transform:translateX(5px)} 75%{transform:translateX(-3px)} 90%{transform:translateX(3px)} }
  .field-error { border-color: #ef4444 !important; background: #fff5f5 !important; }
  .field-shake { animation: shake 0.45s ease both; }
  .modal-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:999;
    display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease;padding:20px;
  }
  .modal-box {
    background:var(--surface);border-radius:16px;padding:36px;width:100%;max-width:520px;
    box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:fadeUp .3s ease;max-height:90vh;overflow-y:auto;
    color:var(--bark);
  }
  .tab-btn { padding:8px 20px;border:none;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text-muted);border-bottom:2px solid transparent;transition:all .2s; }
  .tab-btn.active { color:var(--bark);border-bottom-color:var(--bark);font-weight:500; }
  .cabana-img { width:100%;height:180px;object-fit:cover;background:var(--fog); }
  .cabana-img-placeholder { width:100%;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--fog),var(--surface2));color:var(--text-muted);gap:8px; }
  input[type=range] { -webkit-appearance:none;height:4px;background:var(--fog);border-radius:2px;outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--bark);cursor:pointer; }
  /* Ojo contraseña */
  .pwd-toggle { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;display:flex;align-items:center;transition:color .2s; }
  .pwd-toggle:hover { color:var(--bark); }
`;

const StyleInjector = () => {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = globalStyles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
};

// ── API helper ─────────────────────────────────────────────
const api = async (url, opts = {}) => {
  let res;
  try {
    res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  } catch {
    throw new Error("Nuestra página no está disponible en estos momentos. Intenta más tarde.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Errores de servidor/proxy = backend caído
    if ([502, 503, 504, 500].includes(res.status)) {
      throw new Error("Nuestra página no está disponible en estos momentos. Intenta más tarde.");
    }
    throw new Error(data.error || data.mensaje || `Error ${res.status}`);
  }
  return data;
};

// ── Colores categoría ──────────────────────────────────────
const catColor = c => ({ Premium: { bg: "#fef3c7", text: "#92400e" }, Estándar: { bg: "#f0fdf4", text: "#166534" }, Suite: { bg: "#faf5ff", text: "#6b21a8" } }[c] || { bg: "var(--fog)", text: "var(--bark)" });

// ── Foto por defecto según zona/categoría ─────────────────
const FOTOS = {
  "Zona Alta": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80",
  "Zona Bosque": "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80",
  "Zona Río": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  "Zona Mirador": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  "Premium": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  "Suite": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
  default: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
};
const getFoto = (cab) => cab.fotoUrl || FOTOS[cab.zona] || FOTOS[cab.categoria] || FOTOS.default;

// ── Íconos SVG ─────────────────────────────────────────────
const MountainIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>;
const LeafIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>;
const LogoutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const EditIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const LockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const CalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const GameIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><circle cx="15" cy="11" r="1" fill="currentColor" /><circle cx="17" cy="13" r="1" fill="currentColor" /><path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" /></svg>;
const PersonIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

// ============================================================
// COMPONENTES BASE
// ============================================================
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const c = type === "ok"
    ? { bg: "#f0fdf4", border: "#86efac", text: "#166534" }
    : { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" };
  return (
    <div style={{
      position: "fixed", top: "24px", right: "24px", zIndex: 2000, background: c.bg,
      border: `1px solid ${c.border}`, color: c.text, borderRadius: "10px", padding: "14px 20px",
      fontSize: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", animation: "fadeIn .3s ease", maxWidth: "340px"
    }}>
      {msg}
    </div>
  );
};

const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal-box" style={{ maxWidth: wide ? "720px" : "520px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", fontWeight: 400, color: "var(--bark)" }}>{title}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8a7060", padding: "4px" }}><XIcon /></button>
      </div>
      {children}
    </div>
  </div>
);

const Btn = ({ children, variant = "primary", ...props }) => {
  const s = { primary: { background: "var(--bark)", color: "var(--cream)", border: "none" }, secondary: { background: "transparent", color: "var(--bark)", border: "1.5px solid var(--fog)" }, danger: { background: "transparent", color: "#dc2626", border: "1px solid #fca5a5" }, moss: { background: "var(--moss)", color: "white", border: "none" }, gold: { background: "var(--gold)", color: "var(--bark)", border: "none" } }[variant];
  return <button {...props} style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "14px", cursor: props.disabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, ...s, ...(props.style || {}) }}>{children}</button>;
};

const Field = ({ label, required, ...props }) => {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "6px" }}>
        {label}{required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input onFocus={() => setF(true)} onBlur={() => setF(false)} {...props}
        style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${f ? "var(--moss)" : "var(--fog)"}`, borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans',sans-serif", ...(props.style || {}) }} />
    </div>
  );
};

// ============================================================
// MODAL DETALLE CABAÑA (con foto grande, entretenimientos, reserva)
// ============================================================
const DetalleCabanaModal = ({ cabana, username, esAdmin, onClose, showToast, onReservado }) => {
  const [tab, setTab] = useState("info");
  const [resForm, setResForm] = useState({ numPersonas: "1", fechaInicio: "", cantDias: "1" });
  const [loading, setLoading] = useState(false);
  const cc = catColor(cabana.categoria);
  const ents = cabana.entretenimientos || [];
  const total = (cabana.precioNoche || 0) * Number(resForm.cantDias || 1);

  const handleReservar = async () => {
    if (!resForm.fechaInicio) { showToast("Selecciona una fecha de inicio.", "err"); return; }
    setLoading(true);
    try {
      await api("/api/contrata", { method: "POST", body: JSON.stringify({ cabanaId: cabana.id, username, numPersonas: resForm.numPersonas, fechaInicio: resForm.fechaInicio, cantDias: resForm.cantDias }) });
      showToast("¡Reserva creada con éxito!", "ok");
      onReservado();
    } catch (e) { showToast(e.message, "err"); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="" onClose={onClose} wide>
      {/* Imagen cabecera */}
      <div style={{ marginTop: "-36px", marginLeft: "-36px", marginRight: "-36px", marginBottom: "24px", borderRadius: "16px 16px 0 0", overflow: "hidden", height: "240px", position: "relative" }}>
        <img src={getFoto(cabana)} alt={cabana.zona}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(61,43,31,0.7) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "20px", left: "24px" }}>
          <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: cc.bg, color: cc.text, fontWeight: 500 }}>{cabana.categoria}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: 400, color: "white", marginTop: "6px" }}>{cabana.zona}</h2>
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", backdropFilter: "blur(4px)" }}><XIcon /></button>
      </div>

      {/* Info rápida */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { icon: <PersonIcon />, label: `Hasta ${cabana.cantidadPersonas} personas` },
          { icon: <CalIcon />, label: cabana.precioNoche ? `$${cabana.precioNoche.toLocaleString("es-CO")}/noche` : "Consultar precio" },
          { icon: <GameIcon />, label: `${ents.length} entretenimiento${ents.length !== 1 ? "s" : ""}` },
        ].map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8a7060", fontSize: "14px" }}>
            <span style={{ color: "var(--moss)" }}>{d.icon}</span>{d.label}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--fog)", marginBottom: "20px" }}>
        {(esAdmin ? ["info", "entretenimientos", "reservar"] : ["info", "entretenimientos", "reservar"]).map(t => (
          <button key={t} className={`tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {{ info: "Información", entretenimientos: "Entretenimientos", reservar: "Reservar" }[t]}
          </button>
        ))}
      </div>

      {/* Tab: Información */}
      {tab === "info" && (
        <div>
          {cabana.descripcion && <p style={{ color: "#6a5040", fontSize: "15px", lineHeight: 1.7, marginBottom: "16px" }}>{cabana.descripcion}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              ["Zona", cabana.zona],
              ["Categoría", cabana.categoria],
              ["Capacidad", `${cabana.cantidadPersonas} personas`],
              ["Precio", cabana.precioNoche ? `$${cabana.precioNoche.toLocaleString("es-CO")} USD/noche` : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "var(--fog)", borderRadius: "8px", padding: "12px 14px" }}>
                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a7060", marginBottom: "4px" }}>{k}</p>
                <p style={{ fontSize: "16px", fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, color: "var(--bark)" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Entretenimientos */}
      {tab === "entretenimientos" && (
        <div>
          {ents.length === 0 ? (
            <p style={{ color: "#8a7060", textAlign: "center", padding: "30px", fontSize: "15px" }}>Esta cabaña no tiene entretenimientos registrados.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {ents.map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--fog)", borderRadius: "30px", padding: "8px 16px", fontSize: "14px", color: "var(--bark)" }}>
                  <span style={{ color: "var(--moss)" }}><GameIcon /></span>{e.nombre}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Reservar */}
      {tab === "reservar" && (
        <div>
          {!username ? (
            <p style={{ color: "#dc2626", textAlign: "center", padding: "20px" }}>Debes iniciar sesión para reservar.</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Fecha de inicio" required type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={resForm.fechaInicio} onChange={e => setResForm(f => ({ ...f, fechaInicio: e.target.value }))} />
                <Field label="Días de estadía" required type="number" min="1"
                  value={resForm.cantDias} onChange={e => setResForm(f => ({ ...f, cantDias: e.target.value }))} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label={`Personas (máx. ${cabana.cantidadPersonas})`} required type="number"
                    min="1" max={cabana.cantidadPersonas}
                    value={resForm.numPersonas} onChange={e => setResForm(f => ({ ...f, numPersonas: e.target.value }))} />
                </div>
              </div>
              {cabana.precioNoche > 0 && (
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "14px 18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#166534", marginBottom: "2px" }}>Total estimado</p>
                    <p style={{ fontSize: "13px", color: "#166534" }}>${cabana.precioNoche.toLocaleString("es-CO")} × {resForm.cantDias} día(s)</p>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", fontWeight: 600, color: "var(--moss)" }}>
                    ${total.toLocaleString("es-CO")}
                  </p>
                </div>
              )}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
                <Btn variant="moss" onClick={handleReservar} disabled={loading}>
                  {loading ? "Reservando..." : "Confirmar reserva"}
                </Btn>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

// ============================================================
// MODAL: CREAR / EDITAR CABAÑA (Admin)
// ============================================================
const CabanaFormModal = ({ cabana, entretenimientos, onClose, onSaved, showToast }) => {
  const isEdit = !!cabana?.id;
  const [form, setForm] = useState({
    zona: cabana?.zona || "",
    categoria: cabana?.categoria || "",
    cantidadPersonas: cabana?.cantidadPersonas || "",
    precioNoche: cabana?.precioNoche || "",
    fotoUrl: cabana?.fotoUrl || "",
    descripcion: cabana?.descripcion || "",
    entretenimientoIds: (cabana?.entretenimientos || []).map(e => e.id),
  });
  const [loading, setLoading] = useState(false);

  const toggleEnt = id => setForm(f => ({
    ...f,
    entretenimientoIds: f.entretenimientoIds.includes(id)
      ? f.entretenimientoIds.filter(x => x !== id)
      : [...f.entretenimientoIds, id],
  }));

  const handleSave = async () => {
    if (!form.zona || !form.categoria || !form.cantidadPersonas) { showToast("Completa los campos obligatorios.", "err"); return; }
    setLoading(true);
    try {
      const payload = { ...form, cantidadPersonas: Number(form.cantidadPersonas), precioNoche: Number(form.precioNoche) || 0 };
      if (isEdit) await api(`/api/cabana/${cabana.id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/api/cabana", { method: "POST", body: JSON.stringify(payload) });
      showToast(isEdit ? "Cabaña actualizada." : "Cabaña creada.", "ok");
      onSaved();
    } catch (e) { showToast(e.message, "err"); }
    finally { setLoading(false); }
  };

  return (
    <Modal title={isEdit ? "Editar cabaña" : "Nueva cabaña"} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label="Zona" required value={form.zona} onChange={e => setForm(f => ({ ...f, zona: e.target.value }))} placeholder="Ej: Zona Alta" />
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "6px" }}>
            Categoría <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
            style={{ width: "100%", padding: "11px 14px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans',sans-serif" }}>
            <option value="">Seleccionar...</option>
            {["Estándar", "Premium", "Suite"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Capacidad" required type="number" min="1" value={form.cantidadPersonas} onChange={e => setForm(f => ({ ...f, cantidadPersonas: e.target.value }))} placeholder="4" />
        <Field label="Precio/noche (USD)" type="number" min="0" value={form.precioNoche} onChange={e => setForm(f => ({ ...f, precioNoche: e.target.value }))} placeholder="0" />
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="URL de foto" value={form.fotoUrl} onChange={e => setForm(f => ({ ...f, fotoUrl: e.target.value }))} placeholder="https://..." />
        </div>
        <div style={{ gridColumn: "1 / -1", marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "6px" }}>Descripción</label>
          <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3}
            placeholder="Descripción breve de la cabaña..."
            style={{ width: "100%", padding: "11px 14px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans',sans-serif", resize: "vertical" }} />
        </div>
      </div>

      {/* Entretenimientos */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "10px" }}>Entretenimientos</label>
        {entretenimientos.length === 0 ? (
          <p style={{ color: "#8a7060", fontSize: "13px" }}>No hay entretenimientos. Agrégalos en la sección de administración.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {entretenimientos.map(e => {
              const sel = form.entretenimientoIds.includes(e.id);
              return (
                <button key={e.id} onClick={() => toggleEnt(e.id)}
                  style={{
                    padding: "6px 14px", borderRadius: "20px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", border: "1.5px solid", transition: "all .2s",
                    background: sel ? "var(--moss)" : "transparent",
                    color: sel ? "white" : "var(--bark)",
                    borderColor: sel ? "var(--moss)" : "var(--fog)"
                  }}>
                  {e.nombre}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear cabaña"}</Btn>
      </div>
    </Modal>
  );
};

// ============================================================
// MODAL: RESERVAS
// ============================================================
const ReservasModal = ({ username, esAdmin, onClose, showToast }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    try {
      const url = esAdmin ? "/api/contrata" : `/api/contrata/mis-reservas?username=${username}`;
      const data = await api(url);
      setReservas(Array.isArray(data) ? data : []);
    } catch (e) { showToast(e.message, "err"); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const cancelar = async (id) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    try {
      await api(`/api/contrata/${id}`, { method: "DELETE" });
      showToast("Reserva cancelada.", "ok");
      cargar();
    } catch (e) { showToast(e.message, "err"); }
  };

  return (
    <Modal title={esAdmin ? "Todas las reservas" : "Mis reservas"} onClose={onClose} wide>
      <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        {loading && <p style={{ color: "#8a7060", textAlign: "center", padding: "30px" }}>Cargando...</p>}
        {!loading && reservas.length === 0 && <p style={{ color: "#8a7060", textAlign: "center", padding: "30px", fontSize: "15px" }}>No hay reservas aún.</p>}
        {reservas.map(r => (
          <div key={r.idContrata} style={{ border: "1px solid var(--fog)", borderRadius: "10px", padding: "16px", marginBottom: "12px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <img src={getFoto(r.cabana || {})} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
              onError={e => { e.target.style.display = "none" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: "var(--bark)", fontWeight: 500 }}>{r.cabana?.zona || "—"}</p>
              <p style={{ fontSize: "13px", color: "#8a7060", marginTop: "4px" }}>📅 Desde {r.fechaInicio} · {r.cantDias} día(s) · 👥 {r.numPersonas} personas</p>
              {esAdmin && r.cliente && <p style={{ fontSize: "12px", color: "var(--sky)", marginTop: "4px" }}>Cliente: {r.cliente.nombre} {r.cliente.apellido}</p>}
            </div>
            <button onClick={() => cancelar(r.idContrata)}
              style={{ background: "none", border: "1px solid #fca5a5", borderRadius: "8px", padding: "6px 10px", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", flexShrink: 0 }}>
              <TrashIcon /> Cancelar
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <Btn variant="secondary" onClick={onClose}>Cerrar</Btn>
      </div>
    </Modal>
  );
};

// ============================================================
// SECCIÓN: CATÁLOGO DE CABAÑAS (página explorar)
// ============================================================
const CatalogoCabanas = ({ cabanas, loading, username, esAdmin, showToast, onRefresh, entretenimientos, onEditar, onEliminar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtCat, setFiltCat] = useState("Todas");
  const [filtZona, setFiltZona] = useState("Todas");
  const [maxPrecio, setMaxPrecio] = useState(1000);
  const [detalle, setDetalle] = useState(null);
  const [sortBy, setSortBy] = useState("zona");

  const zonas = ["Todas", ...new Set(cabanas.map(c => c.zona))];
  const cats = ["Todas", "Estándar", "Premium", "Suite"];

  const filtradas = cabanas
    .filter(c => filtCat === "Todas" || c.categoria === filtCat)
    .filter(c => filtZona === "Todas" || c.zona === filtZona)
    .filter(c => !maxPrecio || (c.precioNoche || 0) <= maxPrecio || c.precioNoche === 0)
    .filter(c => !busqueda || c.zona?.toLowerCase().includes(busqueda.toLowerCase()) || c.categoria?.toLowerCase().includes(busqueda.toLowerCase()) || c.descripcion?.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => sortBy === "precio" ? (a.precioNoche || 0) - (b.precioNoche || 0) : a.zona?.localeCompare(b.zona));

  return (
    <div>
      {/* Hero catálogo */}
      <div style={{ background: "linear-gradient(135deg, var(--bark) 0%, #5a3d2b 60%, var(--moss) 100%)", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(200,169,110,0.08)" }} />
        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp .6s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "10px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            <LeafIcon /> Nuestras cabañas
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: "var(--cream)", fontSize: "38px", fontWeight: 300, lineHeight: 1.2 }}>
            Encuentra tu cabaña ideal
          </h1>
          <p style={{ color: "rgba(245,239,230,0.6)", marginTop: "8px", fontSize: "15px", maxWidth: "480px" }}>
            Explora todas nuestras opciones, filtra por zona, categoría y precio. Haz tu reserva en segundos.
          </p>
        </div>
      </div>

      <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Filtros */}
        <div style={{ background: "white", borderRadius: "14px", padding: "20px 24px", border: "1px solid var(--fog)", boxShadow: "0 2px 8px var(--shadow)", marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            {/* Buscador */}
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a7060", marginBottom: "6px" }}>Buscar</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b0a090" }}><SearchIcon /></span>
                <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Zona, categoría, descripción..."
                  style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", fontFamily: "'DM Sans',sans-serif" }} />
              </div>
            </div>
            {/* Categoría */}
            <div style={{ minWidth: "140px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a7060", marginBottom: "6px" }}>Categoría</label>
              <select value={filtCat} onChange={e => setFiltCat(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans',sans-serif" }}>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Zona */}
            <div style={{ minWidth: "160px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a7060", marginBottom: "6px" }}>Zona</label>
              <select value={filtZona} onChange={e => setFiltZona(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans',sans-serif" }}>
                {zonas.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            {/* Precio */}
            <div style={{ minWidth: "180px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a7060", marginBottom: "6px" }}>Precio máx: ${maxPrecio}</label>
              <input type="range" min="50" max="1000" step="50" value={maxPrecio} onChange={e => setMaxPrecio(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            {/* Ordenar */}
            <div style={{ minWidth: "140px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a7060", marginBottom: "6px" }}>Ordenar</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--fog)", borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: "white", fontFamily: "'DM Sans',sans-serif" }}>
                <option value="zona">Por zona</option>
                <option value="precio">Menor precio</option>
              </select>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#8a7060", marginTop: "12px" }}>{filtradas.length} cabaña{filtradas.length !== 1 ? "s" : ""} encontrada{filtradas.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Grid cabañas */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#8a7060" }}>Cargando cabañas...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#8a7060" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", marginBottom: "8px" }}>Sin resultados</p>
            <p style={{ fontSize: "14px" }}>Prueba ajustando los filtros.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
            {filtradas.map((cab, i) => {
              const cc = catColor(cab.categoria);
              const ents = cab.entretenimientos || [];
              return (
                <div key={cab.id}
                  style={{ background: "white", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--fog)", boxShadow: "0 2px 8px var(--shadow)", transition: "all .25s", animation: `fadeUp .5s ease ${i * .06}s both`, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px var(--shadow)"; e.currentTarget.style.borderColor = "var(--moss)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px var(--shadow)"; e.currentTarget.style.borderColor = "var(--fog)"; }}>

                  {/* Foto */}
                  <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                    <img src={getFoto(cab)} alt={cab.zona}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"}
                      onError={e => { e.target.parentNode.innerHTML = `<div class="cabana-img-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b0a090" strokeWidth="1.2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg><span style="font-size:13px;color:#b0a090">Sin imagen</span></div>`; }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: cc.bg, color: cc.text, fontWeight: 500 }}>{cab.categoria}</span>
                    </div>
                    {cab.precioNoche > 0 && (
                      <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(61,43,31,0.85)", borderRadius: "8px", padding: "4px 10px" }}>
                        <span style={{ color: "var(--gold)", fontSize: "14px", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>${cab.precioNoche}<span style={{ fontSize: "11px", fontFamily: "'DM Sans',sans-serif", opacity: .8 }}>/noche</span></span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "18px" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 500, color: "var(--bark)", marginBottom: "6px" }}>{cab.zona}</h3>
                    {cab.descripcion && <p style={{ fontSize: "13px", color: "#8a7060", lineHeight: 1.5, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{cab.descripcion}</p>}

                    <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#8a7060", marginBottom: "12px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><PersonIcon />{cab.cantidadPersonas} personas</span>
                      {ents.length > 0 && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><GameIcon />{ents.length} actividad{ents.length !== 1 ? "es" : ""}</span>}
                    </div>

                    {/* Entretenimientos chips */}
                    {ents.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
                        {ents.slice(0, 3).map(e => (
                          <span key={e.id} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", background: "var(--fog)", color: "#6a5040" }}>{e.nombre}</span>
                        ))}
                        {ents.length > 3 && <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", background: "var(--fog)", color: "#6a5040" }}>+{ents.length - 3} más</span>}
                      </div>
                    )}

                    {/* Botones */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setDetalle(cab)}
                        style={{ flex: 1, padding: "9px", background: "var(--fog)", color: "var(--bark)", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
                        Ver detalle
                      </button>
                      {esAdmin ? (
                        <>
                          <button onClick={() => onEditar(cab)}
                            style={{ padding: "9px 12px", background: "var(--bark)", color: "var(--cream)", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans',sans-serif" }}>
                            <EditIcon />
                          </button>
                          <button onClick={() => onEliminar(cab)}
                            style={{ padding: "9px 12px", background: "transparent", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "8px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans',sans-serif" }}>
                            <TrashIcon />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setDetalle({ ...cab, _openTab: "reservar" })}
                          style={{ flex: 1, padding: "9px", background: "var(--moss)", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
                          Reservar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal detalle */}
      {detalle && (
        <DetalleCabanaModal
          cabana={detalle}
          username={username}
          esAdmin={esAdmin}
          onClose={() => setDetalle(null)}
          showToast={showToast}
          onReservado={() => setDetalle(null)}
        />
      )}
    </div>
  );
};

// ============================================================
// HOME / DASHBOARD
// ============================================================
const HomePage = ({ user, onLogout, showToast }) => {
  const esAdmin = user?.rol === "ADMIN";
  const [paginaActual, setPaginaActual] = useState("dashboard"); // "dashboard" | "catalogo"
  const [cabanas, setCabanas] = useState([]);
  const [entretenimientos, setEntretenimientos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingCab, setLoadingCab] = useState(true);
  const [modal, setModal] = useState(null);

  const cargarCabanas = async () => {
    setLoadingCab(true);
    try { setCabanas(await api("/api/cabana")); }
    catch (e) { showToast("Error al cargar cabañas: " + e.message, "err"); }
    finally { setLoadingCab(false); }
  };

  const cargarEntretenimientos = async () => {
    try { setEntretenimientos(await api("/api/entretenimiento")); }
    catch { /* silencioso */ } //esto es para que no se rompa la aplicacion si no hay entretenimientos
  };

  const cargarStats = async () => {
    try { setStats(await api("/api/contrata/stats")); }
    catch { /* silencioso */ } //esto es para que no se rompa la aplicacion si no hay stats
  };

  useEffect(() => {
    cargarCabanas();
    cargarEntretenimientos();
    if (esAdmin) cargarStats();
  }, []);

  const eliminarCabana = async (cab) => {
    if (!window.confirm(`¿Eliminar la cabaña "${cab.zona}"?`)) return;
    try {
      await api(`/api/cabana/${cab.id}`, { method: "DELETE" });
      showToast("Cabaña eliminada.", "ok");
      cargarCabanas();
      if (esAdmin) cargarStats();
    } catch (e) { showToast(e.message, "err"); }
  };

  const statsCards = esAdmin
    ? [
      { label: "Cabañas", value: stats ? String(stats.totalCabanas) : "…", color: "var(--moss)" },
      { label: "Reservas totales", value: stats ? String(stats.totalReservas) : "…", color: "var(--sky)" },
      { label: "Clientes", value: stats ? String(stats.totalClientes) : "…", color: "var(--gold)" },
      { label: "Entretenimientos", value: String(entretenimientos.length), color: "var(--bark)" },
    ]
    : [
      { label: "Cabañas disponibles", value: String(cabanas.length), color: "var(--moss)" },
      { label: "Premium", value: String(cabanas.filter(c => c.categoria === "Premium").length), color: "var(--gold)" },
      { label: "Estándar", value: String(cabanas.filter(c => c.categoria === "Estándar").length), color: "var(--sky)" },
      { label: "Suites", value: String(cabanas.filter(c => c.categoria === "Suite").length), color: "var(--bark)" },
    ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans',sans-serif" }}>

      {/* Navbar */}
      <header style={{ background: "white", borderBottom: "1px solid var(--fog)", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "var(--bark)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}><MountainIcon /></div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 600, color: "var(--bark)" }}>Mar Azul</span>
            <span style={{ padding: "2px 10px", background: "var(--fog)", borderRadius: "20px", fontSize: "11px", fontWeight: 500, color: "#8a7060", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {esAdmin ? "Admin" : "Cliente"}
            </span>
          </div>
          {/* Tabs de navegación */}
          <nav style={{ display: "flex", gap: "4px" }}>
            {[{ id: "dashboard", label: "Dashboard" }, { id: "catalogo", label: "Cabañas" }].map(t => (
              <button key={t.id} onClick={() => setPaginaActual(t.id)}
                style={{
                  padding: "6px 16px", borderRadius: "8px", border: "none", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s",
                  background: paginaActual === t.id ? "var(--fog)" : "transparent",
                  color: paginaActual === t.id ? "var(--bark)" : "#8a7060",
                  fontWeight: paginaActual === t.id ? 500 : 400
                }}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setModal({ tipo: "reservas" })}
            style={{ padding: "7px 16px", background: "transparent", border: "1px solid var(--fog)", borderRadius: "8px", color: "#8a7060", cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>
            {esAdmin ? "Ver reservas" : "Mis reservas"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 500 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: "14px", color: "var(--bark)", fontWeight: 500 }}>{user?.username}</span>
          </div>
          <button onClick={onLogout}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "transparent", border: "1px solid var(--fog)", borderRadius: "8px", color: "#8a7060", cursor: "pointer", fontSize: "13px", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--fog)"; e.currentTarget.style.color = "#8a7060"; }}>
            <LogoutIcon /> Salir
          </button>
        </div>
      </header>

      {/* PÁGINA: DASHBOARD */}
      {paginaActual === "dashboard" && (
        <>
          <div style={{ background: "linear-gradient(135deg,var(--bark) 0%,#5a3d2b 60%,var(--moss) 100%)", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(200,169,110,0.08)" }} />
            <div style={{ position: "relative", zIndex: 1, animation: "fadeUp .6s ease both" }}>
              <p style={{ color: "var(--gold)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>
                {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: "var(--cream)", fontSize: "38px", fontWeight: 300, lineHeight: 1.2 }}>
                {esAdmin ? "Panel de administración" : `Hola de nuevo, ${user?.username}`}
              </h1>
              <p style={{ color: "rgba(245,239,230,0.6)", marginTop: "8px", fontSize: "15px" }}>
                {esAdmin ? "Gestiona cabañas, reservas y entretenimientos." : "Explora nuestras cabañas y haz tu reserva."}
              </p>
              {!esAdmin && (
                <button onClick={() => setPaginaActual("catalogo")}
                  style={{ marginTop: "20px", padding: "12px 28px", background: "var(--gold)", color: "var(--bark)", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Explorar cabañas →
                </button>
              )}
            </div>
          </div>

          <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "40px" }}>
              {statsCards.map((s, i) => (
                <div key={i} style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid var(--fog)", animation: `fadeUp .5s ease ${i * .08}s both`, boxShadow: "0 2px 8px var(--shadow)" }}>
                  <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#b0a090", fontWeight: 500, marginBottom: "8px" }}>{s.label}</p>
                  <p style={{ fontSize: "28px", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Cabañas recientes */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", fontWeight: 400, color: "var(--bark)" }}>
                {esAdmin ? "Gestión de cabañas" : "Cabañas destacadas"}
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {esAdmin && <Btn onClick={() => setModal({ tipo: "cabana", data: null })} style={{ display: "flex", alignItems: "center", gap: "6px" }}><PlusIcon /> Nueva cabaña</Btn>}
                <Btn variant="secondary" onClick={() => setPaginaActual("catalogo")}>Ver todas →</Btn>
              </div>
            </div>

            {loadingCab ? (
              <p style={{ color: "#8a7060", textAlign: "center", padding: "40px" }}>Cargando...</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
                {cabanas.slice(0, 4).map((cab, i) => {
                  const cc = catColor(cab.categoria);
                  return (
                    <div key={cab.id} style={{ background: "white", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--fog)", animation: `fadeUp .5s ease ${i * .08}s both`, boxShadow: "0 2px 8px var(--shadow)" }}>
                      <img src={getFoto(cab)} alt={cab.zona} style={{ width: "100%", height: "160px", objectFit: "cover" }} onError={e => { e.target.style.display = "none" }} />
                      <div style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <div>
                            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", background: cc.bg, color: cc.text, fontWeight: 500 }}>{cab.categoria}</span>
                            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 500, color: "var(--bark)", marginTop: "6px" }}>{cab.zona}</h3>
                          </div>
                          {cab.precioNoche > 0 && <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 600, color: "var(--moss)" }}>${cab.precioNoche}/noche</p>}
                        </div>
                        <p style={{ fontSize: "13px", color: "#8a7060", marginBottom: "12px" }}>👥 Hasta {cab.cantidadPersonas} personas</p>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {esAdmin ? (
                            <>
                              <Btn onClick={() => setModal({ tipo: "cabana", data: cab })} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><EditIcon /> Editar</Btn>
                              <Btn variant="danger" onClick={() => eliminarCabana(cab)} style={{ display: "flex", alignItems: "center", gap: "6px" }}><TrashIcon /></Btn>
                            </>
                          ) : (
                            <Btn variant="moss" onClick={() => setPaginaActual("catalogo")} style={{ flex: 1 }}>Ver y reservar</Btn>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Acciones rápidas cliente */}
            {!esAdmin && (
              <div style={{ marginTop: "40px" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", fontWeight: 400, color: "var(--bark)", marginBottom: "16px" }}>Acciones rápidas</h2>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    { label: "Explorar cabañas", onClick: () => setPaginaActual("catalogo") },
                    { label: "Mis reservas", onClick: () => setModal({ tipo: "reservas" }) },
                  ].map((a, i) => (
                    <button key={i} onClick={a.onClick}
                      style={{ padding: "10px 20px", background: "white", color: "var(--bark)", border: "1.5px solid var(--fog)", borderRadius: "10px", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--moss)"; e.currentTarget.style.color = "var(--moss)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--fog)"; e.currentTarget.style.color = "var(--bark)"; }}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {/* PÁGINA: CATÁLOGO */}
      {paginaActual === "catalogo" && (
        <CatalogoCabanas
          cabanas={cabanas}
          loading={loadingCab}
          username={user?.username}
          esAdmin={esAdmin}
          showToast={showToast}
          onRefresh={cargarCabanas}
          entretenimientos={entretenimientos}
          onEditar={cab => setModal({ tipo: "cabana", data: cab })}
          onEliminar={eliminarCabana}
        />
      )}

      {/* Modales */}
      {modal?.tipo === "cabana" && (
        <CabanaFormModal
          cabana={modal.data}
          entretenimientos={entretenimientos}
          onClose={() => setModal(null)}
          showToast={showToast}
          onSaved={() => { setModal(null); cargarCabanas(); if (esAdmin) cargarStats(); }}
        />
      )}
      {modal?.tipo === "reservas" && (
        <ReservasModal username={user?.username} esAdmin={esAdmin} onClose={() => setModal(null)} showToast={showToast} />
      )}
    </div>
  );
};

// ============================================================
// LOGIN
// ============================================================
const LoginPage = ({ onLogin, onGoRegister }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.password) { setError("Completa todos los campos."); return; }
    setLoading(true); setError("");
    try {
      const data = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      onLogin({ username: data.username, rol: data.rol });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--cream)", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: "52%", background: "var(--bark)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "48px" }}>
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(200,169,110,0.08)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-65%)", animation: "drift 6s ease-in-out infinite" }}>
          <svg width="260" height="220" viewBox="0 0 260 220" fill="none">
            <path d="M0 180 L80 60 L160 180 Z" fill="rgba(74,92,63,0.25)" /><path d="M60 180 L160 40 L260 180 Z" fill="rgba(74,92,63,0.18)" />
            <rect x="70" y="130" width="120" height="70" rx="2" fill="rgba(245,239,230,0.12)" />
            <path d="M55 130 L130 75 L205 130 Z" fill="rgba(200,169,110,0.45)" />
            <rect x="112" y="160" width="36" height="40" rx="3" fill="rgba(61,43,31,0.6)" />
            <rect x="78" y="142" width="28" height="22" rx="2" fill="rgba(107,143,163,0.5)" />
            <rect x="154" y="142" width="28" height="22" rx="2" fill="rgba(107,143,163,0.5)" />
            <rect x="150" y="85" width="14" height="28" rx="1" fill="rgba(200,169,110,0.55)" />
            <circle cx="157" cy="78" r="5" fill="rgba(245,239,230,0.2)" />
            <path d="M30 180 L46 140 L62 180 Z" fill="rgba(74,92,63,0.4)" />
            <path d="M198 180 L212 148 L226 180 Z" fill="rgba(74,92,63,0.4)" />
            <path d="M0 195 Q65 180 130 190 Q195 200 260 185 L260 220 L0 220 Z" fill="rgba(74,92,63,0.2)" />
            <circle cx="40" cy="40" r="2" fill="rgba(200,169,110,0.6)" />
          </svg>
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "12px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <LeafIcon /> Reservas Mar Azul
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", lineHeight: 1.2, color: "var(--cream)", fontWeight: 300 }}>
            Donde la naturaleza<br /><em>te abraza</em>
          </p>
          <div style={{ display: "flex", gap: "4px", marginTop: "20px", color: "var(--gold)" }}>
            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
            <span style={{ color: "rgba(245,239,230,0.5)", fontSize: "13px", marginLeft: "8px" }}>4.9 · 230 reseñas</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 72px", animation: "fadeUp .7s ease both", background: "var(--cream)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "52px" }}>
          <div style={{ width: "36px", height: "36px", background: "var(--bark)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}><MountainIcon /></div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 600, color: "var(--bark)" }}>Mar Azul</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", fontWeight: 400, color: "var(--bark)", lineHeight: 1.1, marginBottom: "8px" }}>Bienvenido</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "40px" }}>Inicia sesión para acceder a tu cuenta</p>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "8px" }}>Usuario</label>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focused === "username" ? "var(--moss)" : "var(--text-muted)" }}><UserIcon /></div>
            <input name="username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              onFocus={() => setFocused("username")} onBlur={() => setFocused(null)} placeholder="tu_usuario"
              style={{ width: "100%", padding: "14px 16px 14px 44px", border: `1.5px solid ${focused === "username" ? "var(--moss)" : "var(--input-border)"}`, borderRadius: "10px", fontSize: "15px", outline: "none", background: "var(--input-bg)", color: "var(--bark)", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
        </div>
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bark)", marginBottom: "8px" }}>Contraseña</label>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focused === "password" ? "var(--moss)" : "var(--text-muted)" }}><LockIcon /></div>
            <input type={showPwd ? "text" : "password"} name="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="••••••••"
              style={{ width: "100%", padding: "14px 44px 14px 44px", border: `1.5px solid ${focused === "password" ? "var(--moss)" : "var(--input-border)"}`, borderRadius: "10px", fontSize: "15px", outline: "none", background: "var(--input-bg)", color: "var(--bark)", fontFamily: "'DM Sans',sans-serif" }} />
            <button type="button" className="pwd-toggle" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>{error}</div>}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "15px", background: loading ? "var(--fog)" : "var(--bark)", color: loading ? "var(--text-muted)" : "var(--cream)", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          {loading ? "Verificando..." : "Iniciar sesión"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--fog)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>¿No tienes cuenta?</span>
          <div style={{ flex: 1, height: "1px", background: "var(--fog)" }} />
        </div>
        <button onClick={onGoRegister}
          style={{ width: "100%", padding: "14px", background: "transparent", color: "var(--bark)", border: "1.5px solid var(--fog)", borderRadius: "10px", fontSize: "15px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--moss)"; e.currentTarget.style.color = "var(--moss)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--fog)"; e.currentTarget.style.color = "var(--bark)"; }}>
          Crear cuenta
        </button>
        <p style={{ textAlign: "center", marginTop: "32px", color: "var(--text-muted)", fontSize: "12px" }}>Sistema de gestión · Mar Azul © 2025</p>
      </div>
    </div>
  );
};

// ============================================================
// REGISTRO
// ============================================================
const RegistroPage = ({ onBack }) => {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", telefono: "", pais: "", username: "", password: "", fechaNacimiento: "" });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  // Valida un campo individual y devuelve mensaje de error o ""
  const validateField = (name, value) => {
    if (["nombre", "apellido", "email", "telefono", "username", "password", "fechaNacimiento"].includes(name) && !value.trim())
      return "Campo obligatorio";
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Email inválido";
    if (name === "password" && value && value.length < 8)
      return "Mínimo 8 caracteres";
    if (name === "username" && value && value.length < 4)
      return "Mínimo 4 caracteres";
    if (name === "fechaNacimiento" && value) {
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      if (new Date(value) >= hoy) return "La fecha debe ser anterior a hoy";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors(p => ({ ...p, [name]: "" }));
    }
  };

  const triggerShake = (names) => {
    const active = {};
    names.forEach(n => { active[n] = true; });
    setShakeFields(active);
    setTimeout(() => setShakeFields({}), 500);
  };

  const handleSubmit = async () => {
    // Validar todos los campos
    const required = ["nombre", "apellido", "email", "telefono", "username", "password", "fechaNacimiento"];
    const newErrors = {};
    required.forEach(name => {
      const msg = validateField(name, form[name]);
      if (msg) newErrors[name] = msg;
    });
    // Validar formato aunque no estén vacíos
    if (!newErrors.email)    { const m = validateField("email",    form.email);    if (m) newErrors.email    = m; }
    if (!newErrors.password) { const m = validateField("password", form.password); if (m) newErrors.password = m; }
    if (!newErrors.username) { const m = validateField("username", form.username); if (m) newErrors.username = m; }
    if (!newErrors.fechaNacimiento) { const m = validateField("fechaNacimiento", form.fechaNacimiento); if (m) newErrors.fechaNacimiento = m; }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      triggerShake(Object.keys(newErrors));
      setError("Corrige los campos marcados en rojo.");
      return;
    }

    setLoading(true); setError(""); setFieldErrors({});
    try {
      await api("/api/auth/registro", { method: "POST", body: JSON.stringify({ ...form, pais: form.pais || "Colombia" }) });
      setOk(true);
      setTimeout(() => { setOk(false); onBack(); }, 2000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fields = [
    { name: "nombre",          label: "Nombre",              placeholder: "María",               required: true },
    { name: "apellido",        label: "Apellido",             placeholder: "González",            required: true },
    { name: "email",           label: "Email",                placeholder: "maria@email.com",     required: true },
    { name: "telefono",        label: "Teléfono",             placeholder: "+57 310 000 0000",    required: true },
    { name: "pais",            label: "País",                 placeholder: "Colombia" },
    { name: "fechaNacimiento", label: "Fecha de nacimiento",  placeholder: "",   type: "date",    required: true },
    { name: "username",        label: "Usuario",              placeholder: "maria_g",             required: true },
    { name: "password",        label: "Contraseña",           placeholder: "Mínimo 8 caracteres", type: "password", required: true },
  ];

  const fullWidthFields = ["email", "fechaNacimiento", "username", "password"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "480px", animation: "fadeUp .6s ease both" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>← Volver al inicio</button>
        <div style={{ background: "var(--surface)", borderRadius: "16px", padding: "40px", border: "1px solid var(--fog)", boxShadow: "10px 15px 50px rgba(61,43,31,0.28)" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: 400, color: "var(--bark)", marginBottom: "6px" }}>Crear cuenta</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>Únete a la comunidad Mar Azul</p>
          {ok && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px", textAlign: "center" }}>¡Registro exitoso! Redirigiendo...</div>}
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {fields.map(f => {
              const hasError = !!fieldErrors[f.name];
              const isShaking = !!shakeFields[f.name];
              return (
                <div key={f.name} style={{ gridColumn: fullWidthFields.includes(f.name) ? "1 / -1" : "auto" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: hasError ? "#ef4444" : "var(--bark)", marginBottom: "6px" }}>
                    {f.label}{f.required && <span style={{ color: "#ef4444" }}> *</span>}
                  </label>
                  <div style={{ position: "relative" }}>
                  <input
                    type={f.name === "password" ? (showPwd ? "text" : "password") : (f.type || "text")}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    {...(f.name === "fechaNacimiento" ? { max: new Date().toISOString().split("T")[0] } : {})}
                    className={[hasError ? "field-error" : "", isShaking ? "field-shake" : ""].join(" ").trim()}
                    style={{ width: "100%", padding: f.name === "password" ? "11px 40px 11px 14px" : "11px 14px", border: `1.5px solid ${hasError ? "#ef4444" : "var(--input-border)"}`, borderRadius: "8px", fontSize: "14px", outline: "none", color: "var(--bark)", background: hasError ? "#fff5f5" : "var(--input-bg)", fontFamily: "'DM Sans',sans-serif", transition: "border-color .2s, background .2s" }}
                    onFocus={e => { if (!hasError) e.target.style.borderColor = "var(--moss)"; }}
                    onBlur={e => { if (!hasError) e.target.style.borderColor = "var(--input-border)"; }}
                  />
                  {f.name === "password" && (
                    <button type="button" className="pwd-toggle" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  )}
                  </div>
                  {hasError && (
                    <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", fontWeight: 500 }}>
                      {fieldErrors[f.name]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{ marginTop: "24px", width: "100%", padding: "14px", background: loading ? "var(--fog)" : "var(--bark)", color: loading ? "#8a7060" : "var(--cream)", border: "none", borderRadius: "10px", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Íconos de tema
const SunIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const AutoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2v10l4 4"/></svg>;

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("auto"); // "light" | "dark" | "auto"

  const showToast = (msg, type = "ok") => setToast({ msg, type });

  // Aplica el atributo data-theme al <html> cada vez que cambia
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themes = [
    { key: "light", label: "Claro",     icon: <SunIcon /> },
    { key: "dark",  label: "Oscuro",    icon: <MoonIcon /> },
    { key: "auto",  label: "Automático", icon: <AutoIcon /> },
  ];

  return (
    <>
      <StyleInjector />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Selector de tema — esquina superior derecha, siempre visible */}
      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 3000, display: "flex", gap: "4px", background: "var(--surface)", border: "1px solid var(--fog)", borderRadius: "10px", padding: "4px", boxShadow: "0 2px 12px var(--shadow)" }}>
        {themes.map(t => (
          <button key={t.key} onClick={() => setTheme(t.key)} title={t.label}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 10px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "all .2s",
              background: theme === t.key ? "var(--bark)" : "transparent",
              color:      theme === t.key ? "var(--cream)" : "var(--text-muted)" }}>
            {t.icon} <span style={{ display: window.innerWidth < 500 ? "none" : "inline" }}>{t.label}</span>
          </button>
        ))}
      </div>

      {page === "login"    && <LoginPage    onLogin={u => { setUser(u); setPage("home"); }} onGoRegister={() => setPage("registro")} />}
      {page === "home"     && <HomePage     user={user} onLogout={() => { setUser(null); setPage("login"); }} showToast={showToast} />}
      {page === "registro" && <RegistroPage onBack={() => setPage("login")} />}
    </>
  );
}
