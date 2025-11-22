import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("barber", JSON.stringify(data.barber));
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };
  return (
    <div className="container" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <div className="card" style={{ width: 420 }}>
        <div className="card-title">Iniciar sesión</div>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary" type="submit">Entrar</button>
        </form>
        {error && <p style={{ color: "#ef4444", marginTop: 10 }}>{error}</p>}
        <p style={{ marginTop: 12 }}><Link to="/register">Crear cuenta</Link></p>
      </div>
    </div>
  );
}