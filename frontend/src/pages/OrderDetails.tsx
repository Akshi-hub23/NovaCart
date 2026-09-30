import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Order } from "../types/order";
import { getOrderById } from "../services/orderService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMessage } from "../utils/errorMessage";
import { ArrowLeft, Package, MapPin, Calendar, CreditCard } from "lucide-react";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrderDetails() {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await getOrderById(Number(id));
        setOrder(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load order details."));
      } finally {
        setLoading(false);
      }
    }

    loadOrderDetails();
  }, [id]);

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      <Link to="/orders" className="btn btn-secondary route-back-link" aria-label="Back to Orders" style={{ marginBottom: "24px", padding: "8px 16px", fontSize: "0.9rem" }}>
        <ArrowLeft size={16} />
        <span>Back to Orders</span>
      </Link>

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ marginBottom: "4px" }}>Order #{id}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Review your order, delivery address, and itemized total.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {order && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Order Header Summary Card */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Placed On</p>
              <p style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={16} color="var(--primary)" />
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Current Status</p>
              <span className="status-badge" style={{ color: "var(--primary)", background: "var(--primary-light)", border: "1px solid var(--border-color)" }}>
                {order.status}
              </span>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Order Total</p>
              <p style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary)" }}>
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <section className="order-progress-card" aria-labelledby="order-progress-heading">
            <h2 id="order-progress-heading">Delivery progress</h2>
            <OrderStatusTimeline status={order.status} />
          </section>

          {/* Shipping Address Card */}
          {order.paymentMethod && (
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <CreditCard size={20} color="var(--primary)" />
              <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Payment Method</h3>
            </div>
            <p style={{ color: "var(--text-muted)" }}>{order.paymentMethod}</p>
          </div>
          )}

          {order.address && (
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <MapPin size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Shipping Address</h3>
              </div>
              <p style={{ fontWeight: "700", marginBottom: "4px" }}>{order.address.fullName}</p>
              <p style={{ color: "var(--text-muted)" }}>
                {order.address.addressLine}<br />
                {order.address.city}, {order.address.state} {order.address.postalCode} &bull; {order.address.country}
              </p>
            </div>
          )}

          {/* Ordered Items Table */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Package size={20} color="var(--primary)" />
              <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Items in Order ({order.items.length})</h3>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product Title</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "600" }}>{item.productName}</td>
                      <td>₹{item.unitPrice.toLocaleString("en-IN")}</td>
                      <td>{item.quantity}</td>
                      <td style={{ fontWeight: "700", color: "var(--primary)" }}>₹{item.totalPrice.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "24px", paddingTop: "20px", marginTop: "20px", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-muted)" }}>Order total</span>
              <strong style={{ color: "var(--primary)", fontSize: "1.15rem" }}>&#8377;{order.totalAmount.toLocaleString("en-IN")}</strong>
            </div>
        </div>
      )}
    </main>
  );
}

export default OrderDetails;
