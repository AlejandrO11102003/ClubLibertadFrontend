import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, RegistroBailarinRequest } from "../services/api";

type Alerta = { tipo: "error" | "exito"; texto: string } | null;

const CATEGORIAS_MARINERA = [
  "Pre-Infante (hasta 6 años)",
  "Infante (7 a 9 años)",
  "Infantil (10 a 13 años)",
  "Junior (14 a 17 años)",
  "Juvenil (18 a 21 años)",
  "Adultos (22 a 34 años)",
  "Senior (35 a 49 años)",
  "Master (50 a 64 años)",
  "Oro (65 años a más)",
];

const inputBase =
  "w-full rounded-btn border-[1.5px] bg-cream py-[11px] px-3.5 text-sm text-ink outline-none transition placeholder:text-[#A8A199] focus:bg-white focus:shadow-[0_0_0_3px_rgba(155,27,48,0.10)]";

export default function RegistroBailarin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "Femenino",
    categoria: "Adultos (22 a 34 años)",
    clubAcademia: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });

  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<Alerta>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errores[name]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[name];
        return nuevos;
      });
    }
    setAlerta(null);
  };

  const handleDniChange = (e: ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "").slice(0, 8);
    setForm((prev) => ({ ...prev, dni: soloNumeros }));
    if (errores.dni) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos.dni;
        return nuevos;
      });
    }
  };

  const handleTelefonoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "").slice(0, 9);
    setForm((prev) => ({ ...prev, telefono: soloNumeros }));
  };

  const validarFormulario = () => {
    const err: Record<string, string> = {};

    if (!/^\d{8}$/.test(form.dni.trim())) {
      err.dni = "El DNI debe tener exactamente 8 dígitos.";
    }

    if (!form.nombres.trim()) {
      err.nombres = "Ingresa tus nombres.";
    }

    if (!form.apellidos.trim()) {
      err.apellidos = "Ingresa tus apellidos.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      err.email = "Ingresa un correo electrónico válido.";
    }

    if (form.password.length < 6) {
      err.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (!form.aceptaTerminos) {
      err.aceptaTerminos = "Debes aceptar los términos y condiciones.";
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setAlerta({
        tipo: "error",
        texto: "Por favor revisa y completa los campos obligatorios.",
      });
      return;
    }

    setCargando(true);
    setAlerta(null);

    const payload: RegistroBailarinRequest = {
      dni: form.dni.trim(),
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim() || undefined,
      fechaNacimiento: form.fechaNacimiento || undefined,
      genero: form.genero,
      categoria: form.categoria,
      clubAcademia: form.clubAcademia.trim() || undefined,
      password: form.password,
    };

    try {
      await authService.registrarBailarin(payload);

      setAlerta({
        tipo: "exito",
        texto: "¡Registro exitoso como bailarín! Redirigiendo al inicio de sesión…",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const mensaje =
        err?.message ||
        err?.data?.mensaje ||
        err?.data?.message ||
        "No se pudo completar el registro. Verifica los datos o intenta más tarde.";
      setAlerta({ tipo: "error", texto: mensaje });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden md:grid-cols-12">
      {/* ------------------------- Panel izquierdo: branding ------------------------- */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#9B1B30_0%,#6E1222_55%,#4A0A16_100%)] p-12 text-white md:col-span-4 md:flex lg:col-span-4">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.10) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(201,162,39,.30) 0%, transparent 50%)",
          }}
        />
        <span className="pointer-events-none absolute -bottom-[60px] -right-10 text-[260px] leading-none opacity-[0.08]">
          💃
        </span>

        <div className="relative z-10 flex h-full flex-col">
          <Link
            to="/public"
            className="mb-auto font-display text-2xl font-bold tracking-wide text-white no-underline"
          >
            🎗️ ENTRE <span className="text-accent">PAÑUELOS</span>
          </Link>

          <div className="my-auto py-8">
            <span className="mb-2 inline-block rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
              Comunidad de Campeones
            </span>
            <h1 className="mb-4 text-[38px] leading-[1.15] text-white">
              Únete a la pista de marinera más grande del Perú.
            </h1>
            <p className="mb-6 text-[14.5px] leading-relaxed opacity-90">
              Crea tu perfil de bailarín oficial, gestiona tu trayectoria,
              encuentra pareja de baile e inscríbete a los concursos nacionales.
            </p>

            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex items-center gap-2.5">
                <span className="text-accent">✓</span> Credencial digital única por DNI
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-accent">✓</span> Historial y ranking oficial actualizado
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-accent">✓</span> Conexión con academias y parejas
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-60">
          © {new Date().getFullYear()} Entre Pañuelos · Plataforma de Marinera
        </div>
      </aside>

      {/* ------------------------- Panel derecho: formulario ------------------------- */}
      <main className="flex items-center justify-center bg-white px-5 py-8 md:col-span-8 md:px-10 md:py-12 lg:col-span-8">
        <div className="w-full max-w-[620px]">
          <Link
            to="/public"
            className="mb-6 block text-center font-display text-[22px] font-bold text-primary no-underline md:hidden"
          >
            🎗️ ENTRE PAÑUELOS
          </Link>

          <div className="mb-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl">💃</span>
              <h2 className="text-[28px] font-bold text-ink">Registro de Bailarín</h2>
            </div>
            <p className="text-sm leading-normal text-ink-muted">
              ¿Ya tienes una cuenta registrada?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary no-underline hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {/* Alertas */}
          {alerta && (
            <div
              role="alert"
              className={`mb-5 flex items-start gap-2.5 rounded-btn border-l-[3px] px-3.5 py-3 text-[13px] leading-snug ${
                alerta.tipo === "error"
                  ? "border-danger bg-blush text-danger"
                  : "border-success bg-[#EAF5EF] text-success"
              }`}
            >
              <span>{alerta.tipo === "error" ? "⚠️" : "✅"}</span>
              <span>{alerta.texto}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Sección: Datos de Identidad */}
            <div className="mb-6 rounded-card border border-line bg-[#FCFAF7] p-4 sm:p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                1. Datos de Identidad
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* DNI */}
                <div>
                  <label htmlFor="dni" className="mb-1.5 block text-[13px] font-medium text-ink">
                    DNI <span className="text-primary">*</span>
                  </label>
                  <input
                    id="dni"
                    name="dni"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="12345678"
                    value={form.dni}
                    onChange={handleDniChange}
                    className={`${inputBase} ${
                      errores.dni ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                    }`}
                  />
                  {errores.dni && <p className="mt-1 text-xs text-danger">{errores.dni}</p>}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label htmlFor="fechaNacimiento" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    className={`${inputBase} border-line focus:border-primary`}
                  />
                </div>

                {/* Nombres */}
                <div>
                  <label htmlFor="nombres" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Nombres <span className="text-primary">*</span>
                  </label>
                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    placeholder="Ej. Juan Carlos"
                    value={form.nombres}
                    onChange={handleChange}
                    className={`${inputBase} ${
                      errores.nombres ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                    }`}
                  />
                  {errores.nombres && <p className="mt-1 text-xs text-danger">{errores.nombres}</p>}
                </div>

                {/* Apellidos */}
                <div>
                  <label htmlFor="apellidos" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Apellidos <span className="text-primary">*</span>
                  </label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    placeholder="Ej. Pérez Gómez"
                    value={form.apellidos}
                    onChange={handleChange}
                    className={`${inputBase} ${
                      errores.apellidos ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                    }`}
                  />
                  {errores.apellidos && <p className="mt-1 text-xs text-danger">{errores.apellidos}</p>}
                </div>
              </div>
            </div>

            {/* Sección: Datos de Contacto y Marinera */}
            <div className="mb-6 rounded-card border border-line bg-[#FCFAF7] p-4 sm:p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                2. Contacto y Categoría
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Correo electrónico <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputBase} ${
                      errores.email ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                    }`}
                  />
                  {errores.email && <p className="mt-1 text-xs text-danger">{errores.email}</p>}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="987654321"
                    value={form.telefono}
                    onChange={handleTelefonoChange}
                    className={`${inputBase} border-line focus:border-primary`}
                  />
                </div>

                {/* Género */}
                <div>
                  <label htmlFor="genero" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Género / Modalidad
                  </label>
                  <select
                    id="genero"
                    name="genero"
                    value={form.genero}
                    onChange={handleChange}
                    className={`${inputBase} border-line focus:border-primary cursor-pointer`}
                  >
                    <option value="Femenino">Femenino (Dama)</option>
                    <option value="Masculino">Masculino (Varón)</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="categoria" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Categoría de competencia
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className={`${inputBase} border-line focus:border-primary cursor-pointer`}
                  >
                    {CATEGORIAS_MARINERA.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Club / Academia */}
                <div className="sm:col-span-2">
                  <label htmlFor="clubAcademia" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Academia o Club de Marinera (opcional)
                  </label>
                  <input
                    id="clubAcademia"
                    name="clubAcademia"
                    type="text"
                    placeholder="Ej. Taller de Danzas Libertad / Independiente"
                    value={form.clubAcademia}
                    onChange={handleChange}
                    className={`${inputBase} border-line focus:border-primary`}
                  />
                </div>
              </div>
            </div>

            {/* Sección: Seguridad */}
            <div className="mb-6 rounded-card border border-line bg-[#FCFAF7] p-4 sm:p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted">
                3. Credenciales de Acceso
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Contraseña <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={verPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Mínimo 6 caracteres"
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputBase} pr-10 ${
                        errores.password ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setVerPassword((v) => !v)}
                      aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-xs text-ink-muted hover:text-ink"
                    >
                      {verPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errores.password && <p className="mt-1 text-xs text-danger">{errores.password}</p>}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-[13px] font-medium text-ink">
                    Confirmar Contraseña <span className="text-primary">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={verPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`${inputBase} ${
                      errores.confirmPassword ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                    }`}
                  />
                  {errores.confirmPassword && (
                    <p className="mt-1 text-xs text-danger">{errores.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Aceptación de términos */}
            <div className="mb-6">
              <label className="flex cursor-pointer select-none items-start gap-2.5 text-[13px] leading-snug text-ink-muted">
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={form.aceptaTerminos}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                />
                <span>
                  Declaro que los datos ingresados son verídicos y acepto los{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary underline bg-transparent border-0 p-0 text-[13px]"
                  >
                    Términos y Condiciones
                  </button>{" "}
                  así como la{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary underline bg-transparent border-0 p-0 text-[13px]"
                  >
                    Política de Privacidad
                  </button>{" "}
                  de la plataforma Entre Pañuelos.
                </span>
              </label>
              {errores.aceptaTerminos && (
                <p className="mt-1.5 text-xs text-danger">{errores.aceptaTerminos}</p>
              )}
            </div>

            {/* Botón de Submit */}
            <button
              type="submit"
              disabled={cargando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary p-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(155,27,48,0.25)] transition enabled:hover:-translate-y-px enabled:hover:bg-primary-hover enabled:hover:shadow-[0_4px_14px_rgba(155,27,48,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {cargando && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              )}
              <span>{cargando ? "Registrando bailarín…" : "Completar Registro"}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-muted">
            ¿Ya te registraste anteriormente?{" "}
            <Link to="/login" className="font-semibold text-primary no-underline hover:underline">
              Inicia sesión con tu DNI
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
