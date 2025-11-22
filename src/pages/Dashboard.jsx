import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [granularity, setGranularity] = useState("day");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState({ items: [], totalAmount: 0, totalCount: 0 });
  const fmt = (n) => new Intl.NumberFormat("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

  const load = async () => {
    const params = { granularity };
    if (start) params.start = start;
    if (end) params.end = end;
    const { data } = await api.get("/cuts/metrics", { params });
    setData(data);
  };

  useEffect(() => { load(); }, []);

  const maxAmount = useMemo(() => Math.max(0, ...data.items.map(i => i.totalAmount)), [data]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => navigate("/cuts")}>Registrar cortes</button>
      </div>

      <div className="card">
        <div className="grid cols-3" style={{ alignItems: "end" }}>
          <div>
            <div className="muted">Agrupar por</div>
            <select className="select" value={granularity} onChange={(e) => setGranularity(e.target.value)}>
              <option value="day">Día</option>
              <option value="month">Mes</option>
            </select>
          </div>
          <div>
            <div className="muted">Desde</div>
            <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <div className="muted">Hasta</div>
            <input className="input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-outline" onClick={load}>Actualizar</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, color: "#555" }}>Ingresos</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{fmt(data.totalAmount)}</div>
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, color: "#555" }}>Cortes</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{data.totalCount}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Ingresos por {granularity === "day" ? "día" : "mes"}</div>
        <div className="grid" style={{ gap: 8 }}>
          {data.items.map((i) => {
            const width = maxAmount ? Math.max(4, Math.round((i.totalAmount / maxAmount) * 280)) : 4;
            return (
              <div key={i._id} className="bar-row">
                <div>{i._id}</div>
                <div className="bar" style={{ width }} />
                <div style={{ textAlign: "right" }}>{fmt(i.totalAmount)}</div>
                <div style={{ textAlign: "right" }}>{i.totalCount}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}