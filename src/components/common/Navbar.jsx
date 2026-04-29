import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span
        className="navbar-brand"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        FreelanceFlow
      </span>

      <div className="ms-auto d-flex align-items-center gap-3">

        {/* Username */}
        <span className="text-white">
          👤 {user?.userName}
        </span>

        {/* Profile Button */}
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        {/* Logout */}
        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;