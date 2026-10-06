import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Agrega aquí el resto: /concursos, /bailarines, /ranking, /perfil,
            /mi-pareja, /inscripciones, /credencial, /registro, /admin, /public */}
      </Routes>
    </BrowserRouter>
  );
}