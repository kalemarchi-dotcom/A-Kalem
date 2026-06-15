import { useState, useEffect } from "react";

// ─── PALETTE & DESIGN TOKENS ────────────────────────────────────────────────
const T = {
  ink:     "#0D0D0D",
  slate:   "#1C2B3A",
  steel:   "#2E4057",
  gold:    "#B8973A",
  goldLt:  "#D4AF6A",
  sand:    "#F5F0E8",
  white:   "#FFFFFF",
  muted:   "#8A8F99",
  border:  "#E4DDD1",
  green:   "#2D6A4F",
  amber:   "#B45309",
  red:     "#991B1B",
  blue:    "#1D4ED8",
};

// ─── SEED DATA ──────────────────────────────────────────────────────────────
const ROLES_META = {
  gerant:     { label: "Gérant",       icon: "◆", color: "#B8973A" },
  cogerant:   { label: "Co-Gérant",    icon: "◇", color: "#B45309" },
  architecte: { label: "Architecte",   icon: "▲", color: "#2E4057" },
  architecte Principale: { label: "Architecte Admin",   icon: "▲", color: "#2E4057" },
  ingenieur:  { label: "Ingénieur GC", icon: "●", color: "#1C2B3A" },
  secretaire: { label: "Réception",    icon: "■", color: "#8A8F99" },
};

const INIT_MEMBRES = [
  { id: 1, nom: "Votre Nom",   prenom: "",       role: "gerant",     tel: "", email: "", note: "Gérant fondateur — Bet Kalem" },
  { id: 2, nom: "Sid Ahmed",   prenom: "",       role: "cogerant",   tel: "", email: "", note: "Co-gérant & frère" },
  { id: 3, nom: "Hanane",      prenom: "",       role: "architecte", tel: "", email: "", note: "" },
  { id: 4, nom: "Ahmed",       prenom: "",       role: "architecte", tel: "", email: "", note: "" },
  { id: 5, nom: "Aymen",       prenom: "",       role: "architecte Principale", tel: "", email: "", note: "" },
  { id: 6, nom: "Azzedine",    prenom: "",       role: "architecte", tel: "", email: "", note: "" },
  { id: 7, nom: "Hfedh",       prenom: "",       role: "architecte", tel: "", email: "", note: "" },
  { id: 8, nom: "Ingénieur GC",prenom: "",       role: "ingenieur",  tel: "", email: "", note: "Génie Civil" },
  { id: 9, nom: "Hanane",      prenom: "Réc.",   role: "secretaire", tel: "", email: "", note: "Accueil & réception" },
];

const INIT_CLIENTS = [
  { id: "CLI-001", nom: "M. Larbi Ahmed",       tel: "0550 123 456", email: "larbi@email.com", ville: "Alger",    type: "Particulier", note: "Client fidèle depuis 2022" },
  { id: "CLI-002", nom: "SARL Constructions",   tel: "0770 654 321", email: "sarl@email.com", ville: "Oran",     type: "Société",     note: "" },
];

const CATEGORIES = ["Plans", "Permis", "Devis", "Contrats", "Photos", "Rapports", "Correspondance"];
const STATUTS    = ["En cours", "Validé", "Archivé", "En attente"];
const TYPES_PROJ = ["Résidentiel", "Commercial", "Industriel", "Public", "Rénovation", "Autre"];

