import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Order } from "../../types/order";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "../../services/orderService";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { getErrorMessage } from "../../utils/errorMessage";

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const data = await getAllOrdersAdmin();
      setOrders(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load admin orders."));
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      setUpdatingId(id);
      setError("");
      const updatedOrder = await updateOrderStatusAdmin(id, newStatus);
      setOrders((current) => current.map((order) => order.id === id ? updatedOrder : order));
      setFeedback(`Order #${id} status updated to ${updatedOrder.status}.`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update order status."));
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    queueMicrotask(() => void loadOrders());
  }, []);

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main className="admin-page admin-orders-page" style={{ textAlign: "left", paddingBottom: "60px" }}>
      <Link to="/admin" className="btn btn-secondary admin-back-link">
        <ArrowLeft size={16} />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="admin-page-heading">
        <h1 style={{ marginBottom: "4px" }}>Order Fulfillment Management</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Monitor customer purchases and update order dispatch & delivery status.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {feedback && <p className="admin-feedback" role="status">{feedback}</p>}

      <section className="admin-orders-grid" aria-label="Orders">
        {orders.map((ord) => <article className="admin-order-card" key={ord.id}>
          <header className="admin-order-card-header"><div><span className="admin-order-eyebrow">Order reference</span><h2>#{ord.id}</h2></div><span className={`status-badge status-${ord.status.toLowerCase()}`}>{ord.status}</span></header>
          <dl className="admin-order-summary"><div><dt>Customer</dt><dd>User #{ord.userId}</dd></div><div><dt>Order date</dt><dd>{new Date(ord.createdAt).toLocaleDateString()}</dd></div><div><dt>Total amount</dt><dd className="admin-order-total">&#8377;{ord.totalAmount.toLocaleString("en-IN")}</dd></div><div><dt>Payment method</dt><dd>{ord.paymentMethod || "Not specified"}</dd></div></dl>
          <div className="admin-order-status-row"><label htmlFor={`order-status-${ord.id}`}>Update status</label><select id={`order-status-${ord.id}`} className="select-control admin-order-status" disabled={updatingId === ord.id} value={ord.status} onChange={(event) => handleStatusChange(ord.id, event.target.value)}><option value={ord.status}>{ord.status}</option>{getNextOrderStatus(ord.status) && <option value={getNextOrderStatus(ord.status)!}>{getNextOrderStatus(ord.status)}</option>}{!['Cancelled', 'Delivered'].includes(ord.status) && <option value="Cancelled">Cancelled</option>}</select>{updatingId === ord.id && <span className="admin-order-saving" role="status">Saving order update…</span>}</div>
          <button type="button" className="admin-order-details" aria-expanded={expandedOrderId === ord.id} aria-controls={`order-details-${ord.id}`} onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}>{expandedOrderId === ord.id ? "Hide order details" : "View order details"}<ChevronDown className={expandedOrderId === ord.id ? "admin-details-chevron open" : "admin-details-chevron"} size={16} aria-hidden="true" /></button>
          {expandedOrderId === ord.id && <div className="admin-order-expanded" id={`order-details-${ord.id}`}><div className="admin-order-items"><h3>Items ({ord.items.length})</h3>{ord.items.map((item) => <div className="admin-order-item" key={item.id}><div><strong>{item.productName}</strong><span>{item.quantity} × &#8377;{item.unitPrice.toLocaleString("en-IN")}</span></div><strong>&#8377;{item.totalPrice.toLocaleString("en-IN")}</strong></div>)}</div>{ord.address && <div className="admin-order-address"><h3>Delivery address</h3><strong>{ord.address.fullName}</strong><p>{ord.address.addressLine}</p><p>{ord.address.city}, {ord.address.state} {ord.address.postalCode}</p></div>}</div>}
        </article>)}
      </section>
    </main>
  );
}

function getNextOrderStatus(status: string): string | null {
  const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const currentIndex = statuses.indexOf(status);
  return currentIndex >= 0 && currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : null;
}

export default AdminOrders;
