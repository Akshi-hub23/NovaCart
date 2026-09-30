import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Order } from "../types/order";
import { getOrderById } from "../services/orderService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { getErrorMessage } from "../utils/errorMessage";

function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const data = await getOrderById(Number(id));
        setOrder(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load order."));
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main style={{ paddingBottom: "60px", maxWidth: "800px" }}>
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "48px 32px",
        textAlign: "center",
        boxShadow: "var(--shadow-md)",
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "var(--success-bg)",
          color: "var(--success)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <CheckCircle2 size={44} />
        </div>

        <h1 style={{ fontSize: "2.2rem", marginBottom: "8px" }}>Order placed successfully</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "32px" }}>
          Thank you for your order. Your order details are available below.
        </p>

        {error && <ErrorMessage message={error} />}

        {order && (
          <div style={{
            background: "var(--bg-main)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            textAlign: "left",
            marginBottom: "32px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Order ID</p>
                <p style={{ fontWeight: "800", fontSize: "1.1rem" }}>#{order.id}</p>
              </div>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Current status</p>
                <span className="status-badge" style={{ color: "var(--primary)", background: "var(--primary-light)", border: "1px solid var(--border-color)" }}>{order.status}</span>
              </div>
              <div>
              {order.paymentMethod && (
                <div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Payment method</p>
                  <p style={{ fontWeight: "700" }}>{order.paymentMethod}</p>
                </div>
              )}
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Order total</p>
                <p style={{ fontWeight: "800", fontSize: "1.1rem", color: "var(--primary)" }}>₹{order.totalAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Items Ordered ({order.items.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                  <span>{item.productName} &times; {item.quantity}</span>
                  <span style={{ fontWeight: "700" }}>₹{item.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          {order && <Link to={`/orders/${order.id}`}>
            <Button variant="primary" style={{ padding: "12px 24px" }}>
              <Package size={18} />
              <span>View Order</span>
            </Button>
          </Link>}

          <Link to="/products">
            <Button variant="secondary" style={{ padding: "12px 24px" }}>
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
