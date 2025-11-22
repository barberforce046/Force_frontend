import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("barber", JSON.stringify(data.barber));
      navigate("/dashboard");
    } catch (err) {
      setError("No se pudo registrar");
    }
  };
  return (
    <div className="container" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <div className="card" style={{ width: 480 }}>
        <div className="card-title">Registrarse</div>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <input className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary" type="submit">Crear cuenta</button>
        </form>
        {error && <p style={{ color: "#ef4444", marginTop: 10 }}>{error}</p>}
        <p style={{ marginTop: 12 }}><Link to="/login">Ya tengo cuenta</Link></p>
      </div>
    </div>
  );
}