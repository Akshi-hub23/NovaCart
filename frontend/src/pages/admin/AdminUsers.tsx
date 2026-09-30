import { Link } from "react-router-dom";
import { Users, ArrowLeft, Info, ShieldCheck, UserCheck, Clock, AlertCircle } from "lucide-react";

function AdminUsers() {
  const featureCards = [
    {
      icon: <UserCheck size={20} />,
      title: "User Authentication",
      description: "Login, registration, and session management are fully operational via /api/user endpoints.",
      status: "live",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Role Verification",
      description: "Admin role access is guarded via /api/user/admin-test for protected routes.",
      status: "live",
    },
    {
      icon: <Clock size={20} />,
      title: "User Listing",
      description: "Full paginated user directory with search and filter capabilities.",
      status: "planned",
    },
    {
      icon: <AlertCircle size={20} />,
      title: "Account Management",
      description: "Suspend, activate, or delete user accounts from the admin panel.",
      status: "planned",
    },
  ];

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <Link
          to="/admin"
          className="btn btn-secondary admin-back-link"
          aria-label="Back to Admin Dashboard"
        >
          <ArrowLeft size={16} />
          Back to Admin Dashboard
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={22} />
          </div>
          <h1 style={{ margin: 0 }}>User Management</h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: 0 }}>
          Overview of user authentication and account management capabilities.
        </p>
      </div>

      {/* Info Banner */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
          padding: "20px 24px",
          borderRadius: "var(--radius-lg)",
          background: "hsl(220 100% 97%)",
          border: "1px solid hsl(220 100% 88%)",
          marginBottom: "36px",
        }}
      >
        <Info size={20} style={{ color: "hsl(220 90% 56%)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ fontWeight: "600", color: "hsl(220 60% 30%)", marginBottom: "4px" }}>
            Backend Integration Status
          </p>
          <p style={{ color: "hsl(220 40% 45%)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
            The current backend <code style={{ fontFamily: "monospace", background: "hsl(220 100% 92%)", padding: "1px 5px", borderRadius: "4px" }}>UserController</code> supports
            authentication, registration, and profile management. Full user directory listing and
            account suspension endpoints are planned for a future backend update. This page will be
            fully operational once those endpoints are available.
          </p>
        </div>
      </div>

      {/* Feature Status Cards */}
      <h2 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "16px", color: "var(--text)" }}>
        Feature Status
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="card"
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderLeft: `3px solid ${card.status === "live" ? "var(--success)" : "var(--text-muted)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "var(--radius-md)",
                  background: card.status === "live" ? "hsl(142 70% 92%)" : "var(--surface-2)",
                  color: card.status === "live" ? "var(--success)" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: card.status === "live" ? "hsl(142 70% 92%)" : "var(--surface-2)",
                  color: card.status === "live" ? "var(--success)" : "var(--text-muted)",
                }}
              >
                {card.status === "live" ? "Live" : "Planned"}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "4px", color: "var(--text)" }}>
                {card.title}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.6", margin: 0 }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Available Endpoints Section */}
      <h2 style={{ fontSize: "1.15rem", fontWeight: "700", marginTop: "40px", marginBottom: "16px", color: "var(--text)" }}>
        Available API Endpoints
      </h2>
      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {[
          { method: "POST", path: "/api/user/register", desc: "Register a new user account" },
          { method: "POST", path: "/api/user/login", desc: "Authenticate and receive a JWT token" },
          { method: "GET", path: "/api/user/me", desc: "Fetch the current authenticated user profile" },
          { method: "GET", path: "/api/user/admin-test", desc: "Verify admin role access" },
        ].map((ep, i, arr) => (
          <div
            key={ep.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px 20px",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "6px",
                minWidth: "50px",
                textAlign: "center",
                background: ep.method === "GET" ? "hsl(210 100% 92%)" : "hsl(142 70% 92%)",
                color: ep.method === "GET" ? "hsl(210 90% 40%)" : "var(--success)",
              }}
            >
              {ep.method}
            </span>
            <code style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--primary)", flex: 1 }}>
              {ep.path}
            </code>
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "none" }} className="endpoint-desc">
              {ep.desc}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              {ep.desc}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminUsers;
