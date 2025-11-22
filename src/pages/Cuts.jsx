import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function Cuts() {
  const [clientName, setClientName] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountDisplay, setAmountDisplay] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [cuts, setCuts] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const load = async () => {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    const { data } = await api.get("/cuts", { params });
    setCuts(data);
  };

  useEffect(() => { load(); }, []);

  const formatIntl = (n) => new Intl.NumberFormat("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

  const parseEsCO = (raw) => {
    const s = String(raw).replace(/[^\d.,]/g, "");
    const idx = s.lastIndexOf(",");
    if (idx >= 0) {
      const intPart = s.slice(0, idx).replace(/\D/g, "");
      const decPart = s.slice(idx + 1).replace(/\D/g, "").slice(0, 2);
      const numStr = decPart ? `${intPart}.${decPart}` : intPart;
      return Number(numStr || 0);
    }
    const intOnly = s.replace(/\D/g, "");
    return Number(intOnly || 0);
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value;
    const s = String(raw).replace(/\./g, "").replace(/[^\d,]/g, "");
    if (!s) {
      setAmountPaid(0);
      setAmountDisplay("");
      return;
    }
    const idx = s.lastIndexOf(",");
    const intRaw = (idx >= 0 ? s.slice(0, idx) : s).replace(/\D/g, "");
    const decRaw = idx >= 0 ? s.slice(idx + 1).replace(/\D/g, "").slice(0, 2) : "";
    const intFmt = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const display = idx >= 0 ? (decRaw ? `${intFmt},${decRaw}` : `${intFmt},`) : intFmt;
    setAmountDisplay(display);
    setAmountPaid(Number(decRaw ? `${intRaw}.${decRaw}` : intRaw || 0));
  };

  const handleAmountBlur = () => {
    if (amountDisplay === "") return;
    setAmountDisplay(formatIntl(amountPaid));
  };

  const add = async (e) => {
    e.preventDefault();
    await api.post("/cuts", { clientName, amountPaid: Number(amountPaid), description, date });
    setClientName("");
    setAmountPaid(0);
    setAmountDisplay("");
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    await load();
  };

  return (
    <div>
      <h2>Mis cortes</h2>

      <div className="card">
        <div className="card-title">Registrar corte</div>
        <form onSubmit={add} className="grid" style={{ gap: 12, maxWidth: 700 }}>
          <input className="input" placeholder="Nombre del cliente" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <input className="input" type="text" placeholder="Pago" value={amountDisplay} onChange={handleAmountChange} onBlur={handleAmountBlur} />
          <input className="input" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div>
            <button className="btn btn-primary" type="submit">Registrar corte</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Historial</div>
        <ul className="list">
          {cuts.map((c) => (
            <li key={c._id} className="list-item">
              <div>{c.clientName}</div>
              <div>{formatIntl(Number(c.amountPaid))}</div>
              <div>{new Date(c.date).toLocaleDateString()}</div>
              <div>{c.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}