import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist, moveToCart, type WishlistResponse } from "../services/wishlistService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import ImageWithFallback from "../components/ImageWithFallback";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { getErrorMessage } from "../utils/errorMessage";

function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");
      const data = await getWishlist();
      setWishlist(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load wishlist."));
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId: number) {
    try {
      setActionLoadingId(productId);
      setActionMessage("");
      const updated = await removeFromWishlist(productId);
      setWishlist(updated);
      window.dispatchEvent(new Event("wishlist-updated"));
      setActionMessage("Item removed from your wishlist.");
    } catch (err: unknown) {
      setActionMessage(getErrorMessage(err, "Could not remove item."));
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleMoveToCart(productId: number) {
    try {
      setActionLoadingId(productId);
      setActionMessage("");
      await moveToCart(productId);
      // Reload wishlist to reflect removed item
      const updated = await getWishlist();
      setWishlist(updated);
      window.dispatchEvent(new Event("wishlist-updated"));
      setActionMessage("Item moved to your cart.");
    } catch (err: unknown) {
      setActionMessage(getErrorMessage(err, "Could not move to cart."));
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    queueMicrotask(() => void loadWishlist());
  }, []);

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <Heart size={28} color="var(--primary)" fill="var(--primary-light)" />
        <div><h1 style={{ margin: 0 }}>My Wishlist</h1><p style={{ color: "var(--text-muted)", marginTop: "4px" }}>{wishlist?.items.length || 0} saved item{wishlist?.items.length === 1 ? "" : "s"}</p></div>
      </div>

      {error && <ErrorMessage message={error} />}

      {actionMessage && <p role="status" aria-live="polite" style={{ marginBottom: "16px", padding: "12px 14px", color: "var(--primary)", background: "var(--primary-light)", border: "1px solid var(--border-color)" }}>{actionMessage}</p>}

      {!wishlist || wishlist.items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <EmptyState message="Your wishlist is empty." />
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "16px" }}>
            <span>Browse Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {wishlist.items.map((item) => (
            <div key={item.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              flexWrap: "wrap"
            }}>
              <Link to={`/products/${item.productId}`}>
                <ImageWithFallback 
                  src={item.imageUrl} 
                  alt={item.productName} 
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "var(--radius-md)" }}
                />
              </Link>
              
              <div style={{ flex: 1, minWidth: "200px" }}>
                <Link to={`/products/${item.productId}`} style={{ fontWeight: "700", fontSize: "1.1rem", display: "block", marginBottom: "8px" }}>
                  {item.productName}
                </Link>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)", marginBottom: "8px" }}>
                  ₹{item.unitPrice.toLocaleString("en-IN")}
                </div>
                <span className={`status-badge ${item.isInStock ? "status-shipped" : "status-cancelled"}`}>
                  {item.isInStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Button 
                  variant="primary" 
                  onClick={() => handleMoveToCart(item.productId)}
                  disabled={!item.isInStock || actionLoadingId === item.productId}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <ShoppingCart size={16} />
                  <span>{actionLoadingId === item.productId ? "Moving to Cart..." : "Move to Cart"}</span>
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => handleRemove(item.productId)}
                  disabled={actionLoadingId === item.productId}
                  style={{ width: "100%", justifyContent: "center", color: "var(--error)" }}
                >
                  <Trash2 size={16} />
                  <span>{actionLoadingId === item.productId ? "Removing..." : "Remove"}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
