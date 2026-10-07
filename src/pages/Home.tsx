import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  ClipboardList,
  IdCard,
  BarChart3,
  Medal,
  Star,
  Bell,
  Search,
  Plus,
  Share2,
  MapPin,
  Award,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

/* ----------------------------- Tipos y datos ----------------------------- */

interface NavItem {
  label: string;
  to: string;
}

interface MenuItem {
  icon: ReactNode;
  label: string;
  to: string;
  badge?: string;
  active?: boolean;
}

interface Concurso {
  nombre: string;
  fecha: string;
}

const NAV_TABS: NavItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Concursos", to: "/concursos" },
  { label: "Bailarines", to: "/bailarines" },
  { label: "Ranking", to: "/ranking" },
];

const MENU: MenuItem[] = [
  { icon: <User size={18} />, label: "Mi Perfil", to: "/perfil", active: true },
  { icon: <Heart size={18} />, label: "Mi Pareja", to: "/mi-pareja", badge: "Pendiente" },
  { icon: <ClipboardList size={18} />, label: "Mis Inscripciones", to: "/inscripciones" },
  { icon: <IdCard size={18} />, label: "Mi Credencial Digital", to: "/credencial" },
  { icon: <BarChart3 size={18} />, label: "Mi Trayectoria & Resultados", to: "#" },
  { icon: <Medal size={18} />, label: "Mis Logros & Insignias", to: "#" },
  { icon: <Star size={18} />, label: "Mis Admiradores (1,280)", to: "#" },
];

const PROXIMOS: Concurso[] = [
  { nombre: "Selectivo Lima Norte", fecha: "15 Nov 2026 • Cierra en 10 días" },
  { nombre: "Selectivo Arequipa", fecha: "05 Dic 2026 • Próximamente" },
];

/* ------------------------------ Componentes ------------------------------ */

