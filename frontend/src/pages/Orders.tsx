import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Order } from "../types/order";
import { getMyOrders } from "../services/orderService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { Package, Calendar, ArrowRight, Store } from "lucide-react";
import { getErrorMessage } from "../utils/errorMessage";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const data = await getMyOrders();
        setOrders(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load orders."));
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ marginBottom: "4px" }}>Order History</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Review your orders and view their current details.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <EmptyState message="You have no orders yet. Discover something worth bringing home." />
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "16px" }}>
            <Store size={18} />
            <span>Explore Products</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "24px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                  <Package size={20} color="var(--primary)" />
                  <strong style={{ fontSize: "1.1rem" }}>Order #{order.id}</strong>
                  <span className="status-badge" style={{ color: "var(--primary)", background: "var(--primary-light)", border: "1px solid var(--border-color)" }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>&bull; {order.items?.length || 0} item(s)</span>
                </div>
                {order.paymentMethod && <p style={{ marginTop: "8px", color: "var(--text-muted)", fontSize: "0.88rem" }}>Payment method: {order.paymentMethod}</p>}
                <OrderStatusTimeline status={order.status} compact />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Order Total</p>
                  <p style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)" }}>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>

                <Link to={`/orders/${order.id}`}>
                  <Button variant="secondary" style={{ padding: "8px 16px", fontSize: "0.88rem" }}>
                    <span>View Details</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;
