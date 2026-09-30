import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { getAllOrdersAdmin } from "../../services/orderService";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import { Package, Grid, ShoppingBag, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { getErrorMessage } from "../../utils/errorMessage";

function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [products, categories, orders] = await Promise.all([
          getProducts().catch(() => []),
          getCategories().catch(() => []),
          getAllOrdersAdmin().catch(() => []),
        ]);
        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
        });
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load dashboard statistics."));
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main className="admin-page admin-dashboard-page" style={{ textAlign: "left", paddingBottom: "60px" }}>
      <header className="admin-dashboard-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}><span style={{ width: "44px", height: "44px", display: "grid", placeItems: "center", background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--border-color)" }} aria-hidden="true"><ShieldCheck size={22} /></span>
        <div><p style={{ color: "var(--primary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "3px" }}>Administration</p><h1 style={{ margin: 0 }}>Dashboard</h1></div>
        </div>
      <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "32px" }}>
        A concise view of the records currently available to manage.
      </p></header>

      {error && <ErrorMessage message={error} />}

      <section className="admin-dashboard-grid" aria-label="Available management statistics">
        <div className="admin-dashboard-card">
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Package size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Total Products</p>
            <p style={{ fontSize: "2rem", lineHeight: 1.1, fontWeight: 700, margin: "4px 0 12px" }}>{stats.products}</p>
            <Link to="/admin/products" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span>Manage Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="admin-dashboard-card">
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Grid size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Product Categories</p>
            <p style={{ fontSize: "2rem", lineHeight: 1.1, fontWeight: 700, margin: "4px 0 12px" }}>{stats.categories}</p>
            <Link to="/admin/categories" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span>Manage Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="admin-dashboard-card">
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <ShoppingBag size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Total Orders</p>
            <p style={{ fontSize: "2rem", lineHeight: 1.1, fontWeight: 700, margin: "4px 0 12px" }}>{stats.orders}</p>
            <Link to="/admin/orders" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span>Manage Orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="admin-dashboard-card">
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Users size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>User Directory</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "6px 0 12px" }}>No user total is available.</p>
            <Link to="/admin/users" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span>View User Status</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