function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent bg-primary text-xs text-white ${className}`}
    >
      {initials}
    </div>
  );
}

function Widget({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4 shadow-sm2">
      <div className="mb-3 flex items-center justify-between border-b border-line pb-2 font-display text-base">
        <span>{title}</span>
        {aside}
      </div>
      {children}
    </div>
  );
}

/* --------------------------- Topbar + MobileMenu -------------------------- */

function Topbar({
  onMenuClick,
  onAvatarClick,
  avatarOpen,
}: {
  onMenuClick: () => void;
  onAvatarClick: () => void;
  avatarOpen: boolean;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex h-[60px] items-center justify-between border-b border-line bg-surface px-4 shadow-sm2 md:px-6">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa - solo móvil */}
        <button
          onClick={onMenuClick}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line bg-cream lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="font-display text-lg font-bold text-primary no-underline md:text-xl">
          🎗️ ENTRE PAÑUELOS
        </Link>

        <label className="hidden w-[280px] items-center rounded-[20px] border border-line bg-cream px-3 py-1.5 md:flex">
          <Search size={16} className="text-ink-muted" />
          <input
            type="text"
            placeholder="Buscar bailarines, parejas, concursos..."
            className="ml-1.5 w-full border-none bg-transparent text-[13px] outline-none"
          />
        </label>
      </div>

      <nav className="hidden gap-2 lg:flex">
        {NAV_TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === "/"}
            className={({ isActive }) =>
              `rounded-lg px-5 py-2 text-sm no-underline transition ${
                isActive ? "bg-blush font-semibold text-primary" : "font-medium text-ink-muted"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line bg-cream text-base">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            5
          </span>
        </button>

        {/* Avatar desktop */}
        <Link
          to="/public"
          className="hidden items-center gap-2 rounded-[20px] px-2 py-1 text-sm font-medium no-underline sm:flex"
        >
          <Avatar initials="SM" />
          <span>Sofia M.</span>
        </Link>

        {/* Avatar móvil con dropdown */}
        <button
          onClick={onAvatarClick}
          className="flex items-center gap-1 rounded-full sm:hidden"
          aria-label="Abrir menú de usuario"
        >
          <Avatar initials="SM" />
          <ChevronDown
            size={14}
            className={`text-ink-muted transition-transform ${avatarOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </header>
  );
}

/* ---------------------- Dropdown de usuario (móvil) ---------------------- */

function UserDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    // Aquí iría tu lógica de logout (limpiar token, etc.)
    navigate("/login");
  };

  return (
    <>
      {/* Overlay para cerrar al hacer click fuera */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[105] sm:hidden ${open ? "block" : "hidden"}`}
      />

      <div
        className={`fixed right-3 top-[68px] z-[110] w-[260px] origin-top-right overflow-hidden rounded-card border border-line bg-surface shadow-xl transition-all duration-200 sm:hidden ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Cabecera del usuario */}
        <div className="flex items-center gap-3 border-b border-line bg-cream p-4">
          <Avatar initials="SM" className="!h-10 !w-10 !text-sm" />
          <div>
            <strong className="block text-sm">Sofia Martínez</strong>
            <span className="text-[11px] text-ink-muted">Bailarina • Categoría Adultos</span>
          </div>
        </div>

        {/* Opciones del bailarín */}
        <div className="flex flex-col p-2">
          {MENU.map((m) => (
            <Link
              key={m.label}
              to={m.to}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-btn px-3 py-2.5 text-[13px] no-underline transition hover:bg-sand ${
                m.active ? "bg-sand font-semibold text-primary" : "font-medium text-ink"
              }`}
            >
              {m.icon} {m.label}
              {m.badge && (
                <span className="ml-auto rounded-[10px] bg-primary px-1.5 py-0.5 text-[10px] text-white">
                  {m.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Opciones secundarias */}
        <div className="flex flex-col border-t border-line p-2">
          <Link
            to="/configuracion"
            onClick={onClose}
            className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-[13px] font-medium text-ink no-underline transition hover:bg-sand"
          >
            <Settings size={18} /> Configuración
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ MobileDrawer ------------------------------ */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-[120] h-full w-[300px] max-w-[85vw] overflow-y-auto bg-surface shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between border-b border-line p-4">
          <Link to="/" onClick={onClose} className="font-display text-lg font-bold text-primary no-underline">
            🎗️ ENTRE PAÑUELOS
          </Link>
          <button
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-cream"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Buscador móvil */}
        <div className="border-b border-line p-4">
          <label className="flex w-full items-center rounded-[20px] border border-line bg-cream px-3 py-2">
            <Search size={16} className="text-ink-muted" />
            <input
              type="text"
              placeholder="Buscar..."
              className="ml-1.5 w-full border-none bg-transparent text-[13px] outline-none"
            />
          </label>
        </div>

        {/* Navegación principal */}
        <nav className="flex flex-col gap-1 border-b border-line p-4">
          {NAV_TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2.5 text-sm no-underline transition ${
                  isActive ? "bg-blush font-semibold text-primary" : "font-medium text-ink-muted"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        {/* Menú del usuario */}
        

        {/* Widgets (RightBar) dentro del drawer */}
        <div className="flex flex-col gap-4 border-t border-line p-4">
          <Widget title="Mi Nivel Competitivo" aside={<span className="text-base text-accent">★★★★★</span>}>
            <p className="mb-3 text-[13px] text-ink-muted">
              Categoría Adultos • Nivel 5 de 5 estrellas de trayectoria oficial.
            </p>
            <Link
              to="/credencial"
              onClick={onClose}
              className="inline-block w-full rounded-btn bg-accent px-4 py-2 text-center text-[13px] font-medium text-ink no-underline"
            >
              Ver Mi Credencial Digital
            </Link>
          </Widget>

          <Widget title="Invitación de Pareja" aside={<span className="text-xs text-primary">1 Nueva</span>}>
            <div className="mb-3 flex items-center gap-2.5">
              <Avatar initials="LV" />
              <div className="text-[13px]">
                <strong>Luis Valderrama</strong>
                <p className="text-[11px] text-ink-muted">Te invitó para: Selectivo Arequipa</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-btn bg-primary px-4 py-2 text-[13px] font-medium text-white hover:bg-primary-hover">
                Aceptar
              </button>
              <button className="flex-1 rounded-btn bg-line px-4 py-2 text-[13px] font-medium">Rechazar</button>
            </div>
          </Widget>

          <Widget title="Próximos Concursos">
            <ul className="flex list-none flex-col gap-2.5 text-[13px]">
              {PROXIMOS.map((c, i) => (
                <li key={c.nombre} className={i < PROXIMOS.length - 1 ? "border-b border-line pb-2" : ""}>
                  <strong>{c.nombre}</strong>
                  <p className="text-[11px] text-ink-muted">{c.fecha}</p>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------ Sidebar (desktop) ------------------------- */

function Sidebar() {
  return (
    <aside className="sticky top-20 hidden flex-col gap-1 self-start lg:flex">
      {MENU.map((m) => (
        <Link
          key={m.label}
          to={m.to}
          className={`flex items-center gap-3 rounded-btn px-3.5 py-2.5 text-sm no-underline transition hover:bg-sand ${
            m.active ? "bg-sand font-semibold text-primary" : "font-medium text-ink"
          }`}
        >
          {m.icon} {m.label}
          {m.badge && (
            <span className="ml-auto rounded-[10px] bg-primary px-1.5 py-0.5 text-[10px] text-white">
              {m.badge}
            </span>
          )}
        </Link>
      ))}
    </aside>
  );
}

/* ------------------------------- Contenido -------------------------------- */

function PostBox() {
  return (
    <div className="rounded-card border border-line bg-surface p-4 shadow-sm2">
      <div className="flex gap-3">
        <Avatar initials="SM" />
        <input
          type="text"
          placeholder="¿Listo para la pista? Busca tu próximo concurso o pareja..."
          className="flex-1 cursor-pointer rounded-[20px] border border-line bg-cream px-4 py-2.5 text-sm outline-none"
        />
      </div>
    </div>
  );
}

function ConcursoPost() {
  const navigate = useNavigate();

  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-sm2">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar initials="CL" className="!bg-accent" />
          <div>
            <h4 className="mb-0.5 text-[15px]">Club Libertad Trujillo • Concurso Oficial</h4>
            <p className="flex items-center gap-1 text-xs text-ink-muted">
              Hace 2 horas • <MapPin size={12} /> Trujillo, Perú
            </p>
          </div>
        </div>
        <span className="rounded-xl bg-[#EAF5EF] px-2 py-1 text-xs font-medium text-success">
          Inscripciones Abiertas
        </span>
      </div>

      <p className="px-4 pb-4 text-sm leading-normal">
        <strong>¡Se abrieron las inscripciones oficiales!</strong> Te invitamos a participar en el 64.° Concurso
        Nacional y 14.° Internacional de Marinera 2027.
      </p>

      <div className="flex h-[260px] w-full items-center justify-center border-y border-line bg-[#E2D7C3] italic text-ink-muted">
        <img src="publix.jpg" alt=""  className="h-full w-full object-cover"/>
      </div>

      <div className="flex border-t border-line px-2 py-1">
        <button
          onClick={() => navigate("/inscripcion/paso-1")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md p-2 text-[13px] font-semibold text-primary hover:bg-cream"
        >
          <Plus size={16} /> Inscribirme Ahora
        </button>
      </div>
    </article>
  );
}

function LogroPost() {
  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-sm2">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar initials="RM" />
          <div>
            <h4 className="mb-0.5 text-[15px]">Rodrigo Morales</h4>
            <p className="text-xs text-ink-muted">Ayer a las 18:30 • Categoría Adultos</p>
          </div>
        </div>
      </div>

      <p className="px-4 pb-4 text-sm leading-normal">
        VAS A CAER LOPEZZZZZZ{" "}
        <Award size={16} className="inline text-accent" /> Gracias a todos los admiradores por su apoyo constante en
        la pista.
      </p>

      <div className="flex border-t border-line px-2 py-1">
        {[
          { label: "Admirar (240)", icon: <Heart size={16} /> },
          { label: "Compartir", icon: <Share2 size={16} /> },
        ].map((item) => (
          <button
            key={item.label}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md p-2 text-[13px] font-medium text-ink-muted hover:bg-cream hover:text-primary"
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </article>
  );
}

/* ------------------------------ RightBar (desktop) ------------------------ */

function RightBar() {
  return (
    <aside className="sticky top-20 hidden flex-col gap-5 self-start lg:flex">
      <Widget title="Mi Nivel Competitivo" aside={<span className="text-base text-accent">★★★★★</span>}>
        <p className="mb-3 text-[13px] text-ink-muted">
          Categoría Adultos • Nivel 5 de 5 estrellas de trayectoria oficial.
        </p>
        <Link
          to="/credencial"
          className="inline-block w-full rounded-btn bg-accent px-4 py-2 text-center text-[13px] font-medium text-ink no-underline"
        >
          Ver Mi Credencial Digital
        </Link>
      </Widget>

      <Widget title="Invitación de Pareja" aside={<span className="text-xs text-primary">1 Nueva</span>}>
        <div className="mb-3 flex items-center gap-2.5">
          <Avatar initials="LV" />
          <div className="text-[13px]">
            <strong>Luis Valderrama</strong>
            <p className="text-[11px] text-ink-muted">Te invitó para: Selectivo Arequipa</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-btn bg-primary px-4 py-2 text-[13px] font-medium text-white hover:bg-primary-hover">
            Aceptar
          </button>
          <button className="flex-1 rounded-btn bg-line px-4 py-2 text-[13px] font-medium">Rechazar</button>
        </div>
      </Widget>

      <Widget title="Próximos Concursos">
        <ul className="flex list-none flex-col gap-2.5 text-[13px]">
          {PROXIMOS.map((c, i) => (
            <li key={c.nombre} className={i < PROXIMOS.length - 1 ? "border-b border-line pb-2" : ""}>
              <strong>{c.nombre}</strong>
              <p className="text-[11px] text-ink-muted">{c.fecha}</p>
            </li>
          ))}
        </ul>
      </Widget>
    </aside>
  );
}

/* --------------------------------- Página -------------------------------- */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const toggleAvatar = () => {
    setAvatarOpen((v) => !v);
    if (menuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
    if (avatarOpen) setAvatarOpen(false);
  };

  return (
    <>
      <Topbar
        onMenuClick={toggleMenu}
        onAvatarClick={toggleAvatar}
        avatarOpen={avatarOpen}
      />
      <UserDropdown open={avatarOpen} onClose={() => setAvatarOpen(false)} />
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="mx-auto mb-8 mt-20 grid max-w-[1320px] grid-cols-1 gap-6 px-4 lg:grid-cols-[280px_1fr_340px]">
        <Sidebar />
        <main className="flex flex-col gap-5">
          <PostBox />
          <ConcursoPost />
          <LogroPost />
        </main>
        <RightBar />
      </div>
    </>
  );
}
