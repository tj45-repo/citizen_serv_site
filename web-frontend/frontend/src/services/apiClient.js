import axios from "axios";

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// (Optional) direct service bases if you don’t want to go through the gateway
const BIRTH_BASE   = import.meta.env.VITE_BIRTH_BASE   || `${BASE}/api/birth`;
const VEHICLE_BASE = import.meta.env.VITE_VEHICLE_BASE || `${BASE}/api/vehicle`;
const HOUSING_BASE = import.meta.env.VITE_HOUSING_BASE || `${BASE}/api/housing`;

// Shared axios instance (you can add interceptors later for JWT)
const api = axios.create({ baseURL: BASE });

/** Helper wrappers with mock fallback **/
async function postOrMock(url, data, mock) {
  if (!USE_BACKEND) return { data: mock };
  return api.post(url, data);
}
async function getOrMock(url, mock) {
  if (!USE_BACKEND) return { data: mock };
  return api.get(url);
}

export const birthAPI = {
  createApplication(payload) {
    return postOrMock(
      `${BIRTH_BASE}/applications`,
      payload,
      { id: Math.floor(Math.random() * 1000), status: "PENDING", mock: true }
    );
  },
};

export const vehicleAPI = {
  createApplication(payload) {
    return postOrMock(
      `${VEHICLE_BASE}/applications`,
      payload,
      { id: Math.floor(Math.random() * 1000), status: "PENDING", mock: true }
    );
  },
};

export const housingAPI = {
  createApplication(payload) {
    return postOrMock(
      `${HOUSING_BASE}/applications`,
      payload,
      { id: Math.floor(Math.random() * 1000), status: "PENDING", mock: true }
    );
  },
};

export const adminAPI = {
  listBirthPending() {
    return getOrMock(
      `${BIRTH_BASE}/admin/applications/pending`,
      { items: [{ id: 1, applicant_name: "Alice Example (mock)" }] }
    );
  },
  listVehiclePending() {
    return getOrMock(
      `${VEHICLE_BASE}/admin/applications/pending`,
      { pending: [{ id: 2, plate_number: "ABC123 (mock)" }] }
    );
  },
  listHousingPending() {
    return getOrMock(
      `${HOUSING_BASE}/admin/applications/pending`,
      { pending: [{ id: 3, applicant_name: "Bob Example (mock)" }] }
    );
  },
  decideBirth(id, decision) {
    return postOrMock(`${BIRTH_BASE}/admin/applications/${id}/decision`, { decision }, { ok: true, decision, mock: true });
  },
  decideVehicle(id, decision) {
    return postOrMock(`${VEHICLE_BASE}/admin/applications/${id}/decision`, { decision }, { ok: true, decision, mock: true });
  },
  decideHousing(id, decision) {
    return postOrMock(`${HOUSING_BASE}/admin/applications/${id}/decision`, { decision }, { ok: true, decision, mock: true });
  },
};
