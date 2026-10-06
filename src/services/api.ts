// Configuración centralizada de API y cliente HTTP para Spring Boot
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export interface LoginRequest {
  dni: string;
  password: string;
}

export interface RegistroBailarinRequest {
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  categoria?: string;
  clubAcademia?: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  jwt?: string;
  accessToken?: string;
  tokenType?: string;
  dni?: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
  role?: string;
  roles?: string[];
  usuario?: {
    dni?: string;
    nombre?: string;
    rol?: string;
    [key: string]: any;
  };
  mensaje?: string;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let responseData: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    let errorMessage = "Ocurrió un error en el servidor";

    if (responseData) {
      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData.mensaje) {
        errorMessage = responseData.mensaje;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    } else if (response.status === 401) {
      errorMessage = "Credenciales incorrectas. Verifica tu DNI y contraseña.";
    } else if (response.status === 403) {
      errorMessage = "No tienes permisos para acceder a este recurso.";
    } else if (response.status === 404) {
      errorMessage = "El recurso solicitado no fue encontrado.";
    }

    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}


export const authService = {

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const payload = {
      dni: credentials.dni,
      password: credentials.password,
      contrasenia: credentials.password,
    };
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async registrarBailarin(data: RegistroBailarinRequest): Promise<any> {
    const payload = {
      ...data,
      contrasenia: data.password,
    };

    try {
      return await apiFetch<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      if (err?.status === 404) {
        try {
          return await apiFetch<any>("/auth/registro-bailarin", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        } catch (err2: any) {
          if (err2?.status === 404) {
            return await apiFetch<any>("/bailarines", {
              method: "POST",
              body: JSON.stringify(payload),
            });
          }
          throw err2;
        }
      }
      throw err;
    }
  },


  guardarSesion(data: LoginResponse, recordar: boolean = false): void {
    const storage = recordar ? localStorage : sessionStorage;
    const token = data.token || data.accessToken || data.jwt;

    if (token) {
      storage.setItem("token", token);
      // Mantener en localStorage para retrocompatibilidad
      localStorage.setItem("token", token);
    }

    if (data.rol || data.role) {
      const rol = data.rol || data.role;
      storage.setItem("rol", rol as string);
      localStorage.setItem("rol", rol as string);
    }

    if (data.usuario) {
      storage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
    } else if (data.dni) {
      storage.setItem("usuario", JSON.stringify({ dni: data.dni, nombre: data.nombre }));
      localStorage.setItem("usuario", JSON.stringify({ dni: data.dni, nombre: data.nombre }));
    }
  },

  
  obtenerToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  },

  
  obtenerUsuario(): any | null {
    const raw = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  
  obtenerRol(): string | null {
    return localStorage.getItem("rol") || sessionStorage.getItem("rol");
  },

  
  cerrarSesion(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("usuario");
  },
};
