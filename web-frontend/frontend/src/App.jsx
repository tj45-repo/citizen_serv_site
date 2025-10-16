import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import BirthForm from "./pages/BirthForm";
import VehicleForm from "./pages/VehicleForm";
import HousingForm from "./pages/HousingForm";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/birth" replace />} />
          <Route path="/birth" element={<BirthForm />} />
          <Route path="/vehicle" element={<VehicleForm />} />
          <Route path="/housing" element={<HousingForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}
