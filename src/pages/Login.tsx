import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

type Alerta = { tipo: "error" | "exito"; texto: string } | null;

const validarDni = (v: string) => /^\d{8}$/.test(v);

const inputBase =
  "w-full rounded-btn border-[1.5px] bg-cream py-[13px] pl-11 pr-11 text-sm text-ink outline-none transition placeholder:text-[#A8A199] focus:bg-white focus:shadow-[0_0_0_3px_rgba(155,27,48,0.10)]";

export default function Login() {
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [errorDni, setErrorDni] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<Alerta>(null);

  const onChangeDni = (e: ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value.replace(/\D/g, "").slice(0, 8));
    setErrorDni(false);
    setAlerta(null);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorPassword(false);
    setAlerta(null);
  };

  const onBlurDni = () => setErrorDni(dni.trim() !== "" && !validarDni(dni.trim()));
  const onBlurPassword = () => setErrorPassword(password !== "" && password.length < 6);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dniLimpio = dni.trim();

    const dniMal = !validarDni(dniLimpio);
    const passMal = password.length < 6;
    setErrorDni(dniMal);
    setErrorPassword(passMal);

    if (dniMal || passMal) {
      setAlerta({ tipo: "error", texto: "Revisa los campos marcados en rojo." });
      return;
    }

    setCargando(true);
    setAlerta(null);

    try {
      const data = await authService.login({ dni: dniLimpio, password });

      authService.guardarSesion(data, recordarme);

      const rol = (
        data.rol ||
        data.role ||
        data.usuario?.rol ||
        (Array.isArray(data.roles) ? data.roles[0] : "") ||
        ""
      ).toUpperCase();

      const esAdmin = rol.includes("ADMIN");
      const nombreUsuario = data.nombre || data.usuario?.nombre || (esAdmin ? "administrador" : "bailarín");

      setAlerta({
        tipo: "exito",
        texto: `¡Bienvenido, ${nombreUsuario}! Redirigiendo…`,
      });

      setTimeout(() => {
        navigate(esAdmin ? "/admin" : "/");
      }, 1000);
    } catch (err: any) {
      const mensaje =
        err?.message ||
        err?.data?.mensaje ||
        err?.data?.message ||
        "No fue posible iniciar sesión. Verifica tu conexión o credenciales.";
      setAlerta({ tipo: "error", texto: mensaje });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden md:grid-cols-2">
      {/* ------------------------- Panel izquierdo: branding ------------------------- */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#9B1B30_0%,#6E1222_55%,#4A0A16_100%)] p-12 text-white md:flex">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.10) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(201,162,39,.30) 0%, transparent 50%)",
          }}
        />
        <span className="pointer-events-none absolute -bottom-[60px] -right-10 text-[280px] leading-none opacity-[0.08]">
          🎗️
        </span>

        <div className="relative z-10 flex h-full flex-col">
          <Link to="/public" className="mb-auto font-display text-2xl font-bold tracking-wide text-white no-underline">
            🎗️ ENTRE <span className="text-accent">PAÑUELOS</span>
          </Link>

          <div className="my-auto py-10">
            <h1 className="mb-4 text-[44px] leading-[1.15] text-white">
              Bienvenido de vuelta a la <em className="not-italic text-accent">pista</em>.
            </h1>
            <p className="mb-7 max-w-[420px] text-[15px] leading-relaxed opacity-90">
              Ingresa con tu DNI para acceder a tu trayectoria, tus logros y tus admiradores. La marinera te
              espera.
            </p>

            <blockquote className="max-w-[420px] rounded-lg border-l-[3px] border-accent bg-white/[0.08] px-5 py-4 backdrop-blur-md">
              <p className="mb-2 text-[13.5px] italic leading-normal">
                "La marinera no se baila con los pies, se baila con el alma."
              </p>
              <span className="text-xs opacity-70">— Dicho popular trujillano</span>
            </blockquote>
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-60">
          © {new Date().getFullYear()} Entre Pañuelos · Plataforma de Marinera
        </div>
      </aside>

      {/* ------------------------- Panel derecho: formulario ------------------------- */}
      <main className="flex items-center justify-center bg-white px-5 py-8 md:px-8 md:py-12">
        <div className="w-full max-w-[420px]">
          <Link
            to="/public"
            className="mb-8 block text-center font-display text-[22px] font-bold text-primary no-underline md:hidden"
          >
            🎗️ ENTRE PAÑUELOS
          </Link>

          <div className="mb-8">
            <h2 className="mb-2 text-[30px] text-ink">Iniciar sesión</h2>
            <p className="text-sm leading-normal text-ink-muted">
              ¿Aún no tienes cuenta?{" "}
              <Link to="/registro" className="font-semibold text-primary no-underline hover:underline">
                Regístrate como bailarín
              </Link>
            </p>
          </div>

          {/* Aviso solo bailarines */}
          <div className="mb-[22px] flex items-start gap-2.5 rounded-btn border border-dashed border-accent bg-[#FFFCF2] px-3.5 py-3 text-[12.5px] leading-normal text-ink-muted">
            <span className="shrink-0 text-lg">💃</span>
            <div>
              <strong className="mb-0.5 block text-ink">Acceso exclusivo para bailarines</strong>
              Ingresa con el DNI con el que te registraste. Solo bailarines pueden admirar y competir.
            </div>
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

          <form onSubmit={onSubmit} noValidate>
            {/* DNI */}
            <div className="mb-[18px]">
              <label htmlFor="dni" className="mb-1.5 block text-[13px] font-medium">
                DNI <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] opacity-55">
                  🪪
                </span>
                <input
                  id="dni"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  autoComplete="username"
                  placeholder="12345678"
                  value={dni}
                  onChange={onChangeDni}
                  onBlur={onBlurDni}
                  className={`${inputBase} ${
                    errorDni ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                  }`}
                />
              </div>
              <p className="mt-1.5 text-[11.5px] text-ink-muted">8 dígitos, sin puntos ni espacios.</p>
              {errorDni && (
                <p className="mt-1.5 text-xs text-danger">El DNI debe tener exactamente 8 dígitos numéricos.</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="mb-[18px]">
              <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium">
                Contraseña <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] opacity-55">
                  🔒
                </span>
                <input
                  id="password"
                  type={verPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={onChangePassword}
                  onBlur={onBlurPassword}
                  className={`${inputBase} ${
                    errorPassword ? "border-danger !bg-[#FEF6F5]" : "border-line focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[15px] text-ink-muted opacity-55 hover:bg-cream hover:opacity-100"
                >
                  {verPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errorPassword && (
                <p className="mt-1.5 text-xs text-danger">La contraseña debe tener al menos 6 caracteres.</p>
              )}
            </div>

            {/* Recordarme / olvidé */}
            <div className="mb-[22px] flex items-center justify-between text-[13px]">
              <label className="flex cursor-pointer select-none items-center gap-2 text-ink-muted">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                className="font-medium text-primary no-underline hover:underline cursor-pointer bg-transparent border-0 p-0 text-[13px]"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={cargando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary p-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(155,27,48,0.25)] transition enabled:hover:-translate-y-px enabled:hover:bg-primary-hover enabled:hover:shadow-[0_4px_14px_rgba(155,27,48,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {cargando && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              )}
              <span>Ingresar</span>
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] leading-relaxed text-ink-muted">
            Al iniciar sesión aceptas nuestros{" "}
            <button
              type="button"
              className="font-semibold text-primary no-underline hover:underline cursor-pointer bg-transparent border-0 p-0 text-[13px]"
            >
              Términos
            </button>{" "}
            y{" "}
            <button
              type="button"
              className="font-semibold text-primary no-underline hover:underline cursor-pointer bg-transparent border-0 p-0 text-[13px]"
            >
              Política de privacidad
            </button>
            .
          </p>

          
        </div>
      </main>
    </div>
  );
}