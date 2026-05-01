import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../services/authService";

const Navbar = () => {
  const navigate  = useNavigate();
  const user      = getCurrentUser();
  const initial   = user?.userName?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // get current page name from URL for breadcrumb
  const path      = window.location.pathname.replace("/", "");
  const pageName  = path
    ? path.charAt(0).toUpperCase() + path.slice(1)
    : "Dashboard";

  return (
    <nav
      style={{
        height:       "64px",
        background:   "rgba(255, 255, 255, 0.97)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.9)",
        backdropFilter: "blur(12px)",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
        padding:      "0 28px",
        position:     "sticky",
        top:          0,
        zIndex:       100,
        boxShadow:    "0 1px 12px rgba(15, 23, 42, 0.06)",
      }}
    >

      {/* Left — Page title + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width:        "6px",
          height:       "6px",
          borderRadius: "50%",
          background:   "linear-gradient(135deg, #3B82F6, #60A5FA)",
        }} />
        <span style={{
          fontSize:   "20px",
          fontWeight: "700",
          color:      "#0F172A",
        }}>
          {pageName}
        </span>
      </div>

      {/* Right section */}
      <div style={{
        display:    "flex",
        alignItems: "center",
        gap:        "16px",
      }}>

        

        {/* Divider */}
        <div style={{
          width:      "1px",
          height:     "28px",
          background: "#E2E8F0",
        }} />

        {/* User avatar + name */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        "10px",
          padding:    "6px 10px",
          borderRadius: "12px",
          background: "#F8FAFC",
          border:     "1px solid #E2E8F0",
          cursor:     "default",
        }}>
          {/* Avatar */}
          <div style={{
            width:          "32px",
            height:         "32px",
            borderRadius:   "50%",
            background:     "linear-gradient(135deg, #1A56DB, #3B82F6)",
            color:          "white",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontWeight:     "700",
            fontSize:       "13px",
            boxShadow:      "0 2px 8px rgba(26, 86, 219, 0.35)",
            flexShrink:     0,
          }}>
            {initial}
          </div>

          {/* Name + role */}
          <div style={{ lineHeight: "1.3" }}>
            <div style={{
              fontSize:   "13px",
              fontWeight: "600",
              color:      "#0F172A",
            }}>
              {user?.userName || "Freelancer"}
            </div>
            <div style={{
              fontSize: "11px",
              color:    "#94A3B8",
            }}>
              Freelancer
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "6px",
            background:   "linear-gradient(135deg, #EF4444, #DC2626)",
            color:        "white",
            border:       "none",
            borderRadius: "10px",
            padding:      "7px 14px",
            fontSize:     "13px",
            fontWeight:   "500",
            cursor:       "pointer",
            boxShadow:    "0 2px 8px rgba(239, 68, 68, 0.3)",
            transition:   "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(239,68,68,0.3)";
          }}
        >
          <span style={{ fontSize: "13px" }}>⎋</span>
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;