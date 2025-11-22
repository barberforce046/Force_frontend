import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cuts from "./pages/Cuts.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function Layout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const barber = JSON.parse(localStorage.getItem("barber") || "null");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("barber");
    navigate("/login");
  };
  return (
    <div>
      <header className="app-header">
        <div className="app-header-inner">
          <Link className="brand" to="/cuts">Force</Link>
          <nav className="nav">
            {token && barber ? (
              <>
                <span>{barber.name}</span>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/cuts">Cortes</Link>
                <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cuts" element={<PrivateRoute><Cuts /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/cuts" replace />} />
      </Routes>
    </Layout>
  );
}