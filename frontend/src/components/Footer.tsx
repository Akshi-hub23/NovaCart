import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo" style={{ marginBottom: "12px" }}>
            <ShoppingBag size={24} />
            <span>NovaCart</span>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "320px", marginBottom: "16px" }}>
            Experience premium online shopping with curated collections, fast shipping, and seamless checkout experience.
          </p>
          <div style={{ display: "flex", gap: "12px", color: "var(--text-muted)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
              <ShieldCheck size={16} color="var(--primary)" /> 100% Secure Checkout
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop & Explore</h4>
          <ul>
            <li><Link to="/">Home Landing</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/cart">View Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/products?category=1">Featured Items</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account & Support</h4>
          <ul>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/profile">Profile Settings</Link></li>
            <li><Link to="/login">Account Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Need a hand?</h4>
          <ul style={{ gap: "12px" }}>
            <li>Check your <Link to="/orders">order status</Link> anytime.</li>
            <li>Keep your delivery details in <Link to="/profile">Profile</Link>.</li>
            <li>Browse <Link to="/products">all products</Link> to continue shopping.</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} NovaCart. Designed for seamless shopping.</p>
        <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Made with <Heart size={14} fill="var(--error)" color="var(--error)" /> for modern e-commerce UX
        </p>
      </div>
    </footer>
  );
}

export default Footer;
