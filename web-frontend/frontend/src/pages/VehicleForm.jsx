import { useState } from "react";
import { vehicleAPI } from "../services/apiClient";

export default function VehicleForm() {
  const [form, setForm] = useState({
    plate_number: "",
    vin: "",
    vehicle_type: "",
    owner_name: "",
  });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await vehicleAPI.createApplication(form);
      setResult({ type: "success", data });
    } catch (err) {
      setResult({ type: "error", message: err?.response?.data?.msg || err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h1>Vehicle Registration</h1>
      <form onSubmit={submit}>
        <div className="row">
          <div>
            <label>Plate Number</label>
            <input name="plate_number" required value={form.plate_number} onChange={onChange} />
          </div>
          <div>
            <label>VIN</label>
            <input name="vin" required value={form.vin} onChange={onChange} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Vehicle Type</label>
            <input name="vehicle_type" required value={form.vehicle_type} onChange={onChange} />
          </div>
          <div>
            <label>Owner Name</label>
            <input name="owner_name" required value={form.owner_name} onChange={onChange} />
          </div>
        </div>
        <button disabled={busy}>{busy ? "Submitting..." : "Submit"}</button>
      </form>

      {result && (
        <>
          <hr />
          {result.type === "success" ? (
            <div className="success">
              <div className="badge">Created</div> Application #{result.data.id} (status: {result.data.status})
              {result.data.mock && <span> — mock</span>}
            </div>
          ) : (
            <div className="error">{result.message}</div>
          )}
        </>
      )}
    </div>
  );
}