const INIT_PROJETS = [
  {
    id: "BK-2025-001", nom: "Résidence Les Pins", clientId: "CLI-001",
    ville: "Alger", type: "Résidentiel", statut: "En cours",
    responsable: 2, dateDebut: "2025-01-15", budget: "45 000 000",
    description: "Villa R+2 avec piscine, surface 380m²",
    fichiers: [
      { id: "F001", nom: "Plan RDC v3.pdf",           categorie: "Plans",    date: "2025-03-10", taille: "2.4 MB" },
      { id: "F002", nom: "Permis de construire.pdf",  categorie: "Permis",   date: "2025-02-01", taille: "1.1 MB" },
      { id: "F003", nom: "Devis général.xlsx",        categorie: "Devis",    date: "2025-01-20", taille: "450 KB" },
    ],
  },
  {
    id: "BK-2025-002", nom: "Immeuble Saïd",     clientId: "CLI-002",
    ville: "Oran",  type: "Commercial", statut: "En attente",
    responsable: 3, dateDebut: "2025-02-01", budget: "120 000 000",
    description: "Immeuble R+5, usage mixte bureaux/commerces",
    fichiers: [
      { id: "F004", nom: "Façade principale.dwg", categorie: "Plans", date: "2025-02-15", taille: "5.8 MB" },
    ],
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const today = () => new Date().toISOString().split("T")[0];

function qrUrl(text, size = 140) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=0D0D0D&bgcolor=F5F0E8&margin=6`;
}

function Badge({ statut }) {
  const map = {
    "En cours":   { bg: "#DCFCE7", color: "#166534" },
    "Validé":     { bg: "#DBEAFE", color: "#1E40AF" },
    "Archivé":    { bg: "#F3F4F6", color: "#4B5563" },
    "En attente": { bg: "#FEF9C3", color: "#854D0E" },
  };
  const s = map[statut] || { bg: "#eee", color: "#555" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.4 }}>
      {statut}
    </span>
  );
}

function Overlay({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(13,13,13,0.6)", backdropFilter:"blur(3px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:900, padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.white, borderRadius:16, width:"100%", maxWidth:660, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.35)" }}>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.8 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ padding:"10px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:14, color:T.ink, background:T.white, outline:"none", fontFamily:"inherit" }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.8 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding:"10px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:14, color:T.ink, background:T.white, outline:"none", fontFamily:"inherit" }}>
        {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false }) {
  const styles = {
    primary:  { background: T.slate, color: T.white, border: "none" },
    gold:     { background: T.gold,  color: T.white, border: "none" },
    ghost:    { background: "transparent", color: T.slate, border: `1.5px solid ${T.border}` },
    danger:   { background: T.red,   color: T.white, border: "none" },
  };
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 12 },
    md: { padding: "9px 20px", fontSize: 13 },
    lg: { padding: "12px 28px", fontSize: 15 },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], ...sizes[size], borderRadius:8, cursor:disabled?"not-allowed":"pointer", fontWeight:700, fontFamily:"inherit", opacity:disabled?0.5:1, transition:"opacity .15s" }}>
      {children}
    </button>
  );
}

// ─── LOGO BET KALEM ─────────────────────────────────────────────────────────
function BKLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill={T.gold}/>
      {/* Stylised building / pen nib mark */}
      <polygon points="20,6 32,30 8,30" fill="none" stroke={T.slate} strokeWidth="2.2" strokeLinejoin="round"/>
      <line x1="20" y1="6" x2="20" y2="30" stroke={T.slate} strokeWidth="1.4"/>
      <line x1="12" y1="22" x2="28" y2="22" stroke={T.slate} strokeWidth="1.4"/>
    </svg>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function BetKalem() {
  // Persist state in memory (in-session storage via useState)
  const [membres,  setMembres]  = useState(INIT_MEMBRES);
  const [clients,  setClients]  = useState(INIT_CLIENTS);
  const [projets,  setProjets]  = useState(INIT_PROJETS);
  const [settings, setSettings] = useState({ nom: "Bet Kalem", sousTitre: "Bureau d'Architecture", couleur: T.slate });

  const [page,    setPage]    = useState("dashboard"); // dashboard|projets|clients|equipe|settings
  const [detail,  setDetail]  = useState(null);        // projet id
  const [modal,   setModal]   = useState(null);        // { type, data }
  const [search,  setSearch]  = useState("");
  const [filtre,  setFiltre]  = useState("Tous");
  const [sideOpen,setSideOpen]= useState(true);

  // Responsive sidebar
  useEffect(() => {
    const handler = () => setSideOpen(window.innerWidth > 700);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Computed ──
  const projetsFiltres = projets.filter(p => {
    const q = search.toLowerCase();
    const client = clients.find(c => c.id === p.clientId);
    const ok = p.nom.toLowerCase().includes(q) || (client?.nom||"").toLowerCase().includes(q) || p.ville.toLowerCase().includes(q);
    return ok && (filtre === "Tous" || p.statut === filtre);
  });

  const getClient = id => clients.find(c => c.id === id);
  const getMembre = id => membres.find(m => m.id === id);

  // ── Mutations ──
  const updateMembre = (id, patch) => setMembres(ms => ms.map(m => m.id === id ? { ...m, ...patch } : m));
  const updateClient = (id, patch) => setClients(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  const addClient = (c) => setClients(cs => [...cs, { ...c, id: `CLI-${uid()}` }]);
  const deleteClient = id => setClients(cs => cs.filter(c => c.id !== id));
  const addProjet = (p) => {
    const year = new Date().getFullYear();
    const id = `BK-${year}-${String(projets.length + 1).padStart(3, "0")}`;
    setProjets(ps => [...ps, { ...p, id, fichiers: [] }]);
  };
  const updateProjet = (id, patch) => setProjets(ps => ps.map(p => p.id === id ? { ...p, ...patch } : p));
  const deleteProjet = id => { setProjets(ps => ps.filter(p => p.id !== id)); setDetail(null); setPage("projets"); };
  const addFichier = (projetId, f) => {
    const fichier = { ...f, id: `F${uid()}`, date: today(), taille: "—" };
    setProjets(ps => ps.map(p => p.id === projetId ? { ...p, fichiers: [...p.fichiers, fichier] } : p));
  };
  const deleteFichier = (projetId, fid) => {
    setProjets(ps => ps.map(p => p.id === projetId ? { ...p, fichiers: p.fichiers.filter(f => f.id !== fid) } : p));
  };

  // ── Navigation ──
  const nav = (p, d = null) => { setPage(p); setDetail(d); setSearch(""); setFiltre("Tous"); };

  // ─── SIDEBAR ─────────────────────────────────────────────────────────────
  const navItems = [
    { key: "dashboard", icon: "⬡", label: "Tableau de bord" },
    { key: "projets",   icon: "▤",  label: "Projets" },
    { key: "clients",   icon: "◎",  label: "Clients" },
    { key: "equipe",    icon: "◉",  label: "Équipe" },
    { key: "settings",  icon: "⚙",  label: "Paramètres" },
  ];

  const Sidebar = () => (
    <aside style={{
      width: sideOpen ? 220 : 0, minWidth: sideOpen ? 220 : 0,
      background: settings.couleur || T.slate, color: T.white,
      display: "flex", flexDirection: "column",
      transition: "width .2s, min-width .2s", overflow: "hidden",
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Brand */}
      <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <BKLogo size={36} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3, color: T.white }}>{settings.nom}</div>
            <div style={{ fontSize: 10, color: T.goldLt, letterSpacing: 1, textTransform: "uppercase" }}>{settings.sousTitre}</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => nav(n.key)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: page === n.key ? "rgba(184,151,58,0.22)" : "transparent",
              border: "none", borderRadius: 8, cursor: "pointer", color: page === n.key ? T.goldLt : "rgba(255,255,255,0.72)",
              fontWeight: page === n.key ? 700 : 500, fontSize: 13.5, textAlign: "left", width: "100%", fontFamily: "inherit",
              borderLeft: page === n.key ? `3px solid ${T.gold}` : "3px solid transparent",
              transition: "all .15s",
            }}>
            <span style={{ fontSize: 16, opacity: 0.9 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>
        BET KALEM © {new Date().getFullYear()}
      </div>
    </aside>
  );

  // ─── HEADER ──────────────────────────────────────────────────────────────
  const Header = ({ title, subtitle, action }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setSideOpen(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:T.muted, padding:4 }}>☰</button>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.ink }}>{title}</h1>
          {subtitle && <p style={{ margin: 0, fontSize: 13, color: T.muted }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );

  // ─── DASHBOARD ───────────────────────────────────────────────────────────
  const Dashboard = () => {
    const stats = [
      { label: "Projets actifs",  val: projets.filter(p => p.statut === "En cours").length,    color: T.green },
      { label: "Total projets",   val: projets.length,                                          color: T.steel },
      { label: "Clients",         val: clients.length,                                          color: T.gold  },
      { label: "Fichiers gérés",  val: projets.reduce((a, p) => a + p.fichiers.length, 0),      color: T.slate },
    ];
    const recents = [...projets].sort((a,b) => b.id.localeCompare(a.id)).slice(0, 4);
    return (
      <>
        <Header title={`Bonjour — ${settings.nom}`} subtitle={`${today()} · ${settings.sousTitre}`}
          action={<Btn onClick={() => setModal({ type: "newProjet" })} variant="gold">+ Nouveau projet</Btn>} />

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:28 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:T.white, borderRadius:12, padding:"20px 18px", boxShadow:"0 2px 8px rgba(0,0,0,.06)", borderTop:`4px solid ${s.color}` }}>
              <div style={{ fontSize:30, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:5, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent projects */}
        <div style={{ background:T.white, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:700, fontSize:14, color:T.ink }}>Projets récents</span>
            <Btn size="sm" variant="ghost" onClick={() => nav("projets")}>Voir tous</Btn>
          </div>
          {recents.map((p, i) => {
            const client = getClient(p.clientId);
            const resp = getMembre(p.responsable);
            return (
              <div key={p.id} onClick={() => { setDetail(p.id); setPage("projets"); }}
                style={{ padding:"14px 22px", borderBottom: i < recents.length-1 ? `1px solid ${T.sand}` : "none",
                  display:"flex", alignItems:"center", gap:14, cursor:"pointer",
                  transition:"background .1s", background:"transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = T.sand}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>{p.nom}</div>
                  <div style={{ fontSize:12, color:T.muted }}>{client?.nom} · {p.ville}</div>
                </div>
                <div style={{ fontSize:12, color:T.muted }}>{resp?.nom}</div>
                <Badge statut={p.statut} />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // ─── PROJETS LIST ─────────────────────────────────────────────────────────
  const ProjetsList = () => (
    <>
      <Header title="Projets" subtitle={`${projets.length} projets au total`}
        action={<Btn variant="gold" onClick={() => setModal({ type: "newProjet" })}>+ Nouveau projet</Btn>} />

      {/* Search + filter */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher…"
          style={{ flex:1, minWidth:200, padding:"9px 14px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit" }} />
        {["Tous", ...STATUTS].map(s => (
          <button key={s} onClick={() => setFiltre(s)}
            style={{ padding:"8px 14px", borderRadius:8, border:"none", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit",
              background: filtre===s ? T.slate : T.white, color: filtre===s ? T.white : T.muted,
              boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gap:10 }}>
        {projetsFiltres.map(p => {
          const client  = getClient(p.clientId);
          const resp    = getMembre(p.responsable);
          const roleMeta= ROLES_META[resp?.role];
          return (
            <div key={p.id} style={{ background:T.white, borderRadius:12, padding:"16px 20px", boxShadow:"0 1px 6px rgba(0,0,0,.06)",
              display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", cursor:"pointer", transition:"box-shadow .15s" }}
              onClick={() => setDetail(p.id)}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,.06)"}>
              <div style={{ width:4, alignSelf:"stretch", borderRadius:4, background: p.statut==="En cours"?T.green:p.statut==="Validé"?T.blue:p.statut==="Archivé"?T.muted:T.amber }} />
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontFamily:"monospace", fontSize:11, color:T.gold, fontWeight:700 }}>{p.id}</span>
                  <Badge statut={p.statut} />
                </div>
                <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{p.nom}</div>
                <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{client?.nom} · {p.ville} · {p.type}</div>
              </div>
              <div style={{ textAlign:"center", minWidth:100 }}>
                <div style={{ fontSize:18, color: roleMeta?.color }}>{roleMeta?.icon}</div>
                <div style={{ fontSize:12, fontWeight:600, color:T.ink }}>{resp?.nom}</div>
                <div style={{ fontSize:11, color:T.muted }}>{roleMeta?.label}</div>
              </div>
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.slate }}>{p.fichiers.length}</div>
                <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:0.5 }}>Fichiers</div>
              </div>
              <div style={{ display:"flex", gap:6 }} onClick={e => e.stopPropagation()}>
                <Btn size="sm" onClick={() => setModal({ type:"qr", qrText:`PROJET:${p.id}|${p.nom}|${client?.nom||""}|${p.statut}`, title:p.nom })}>⊡ QR</Btn>
                <Btn size="sm" variant="ghost" onClick={() => deleteProjet(p.id)}>✕</Btn>
              </div>
            </div>
          );
        })}
        {projetsFiltres.length === 0 && (
          <div style={{ textAlign:"center", padding:52, color:T.muted, fontSize:14 }}>Aucun projet trouvé.</div>
        )}
      </div>
    </>
  );

  // ─── PROJET DETAIL ────────────────────────────────────────────────────────
  const ProjetDetail = ({ id }) => {
    const p = projets.find(x => x.id === id);
    if (!p) return null;
    const client  = getClient(p.clientId);
    const resp    = getMembre(p.responsable);
    const [addF, setAddF] = useState(false);
    const [nf, setNf]     = useState({ nom:"", categorie:"Plans" });
    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState({ ...p });

    const save = () => { updateProjet(id, draft); setEditMode(false); };

    return (
      <>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <Btn size="sm" variant="ghost" onClick={() => setDetail(null)}>← Retour</Btn>
          <span style={{ fontFamily:"monospace", fontSize:12, color:T.gold, fontWeight:700 }}>{p.id}</span>
          <Badge statut={p.statut} />
          <div style={{ flex:1 }} />
          <Btn size="sm" variant="ghost" onClick={() => setEditMode(v => !v)}>{editMode ? "Annuler" : "✏ Modifier"}</Btn>
          <Btn size="sm" onClick={() => setModal({ type:"qr", qrText:`PROJET:${p.id}|${p.nom}|${client?.nom||""}|${p.statut}|${p.ville}`, title:p.nom })}>⊡ QR</Btn>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:18, alignItems:"start" }}>
          {/* Main */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Info card */}
            <div style={{ background:T.white, borderRadius:14, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
              {editMode ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <Input label="Nom du projet"  value={draft.nom}         onChange={v => setDraft({...draft, nom:v})} />
                  <Input label="Ville"           value={draft.ville}       onChange={v => setDraft({...draft, ville:v})} />
                  <Input label="Budget (DA)"     value={draft.budget}      onChange={v => setDraft({...draft, budget:v})} />
                  <Input label="Date début"      value={draft.dateDebut}   onChange={v => setDraft({...draft, dateDebut:v})} type="date" />
                  <Select label="Statut"         value={draft.statut}      onChange={v => setDraft({...draft, statut:v})}    options={STATUTS} />
                  <Select label="Type"           value={draft.type}        onChange={v => setDraft({...draft, type:v})}      options={TYPES_PROJ} />
                  <Select label="Responsable"    value={draft.responsable} onChange={v => setDraft({...draft, responsable:parseInt(v)})}
                    options={membres.map(m => ({ value:m.id, label:`${m.nom} — ${ROLES_META[m.role].label}` }))} />
                  <Select label="Client"         value={draft.clientId}    onChange={v => setDraft({...draft, clientId:v})}
                    options={clients.map(c => ({ value:c.id, label:c.nom }))} />
                  <div style={{ gridColumn:"1/-1" }}>
                    <Input label="Description" value={draft.description} onChange={v => setDraft({...draft, description:v})} />
                  </div>
                  <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
                    <Btn variant="gold" onClick={save}>Enregistrer</Btn>
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={{ margin:"0 0 12px", fontSize:22, color:T.ink }}>{p.nom}</h2>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10 }}>
                    {[
                      ["👤 Client",      client?.nom || "—"],
                      ["📍 Ville",        p.ville],
                      ["🏗 Type",         p.type],
                      ["📅 Début",        p.dateDebut],
                      ["💰 Budget",       p.budget ? `${Number(p.budget).toLocaleString("fr-FR")} DA` : "—"],
                      ["👷 Responsable",  resp?.nom || "—"],
                    ].map(([k,v]) => (
                      <div key={k} style={{ background:T.sand, borderRadius:8, padding:"10px 13px" }}>
                        <div style={{ fontSize:11, color:T.muted, marginBottom:2 }}>{k}</div>
                        <div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {p.description && (
                    <p style={{ margin:"14px 0 0", fontSize:13, color:T.muted, lineHeight:1.6 }}>{p.description}</p>
                  )}
                </>
              )}
            </div>

            {/* Fichiers */}
            <div style={{ background:T.white, borderRadius:14, padding:22, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>📂 Fichiers ({p.fichiers.length})</span>
                <Btn size="sm" variant="gold" onClick={() => setAddF(v => !v)}>+ Ajouter</Btn>
              </div>

              {addF && (
                <div style={{ background:T.sand, borderRadius:10, padding:16, marginBottom:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Input label="Nom du fichier" value={nf.nom} onChange={v => setNf({...nf, nom:v})} placeholder="Plan_RDC.pdf" />
                  <Select label="Catégorie" value={nf.categorie} onChange={v => setNf({...nf, categorie:v})} options={CATEGORIES} />
                  <div style={{ gridColumn:"1/-1", display:"flex", gap:8 }}>
                    <Btn onClick={() => { if(nf.nom){ addFichier(id, nf); setNf({nom:"",categorie:"Plans"}); setAddF(false); }}} variant="gold" size="sm">Enregistrer</Btn>
                    <Btn onClick={() => setAddF(false)} variant="ghost" size="sm">Annuler</Btn>
                  </div>
                </div>
              )}

              {CATEGORIES.map(cat => {
                const list = p.fichiers.filter(f => f.categorie === cat);
                if (!list.length) return null;
                return (
                  <div key={cat} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:6, paddingLeft:2 }}>{cat}</div>
                    {list.map(f => (
                      <div key={f.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 13px", background:T.sand, borderRadius:8, marginBottom:5 }}>
                        <span style={{ fontSize:16 }}>{f.nom.endsWith(".pdf")?"📄":f.nom.endsWith(".dwg")?"📐":f.nom.endsWith(".xlsx")?"📊":"📎"}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13, color:T.ink }}>{f.nom}</div>
                          <div style={{ fontSize:11, color:T.muted }}>{f.date} · {f.taille}</div>
                        </div>
                        <span style={{ fontFamily:"monospace", fontSize:10, color:T.gold, background:"#fdf8ee", padding:"2px 7px", borderRadius:5 }}>{f.id}</span>
                        <button onClick={() => setModal({ type:"qr", qrText:`FICHIER:${f.id}|${id}|${f.nom}|${f.categorie}|${f.date}`, title:f.nom })}
                          style={{ background:T.slate, color:T.white, border:"none", width:28, height:28, borderRadius:6, cursor:"pointer", fontSize:12 }}>⊡</button>
                        <button onClick={() => deleteFichier(id, f.id)}
                          style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:14, padding:"0 4px" }}>✕</button>
                      </div>
                    ))}
                  </div>
                );
              })}
              {p.fichiers.length === 0 && !addF && (
                <div style={{ textAlign:"center", padding:32, color:T.muted, fontSize:13 }}>Aucun fichier. Commencez par en ajouter un.</div>
              )}
            </div>
          </div>

          {/* Sidebar QR */}
          <div style={{ background:T.slate, borderRadius:14, padding:22, color:T.white, textAlign:"center", position:"sticky", top:20 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.goldLt, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>QR Code Projet</div>
            <img src={qrUrl(`PROJET:${p.id}|${p.nom}|${client?.nom||""}|${p.statut}`, 160)} alt="QR" width={160} height={160}
              style={{ borderRadius:10, border:`2px solid ${T.goldLt}`, display:"block", margin:"0 auto 14px" }} />
            <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", lineHeight:1.8 }}>
              <div style={{ color:T.goldLt, fontWeight:700 }}>{p.id}</div>
              <div>{p.type} · {p.ville}</div>
              <div>{client?.nom}</div>
            </div>
            <div style={{ marginTop:14, borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:14 }}>
              <div style={{ fontSize:10, color:T.goldLt, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Client</div>
              {client ? (
                <div style={{ fontSize:12, color:"rgba(255,255,255,.75)", lineHeight:1.9 }}>
                  <div style={{ fontWeight:700, color:T.white }}>{client.nom}</div>
                  <div>📞 {client.tel || "—"}</div>
                  <div>✉ {client.email || "—"}</div>
                </div>
              ) : <div style={{ fontSize:12, color:T.muted }}>—</div>}
            </div>
          </div>
        </div>
      </>
    );
  };

  // ─── CLIENTS ──────────────────────────────────────────────────────────────
  const Clients = () => {
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId]   = useState(null);
    const [draft, setDraft]     = useState({ nom:"", tel:"", email:"", ville:"", type:"Particulier", note:"" });
    const [editDraft, setEditDraft] = useState({});

    const clientsFiltres = clients.filter(c =>
      c.nom.toLowerCase().includes(search.toLowerCase()) || c.ville.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <>
        <Header title="Clients" subtitle={`${clients.length} fiches clients`}
          action={<Btn variant="gold" onClick={() => setShowAdd(v => !v)}>+ Nouveau client</Btn>} />

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher un client…"
          style={{ width:"100%", marginBottom:18, padding:"9px 14px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />

        {showAdd && (
          <div style={{ background:T.white, borderRadius:14, padding:24, marginBottom:20, boxShadow:"0 2px 12px rgba(0,0,0,.08)" }}>
            <h3 style={{ margin:"0 0 18px", fontSize:15, color:T.ink }}>Nouveau client</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Input label="Nom complet / Société" value={draft.nom}   onChange={v => setDraft({...draft, nom:v})} />
              <Input label="Téléphone"              value={draft.tel}   onChange={v => setDraft({...draft, tel:v})} />
              <Input label="Email"                  value={draft.email} onChange={v => setDraft({...draft, email:v})} />
              <Input label="Ville"                  value={draft.ville} onChange={v => setDraft({...draft, ville:v})} />
              <Select label="Type" value={draft.type} onChange={v => setDraft({...draft, type:v})} options={["Particulier","Société","Promoteur","Administration"]} />
              <Input label="Note" value={draft.note} onChange={v => setDraft({...draft, note:v})} />
              <div style={{ gridColumn:"1/-1", display:"flex", gap:8 }}>
                <Btn variant="gold" onClick={() => { if(draft.nom){ addClient(draft); setDraft({nom:"",tel:"",email:"",ville:"",type:"Particulier",note:""}); setShowAdd(false); }}}>Enregistrer</Btn>
                <Btn variant="ghost" onClick={() => setShowAdd(false)}>Annuler</Btn>
              </div>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gap:12 }}>
          {clientsFiltres.map(c => {
            const projetsClient = projets.filter(p => p.clientId === c.id);
            const isEdit = editId === c.id;
            return (
              <div key={c.id} style={{ background:T.white, borderRadius:12, padding:"18px 22px", boxShadow:"0 1px 6px rgba(0,0,0,.06)" }}>
                {isEdit ? (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <Input label="Nom" value={editDraft.nom}   onChange={v => setEditDraft({...editDraft, nom:v})} />
                    <Input label="Tél" value={editDraft.tel}   onChange={v => setEditDraft({...editDraft, tel:v})} />
                    <Input label="Email" value={editDraft.email} onChange={v => setEditDraft({...editDraft, email:v})} />
                    <Input label="Ville" value={editDraft.ville} onChange={v => setEditDraft({...editDraft, ville:v})} />
                    <Input label="Note" value={editDraft.note}  onChange={v => setEditDraft({...editDraft, note:v})} />
                    <div style={{ gridColumn:"1/-1", display:"flex", gap:8 }}>
                      <Btn size="sm" variant="gold" onClick={() => { updateClient(c.id, editDraft); setEditId(null); }}>Enregistrer</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => setEditId(null)}>Annuler</Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                    <div style={{ width:44, height:44, borderRadius:"50%", background: T.sand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:T.gold, flexShrink:0 }}>
                      {c.nom[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:160 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{c.nom}</div>
                      <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>
                        {c.tel && <span>📞 {c.tel} · </span>}
                        {c.ville && <span>📍 {c.ville} · </span>}
                        <span>{c.type}</span>
                      </div>
                      {c.note && <div style={{ fontSize:12, color:T.muted, marginTop:3, fontStyle:"italic" }}>{c.note}</div>}
                    </div>
                    <div style={{ textAlign:"center", minWidth:60 }}>
                      <div style={{ fontWeight:800, fontSize:18, color:T.steel }}>{projetsClient.length}</div>
                      <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase" }}>Projets</div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <Btn size="sm" onClick={() => setModal({ type:"qr", qrText:`CLIENT:${c.id}|${c.nom}|${c.tel}|${c.email}|${c.ville}`, title:c.nom })}>⊡ QR</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => { setEditId(c.id); setEditDraft({...c}); }}>✏</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => deleteClient(c.id)}>✕</Btn>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {clientsFiltres.length === 0 && (
            <div style={{ textAlign:"center", padding:48, color:T.muted }}>Aucun client trouvé.</div>
          )}
        </div>
      </>
    );
  };

  // ─── EQUIPE ───────────────────────────────────────────────────────────────
  const Equipe = () => {
    const [editId, setEditId]   = useState(null);
    const [editDraft, setEditDraft] = useState({});
    const grouped = Object.keys(ROLES_META).map(role => ({
      role, meta: ROLES_META[role], list: membres.filter(m => m.role === role),
    })).filter(g => g.list.length > 0);
    return (
      <>
        <Header title="Équipe" subtitle={`${membres.length} membres · Bet Kalem`} />
        {grouped.map(g => (
          <div key={g.role} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <span style={{ fontSize:20, color:g.meta.color }}>{g.meta.icon}</span>
              <span style={{ fontWeight:800, fontSize:14, color:T.ink, textTransform:"uppercase", letterSpacing:0.8 }}>{g.meta.label}s</span>
              <span style={{ background:T.sand, color:T.muted, padding:"2px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>{g.list.length}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
              {g.list.map(m => {
                const nbProjets = projets.filter(p => p.responsable === m.id).length;
                const isEdit = editId === m.id;
                return (
                  <div key={m.id} style={{ background:T.white, borderRadius:12, padding:20, boxShadow:"0 1px 6px rgba(0,0,0,.06)", borderTop:`3px solid ${g.meta.color}` }}>
                    {isEdit ? (
                      <div style={{ display:"grid", gap:10 }}>
                        <Input label="Nom" value={editDraft.nom}    onChange={v => setEditDraft({...editDraft, nom:v})} />
                        <Input label="Prénom" value={editDraft.prenom} onChange={v => setEditDraft({...editDraft, prenom:v})} />
                        <Input label="Tél" value={editDraft.tel}    onChange={v => setEditDraft({...editDraft, tel:v})} />
                        <Input label="Email" value={editDraft.email}  onChange={v => setEditDraft({...editDraft, email:v})} />
                        <Input label="Note" value={editDraft.note}   onChange={v => setEditDraft({...editDraft, note:v})} />
                        <div style={{ display:"flex", gap:8 }}>
                          <Btn size="sm" variant="gold" onClick={() => { updateMembre(m.id, editDraft); setEditId(null); }}>Enregistrer</Btn>
                          <Btn size="sm" variant="ghost" onClick={() => setEditId(null)}>Annuler</Btn>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                          <div style={{ width:44, height:44, borderRadius:"50%", background:g.meta.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:T.white, fontWeight:800 }}>
                            {m.nom[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, color:T.ink, fontSize:14 }}>{m.prenom} {m.nom}</div>
                            <div style={{ fontSize:11, color:g.meta.color, fontWeight:600 }}>{g.meta.label}</div>
                          </div>
                        </div>
                        {(m.tel || m.email) && (
                          <div style={{ fontSize:12, color:T.muted, marginBottom:10, lineHeight:1.8 }}>
                            {m.tel   && <div>📞 {m.tel}</div>}
                            {m.email && <div>✉ {m.email}</div>}
                            {m.note  && <div style={{ fontStyle:"italic" }}>{m.note}</div>}
                          </div>
                        )}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:T.sand, borderRadius:8, marginBottom:12 }}>
                          <span style={{ fontSize:12, color:T.muted }}>Projets responsable</span>
                          <strong style={{ color:T.ink }}>{nbProjets}</strong>
                        </div>
                        <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
                          <img src={qrUrl(`MEMBRE:${m.id}|${m.nom}|${g.meta.label}|${m.tel}|${m.email}`, 100)} alt="QR" width={100} height={100}
                            style={{ borderRadius:8, border:`1.5px solid ${T.border}` }} />
                        </div>
                        <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                          <Btn size="sm" variant="ghost" onClick={() => { setEditId(m.id); setEditDraft({...m}); }}>✏ Modifier</Btn>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  };

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  const Settings = () => {
    const [draft, setDraft] = useState({ ...settings });
    return (
      <>
        <Header title="Paramètres" subtitle="Personnaliser Bet Kalem" />
        <div style={{ maxWidth:520, background:T.white, borderRadius:14, padding:30, boxShadow:"0 2px 10px rgba(0,0,0,.07)" }}>
          <h3 style={{ margin:"0 0 20px", fontSize:15, color:T.ink }}>Identité du bureau</h3>
          <div style={{ display:"grid", gap:16 }}>
            <Input label="Nom du bureau" value={draft.nom} onChange={v => setDraft({...draft, nom:v})} />
            <Input label="Sous-titre"   value={draft.sousTitre} onChange={v => setDraft({...draft, sousTitre:v})} />
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:6 }}>Couleur principale</label>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["#1C2B3A","#2D3E50","#1a1a2e","#1B4332","#7B341E","#4A1942"].map(col => (
                  <button key={col} onClick={() => setDraft({...draft, couleur:col})}
                    style={{ width:36, height:36, borderRadius:8, background:col, border: draft.couleur===col ? `3px solid ${T.gold}` : "3px solid transparent", cursor:"pointer" }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Aperçu logo</div>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:draft.couleur, borderRadius:10, width:"fit-content" }}>
                <BKLogo size={34} />
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:T.white }}>{draft.nom || "Bet Kalem"}</div>
                  <div style={{ fontSize:10, color:T.goldLt, letterSpacing:1, textTransform:"uppercase" }}>{draft.sousTitre}</div>
                </div>
              </div>
            </div>
            <Btn variant="gold" onClick={() => setSettings(draft)}>Appliquer les changements</Btn>
          </div>
        </div>
      </>
    );
  };

  // ─── MODALS ───────────────────────────────────────────────────────────────
  const ModalQR = ({ qrText, title }) => (
    <div style={{ padding:32, textAlign:"center" }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>QR Code</div>
      <h3 style={{ margin:"0 0 20px", fontSize:18, color:T.ink }}>{title}</h3>
      <img src={qrUrl(qrText, 220)} alt="QR" width={220} height={220}
        style={{ borderRadius:12, border:`2px solid ${T.gold}`, display:"block", margin:"0 auto 20px" }} />
      <div style={{ background:T.sand, borderRadius:10, padding:"12px 18px", display:"inline-block", fontSize:12, color:T.muted, fontFamily:"monospace", wordBreak:"break-all", maxWidth:320, textAlign:"left" }}>
        {qrText}
      </div>
      <div style={{ marginTop:20 }}>
        <Btn onClick={() => setModal(null)}>Fermer</Btn>
      </div>
    </div>
  );

  const NewProjetModal = () => {
    const [d, setD] = useState({ nom:"", clientId: clients[0]?.id||"", ville:"", type:"Résidentiel", statut:"En cours", responsable:membres[1]?.id||1, dateDebut:today(), budget:"", description:"" });
    return (
      <div style={{ padding:30 }}>
        <h3 style={{ margin:"0 0 20px", fontSize:17, color:T.ink }}>Nouveau projet</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <Input label="Nom du projet" value={d.nom} onChange={v => setD({...d, nom:v})} placeholder="ex: Villa Belcourt" />
          </div>
          <Select label="Client" value={d.clientId} onChange={v => setD({...d, clientId:v})}
            options={clients.map(c => ({ value:c.id, label:c.nom }))} />
          <Input label="Ville" value={d.ville} onChange={v => setD({...d, ville:v})} />
          <Select label="Type" value={d.type} onChange={v => setD({...d, type:v})} options={TYPES_PROJ} />
          <Select label="Statut" value={d.statut} onChange={v => setD({...d, statut:v})} options={STATUTS} />
          <Input label="Budget (DA)" value={d.budget} onChange={v => setD({...d, budget:v})} placeholder="50 000 000" />
          <Input label="Date de début" value={d.dateDebut} onChange={v => setD({...d, dateDebut:v})} type="date" />
          <Select label="Responsable" value={d.responsable} onChange={v => setD({...d, responsable:parseInt(v)})}
            options={membres.map(m => ({ value:m.id, label:`${m.nom} — ${ROLES_META[m.role].label}` }))} />
          <div style={{ gridColumn:"1/-1" }}>
            <Input label="Description" value={d.description} onChange={v => setD({...d, description:v})} placeholder="Courte description du projet" />
          </div>
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <Btn variant="gold" onClick={() => { if(d.nom && d.clientId){ addProjet(d); setModal(null); } }}>Créer le projet</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)}>Annuler</Btn>
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.sand, fontFamily:"'Helvetica Neue', Arial, sans-serif" }}>
      <Sidebar />

      <main style={{ flex:1, overflowY:"auto", padding:"28px 28px 40px", minWidth:0 }}>
        {page === "dashboard" && <Dashboard />}
        {page === "projets"   && (detail ? <ProjetDetail id={detail} /> : <ProjetsList />)}
        {page === "clients"   && <Clients />}
        {page === "equipe"    && <Equipe />}
        {page === "settings"  && <Settings />}
      </main>

      {modal?.type === "qr" && (
        <Overlay onClose={() => setModal(null)}>
          <ModalQR qrText={modal.qrText} title={modal.title} />
        </Overlay>
      )}
      {modal?.type === "newProjet" && (
        <Overlay onClose={() => setModal(null)}>
          <NewProjetModal />
        </Overlay>
      )}
    </div>
  );
}
