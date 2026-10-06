import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

/* ----------------------------- Tipos y datos ----------------------------- */

interface NavItem {
  label: string;
  to: string;
}

interface MenuItem {
  icon: string;
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
  { icon: "👤", label: "Mi Perfil", to: "/perfil", active: true },
  { icon: "💃", label: "Mi Pareja", to: "/mi-pareja", badge: "Pendiente" },
  { icon: "📋", label: "Mis Inscripciones", to: "/inscripciones" },
  { icon: "🆔", label: "Mi Credencial Digital", to: "/credencial" },
  { icon: "📊", label: "Mi Trayectoria & Resultados", to: "#" },
  { icon: "🏅", label: "Mis Logros & Insignias", to: "#" },
  { icon: "⭐", label: "Mis Admiradores (1,280)", to: "#" },
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

function Topbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex h-[60px] items-center justify-between border-b border-line bg-surface px-6 shadow-sm2">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-display text-xl font-bold text-primary no-underline">
          🎗️ ENTRE PAÑUELOS
        </Link>
        <label className="hidden w-[280px] items-center rounded-[20px] border border-line bg-cream px-3 py-1.5 md:flex">
          🔍
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
          🔔
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            5
          </span>
        </button>
        <Link to="/public" className="flex items-center gap-2 rounded-[20px] px-2 py-1 text-sm font-medium no-underline">
          <Avatar initials="SM" />
          <span>Sofia M.</span>
        </Link>
      </div>
    </header>
  );
}

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
            <p className="text-xs text-ink-muted">Hace 2 horas • 📍 Trujillo, Perú</p>
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
        [ Afiche Oficial del Evento - Coliseo Gran Chimú ]
      </div>

      <div className="flex border-t border-line px-2 py-1">
        <button
          onClick={() => navigate("/inscripcion/paso-1")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md p-2 text-[13px] font-semibold text-primary hover:bg-cream"
        >
          ➕ Inscribirme Ahora
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
        ¡Orgulloso de obtener el 1.º Lugar (Oro) en el Selectivo Lima Norte junto a Camila Vargas! 🏆✨ Gracias a
        todos los admiradores por su apoyo constante en la pista.
      </p>

      <div className="flex border-t border-line px-2 py-1">
        {["🎗️ Admirar (240)", "↗️ Compartir"].map((label) => (
          <button
            key={label}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md p-2 text-[13px] font-medium text-ink-muted hover:bg-cream hover:text-primary"
          >
            {label}
          </button>
        ))}
      </div>
    </article>
  );
}

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
  return (
    <>
      <Topbar />
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