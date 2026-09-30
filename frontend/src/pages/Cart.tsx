import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Cart as CartType } from "../types/cart";
import { clearCart, getCart, removeCartItem, updateCartItem } from "../services/cartService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorMessage";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Store, 
  Minus, 
  Plus, 
  LogIn 
} from "lucide-react";

function Cart() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function loadCartData() {
    try {
      setLoading(true);
      setError("");
      const data = await getCart();
      setCart(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load shopping cart."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) queueMicrotask(() => void loadCartData());
  }, [isAuthenticated]);

  async function handleQuantityChange(cartItemId: number, currentQty: number, change: number, maxStock?: number) {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    if (maxStock !== undefined && newQty > maxStock) return;

    try {
      setActionLoading(cartItemId);
      setError("");
      const updatedCart = await updateCartItem(cartItemId, newQty);
      setCart(updatedCart);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not update quantity."));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemove(cartItemId: number) {
    try {
      setActionLoading(cartItemId);
      setError("");
      const updatedCart = await removeCartItem(cartItemId);
      setCart(updatedCart);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not remove item."));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleClearCart() {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      setLoading(true);
      setError("");
      await clearCart();
      setCart(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not clear cart."));
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <main>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <ShoppingCart size={48} color="var(--primary)" style={{ marginBottom: "16px" }} />
          <h1>Shopping Cart</h1>
          <EmptyState message="Please log in to view and manage items in your cart." />
          <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => navigate("/login")}>
              <LogIn size={18} />
              <span>Go to Login</span>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) return <main><LoadingMessage /></main>;

  const itemsCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ marginBottom: "4px" }}>Your Shopping Cart</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {itemsCount > 0 ? `You have ${itemsCount} item(s) ready for checkout.` : "Your cart is currently empty."}
          </p>
        </div>

        {cart && cart.items.length > 0 && (
          <Button variant="secondary" onClick={handleClearCart} style={{ fontSize: "0.85rem", padding: "8px 14px" }}>
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </Button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {!cart || cart.items.length === 0 ? (
        <div className="cart-empty-state">
          <EmptyState message="Your cart has no items. Start browsing our catalog!" />
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "20px" }}>
            <Store size={18} />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items List */}
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image" aria-label={`${item.productName} image unavailable`}>
                  <ShoppingCart size={28} />
                </div>
                <div className="cart-item-details">
                  <Link to={`/products/${item.productId}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "6px", color: "var(--text-main)" }}>
                      {item.productName}
                    </h3>
                  </Link>
                  <p style={{ color: "var(--primary)", fontWeight: "800", fontSize: "1.1rem" }}>
                    ₹{item.price.toLocaleString("en-IN")} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "normal" }}>each</span>
                  </p>
                </div>

                <div className="quantity-picker cart-quantity-picker" aria-label={`Quantity for ${item.productName}`}>
                  <button
                    type="button"
                    aria-label={`Decrease ${item.productName} quantity`}
                    disabled={actionLoading === item.id || item.quantity <= 1}
                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.productName} quantity`}
                    disabled={actionLoading === item.id}
                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="cart-item-total">
                  <span className="cart-item-subtotal-label">Item subtotal</span>
                  <div className="cart-item-subtotal">
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </div>
                  <button
                    type="button"
                    disabled={actionLoading === item.id}
                    onClick={() => handleRemove(item.id)}
                    className="cart-remove-button"
                    aria-label={`Remove ${item.productName} from cart`}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-card">
            <h2 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({itemsCount} items)</span>
              <span>₹{cart.total.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row total">
              <span>Order Total</span>
              <span style={{ color: "var(--primary)" }}>₹{cart.total.toLocaleString("en-IN")}</span>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate("/checkout")}
              style={{ width: "100%", padding: "14px", marginTop: "24px", fontSize: "1.05rem" }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} />
            </Button>

            <p className="cart-summary-note">Your total reflects the current cart data.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
