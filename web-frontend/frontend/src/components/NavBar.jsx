import { NavLink } from "react-router-dom";

export default function NavBar() {
  const linkClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <nav>
      <div className="wrap">
        <strong>CitizenServ</strong>
        <NavLink className={linkClass} to="/birth">Birth</NavLink>
        <NavLink className={linkClass} to="/vehicle">Vehicle</NavLink>
        <NavLink className={linkClass} to="/housing">Housing</NavLink>
        <NavLink className={linkClass} to="/admin">Admin</NavLink>
      </div>
    </nav>
  );
}
