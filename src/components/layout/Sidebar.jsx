import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="d-flex flex-column p-3"
      style={{ width: "220px", minHeight: "100vh", background: "#1E3A5F" }}
    >
      {/* <h5 className="text-white mb-4">FreelanceFlow</h5> */}

      <NavLink to="/dashboard" className="text-white text-decoration-none mb-2">
        Dashboard
      </NavLink>

      <NavLink to="/clients" className="text-white text-decoration-none mb-2">
        Clients
      </NavLink>

      <NavLink to="/projects" className="text-white text-decoration-none mb-2">
        Projects
      </NavLink>

      <NavLink to="/invoices" className="text-white text-decoration-none mb-2">
        Invoices
      </NavLink>
    </div>
  );
}