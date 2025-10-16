import { useEffect, useState } from "react";
import { adminAPI } from "../services/apiClient";

export default function AdminDashboard() {
  const [birth, setBirth] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [{ data: b }, { data: v }, { data: h }] = await Promise.all([
          adminAPI.listBirthPending(),
          adminAPI.listVehiclePending(),
          adminAPI.listHousingPending(),
        ]);
        setBirth(b.items || b.pending || []);
        setVehicle(v.items || v.pending || []);
        setHousing(h.items || h.pending || []);
      } catch (e) {
        setMsg(e?.response?.data?.msg || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const approve = async (service, id) => {
    try {
      if (service === "birth") await adminAPI.decideBirth(id, "APPROVED");
      if (service === "vehicle") await adminAPI.decideVehicle(id, "APPROVED");
      if (service === "housing") await adminAPI.decideHousing(id, "APPROVED");
      setMsg(`Approved ${service} #${id}`);
    } catch (e) {
      setMsg(e?.response?.data?.msg || e.message);
    }
  };

  const reject = async (service, id) => {
    try {
      if (service === "birth") await adminAPI.decideBirth(id, "REJECTED");
      if (service === "vehicle") await adminAPI.decideVehicle(id, "REJECTED");
      if (service === "housing") await adminAPI.decideHousing(id, "REJECTED");
      setMsg(`Rejected ${service} #${id}`);
    } catch (e) {
      setMsg(e?.response?.data?.msg || e.message);
    }
  };

  return (
    <div className="card">
      <h1>Admin Dashboard</h1>
      {loading && <div>Loading...</div>}
      {msg && <p className="badge">{msg}</p>}

      <Section
        title="Birth — Pending"
        items={birth}
        render={(a) => `${a.applicant_name ?? a.name ?? "N/A"} (id: ${a.id})`}
        onApprove={(id) => approve("birth", id)}
        onReject={(id) => reject("birth", id)}
      />
      <Section
        title="Vehicle — Pending"
        items={vehicle}
        render={(a) => `${a.plate_number ?? "N/A"} (id: ${a.id})`}
        onApprove={(id) => approve("vehicle", id)}
        onReject={(id) => reject("vehicle", id)}
      />
      <Section
        title="Housing — Pending"
        items={housing}
        render={(a) => `${a.applicant_name ?? "N/A"} (id: ${a.id})`}
        onApprove={(id) => approve("housing", id)}
        onReject={(id) => reject("housing", id)}
      />
    </div>
  );
}

function Section({ title, items, render, onApprove, onReject }) {
  return (
    <>
      <hr />
      <h2 style={{ margin: "0 0 8px 0" }}>{title}</h2>
      {items.length === 0 ? (
        <div>No items</div>
      ) : (
        items.map((a) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span>{render(a)}</span>
            <button onClick={() => onApprove(a.id)}>Approve</button>
            <button onClick={() => onReject(a.id)} style={{ background: "#991b1b" }}>
              Reject
            </button>
          </div>
        ))
      )}
    </>
  );
}
