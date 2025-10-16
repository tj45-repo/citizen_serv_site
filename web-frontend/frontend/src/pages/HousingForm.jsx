import { useState } from "react";
import { housingAPI } from "../services/apiClient";

export default function HousingForm() {
  const [form, setForm] = useState({
    applicant_name: "",
    address: "",
    household_size: "",
    income_band: "",
  });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await housingAPI.createApplication(form);
      setResult({ type: "success", data });
    } catch (err) {
      setResult({ type: "error", message: err?.response?.data?.msg || err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h1>Housing Application</h1>
      <form onSubmit={submit}>
        <div className="row">
          <div>
            <label>Applicant Name</label>
            <input name="applicant_name" required value={form.applicant_name} onChange={onChange} />
          </div>
          <div>
            <label>Address</label>
            <input name="address" required value={form.address} onChange={onChange} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Household Size</label>
            <input type="number" name="household_size" required value={form.household_size} onChange={onChange} />
          </div>
          <div>
            <label>Income Band</label>
            <input name="income_band" required value={form.income_band} onChange={onChange} />
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
