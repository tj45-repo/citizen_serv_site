import { useState } from "react";
import { birthAPI } from "../services/apiClient";

export default function BirthForm() {
  const [form, setForm] = useState({
    applicant_name: "",
    date_of_birth: "",
    place_of_birth: "",
    father_name: "",
    mother_name: "",
    address: "",
  });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await birthAPI.createApplication(form);
      setResult({ type: "success", data });
    } catch (err) {
      setResult({ type: "error", message: err?.response?.data?.msg || err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h1>Birth Certificate Application</h1>
      <form onSubmit={submit}>
        <div className="row">
          <div>
            <label>Applicant Name</label>
            <input name="applicant_name" required value={form.applicant_name} onChange={onChange} />
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" name="date_of_birth" required value={form.date_of_birth} onChange={onChange} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Place of Birth</label>
            <input name="place_of_birth" required value={form.place_of_birth} onChange={onChange} />
          </div>
          <div>
            <label>Father Name</label>
            <input name="father_name" value={form.father_name} onChange={onChange} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Mother Name</label>
            <input name="mother_name" value={form.mother_name} onChange={onChange} />
          </div>
          <div>
            <label>Address</label>
            <input name="address" value={form.address} onChange={onChange} />
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
