import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistroBailarin from "./pages/RegistroBailarin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroBailarin />} />
        <Route path="/registro-bailarin" element={<RegistroBailarin />} />
      </Routes>
    </BrowserRouter>
  );
}