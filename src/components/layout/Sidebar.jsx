import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Clients",   icon: "👥", path: "/clients"   },
    { name: "Projects",  icon: "📁", path: "/projects"  },
    { name: "Invoices",  icon: "🧾", path: "/invoices"  },
  ];

  return (
    <div
      style={{
        width:      "240px",
        minHeight:  "100vh",
        background: "linear-gradient(160deg, #0F172A 0%, #1E3A5F 60%, #1A56DB 100%)",
        color:      "white",
        display:    "flex",
        flexDirection: "column",
        padding:    "0",
        boxShadow:  "4px 0 24px rgba(15, 23, 42, 0.35)",
        position:   "relative",
        overflow:   "hidden",
      }}
    >

      {/* Background decorative circles */}
      <div style={{
        position:     "absolute",
        top:          "-60px",
        right:        "-60px",
        width:        "180px",
        height:       "180px",
        borderRadius: "50%",
        background:   "rgba(96, 165, 250, 0.08)",
        pointerEvents: "none",
      }} />
      <div style={{
        position:     "absolute",
        bottom:       "60px",
        left:         "-40px",
        width:        "140px",
        height:       "140px",
        borderRadius: "50%",
        background:   "rgba(99, 179, 237, 0.06)",
        pointerEvents: "none",
      }} />

      {/* Logo area */}
      <div style={{
        padding:      "28px 20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        textAlign:    "center",
      }}>
        <div style={{
          display:        "inline-flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          "44px",
          height:         "44px",
          background:     "linear-gradient(135deg, #3B82F6, #60A5FA)",
          borderRadius:   "14px",
          fontSize:       "22px",
          marginBottom:   "10px",
          boxShadow:      "0 4px 14px rgba(59, 130, 246, 0.45)",
        }}>
          🚀
        </div>
        <div style={{
          fontSize:   "15px",
          fontWeight: "700",
          color:      "white",
          letterSpacing: "0.6px",
        }}>
          FreelanceFlow
        </div>
        <div style={{
          fontSize: "11px",
          color:    "rgba(148, 163, 184, 0.85)",
          marginTop: "2px",
        }}>
          Business Manager
        </div>
      </div>

      {/* Navigation label */}
      <div style={{
        padding:     "20px 20px 10px",
        fontSize:    "10px",
        fontWeight:  "600",
        letterSpacing: "1.2px",
        color:       "rgba(148, 163, 184, 0.6)",
        textTransform: "uppercase",
      }}>
        Main Menu
      </div>

      {/* Menu items */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "4px",
          padding:       "0 12px",
          flex:          1,
        }}
      >
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <div
                style={{
                  position:     "relative",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "12px",
                  padding:      "11px 14px",
                  borderRadius: "12px",
                  fontSize:     "14px",
                  fontWeight:   isActive ? "600" : "400",
                  color:        isActive
                    ? "white"
                    : "rgba(203, 213, 225, 0.85)",
                  background:   isActive
                    ? "linear-gradient(90deg, rgba(59,130,246,0.35), rgba(99,179,237,0.15))"
                    : "transparent",
                  border:       isActive
                    ? "1px solid rgba(96, 165, 250, 0.3)"
                    : "1px solid transparent",
                  transition:   "all 0.22s ease",
                  cursor:       "pointer",
                }}
                className="sidebar-nav-item"
              >
                {/* Active left bar */}
                {isActive && (
                  <span style={{
                    position:     "absolute",
                    left:         "0",
                    top:          "20%",
                    bottom:       "20%",
                    width:        "3px",
                    background:   "linear-gradient(180deg, #60A5FA, #3B82F6)",
                    borderRadius: "0 3px 3px 0",
                  }} />
                )}

                {/* Icon container */}
                <span style={{
                  width:          "32px",
                  height:         "32px",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  borderRadius:   "9px",
                  fontSize:       "16px",
                  background:     isActive
                    ? "rgba(96, 165, 250, 0.2)"
                    : "rgba(255,255,255,0.05)",
                  transition:     "all 0.22s ease",
                }}>
                  {item.icon}
                </span>

                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding:     "16px 20px",
        borderTop:   "1px solid rgba(255,255,255,0.07)",
        textAlign:   "center",
      }}>
        <div style={{
          fontSize:    "11px",
          color:       "rgba(148, 163, 184, 0.5)",
          letterSpacing: "0.3px",
        }}>
          © 2026 FreelanceFlow
        </div>
      </div>

      <style>{`
        .sidebar-nav-item:hover {
          background: rgba(96, 165, 250, 0.12) !important;
          border-color: rgba(96, 165, 250, 0.18) !important;
          color: white !important;
          transform: translateX(3px);
        }
        .sidebar-nav-item:hover span:first-of-type {
          background: rgba(96, 165, 250, 0.2) !important;
        }
      `}</style>
    </div>
  );
}