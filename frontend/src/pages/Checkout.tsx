import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Cart } from "../types/cart";
import type { Address } from "../types/order";
import { getCart } from "../services/cartService";
import { createAddress, getUserAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import { createRazorpayOrder } from "../services/razorpayService";
import { loadRazorpayCheckout } from "../services/razorpayCheckout";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";
import Button from "../components/Button";
import { getErrorMessage } from "../utils/errorMessage";
import { 
  MapPin, 
  CheckCircle2, 
  PlusCircle, 
  ShoppingBag, 
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // New Address Form state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [fullName, setFullName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [cartData, addressData] = await Promise.all([getCart(), getUserAddresses()]);
        setCart(cartData);
        setAddresses(addressData);
        if (addressData.length > 0 && addressData[0].id) {
          setSelectedAddressId(addressData[0].id);
        } else {
          setShowNewAddress(true);
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load checkout details."));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !addressLine || !city || !state || !postalCode || !country) {
      setError("Please fill in all address fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const newAddress = await createAddress({ fullName, addressLine, city, state, postalCode, country });
      setAddresses((prev) => [...prev, newAddress]);
      if (newAddress.id) {
        setSelectedAddressId(newAddress.id);
      }
      setShowNewAddress(false);
      setFullName("");
      setAddressLine("");
      setCity("");
      setState("");
      setPostalCode("");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save address."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePlaceOrder() {
    if (submitting) return;
    if (!selectedAddressId) {
      setError("Please select or add a shipping address.");
      return;
    }
    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty. Add a product before checking out.");
      return;
    }

    if (paymentMethod === "Razorpay") {
      setSubmitting(true);
      setError("");
      setPaymentNotice("");
      let checkoutOpened = false;
      let checkoutResultHandled = false;
      try {
        const order = await createRazorpayOrder();
        await loadRazorpayCheckout();
        if (!window.Razorpay) throw new Error("Razorpay Checkout is unavailable.");

        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "NovaCart",
          description: "NovaCart Order",
          order_id: order.orderId,
          theme: { color: "#2563EB" },
          handler: (response) => {
            checkoutResultHandled = true;
            setSubmitting(false);
            setPaymentNotice(`Razorpay returned a response for order ${response.razorpay_order_id}. Payment verification is pending; this NovaCart order is not confirmed yet.`);
          },
          modal: {
            ondismiss: () => {
              setSubmitting(false);
              if (!checkoutResultHandled) setError("Payment was cancelled. You can try again.");
            },
          },
        });
        checkout.on("payment.failed", () => {
          checkoutResultHandled = true;
          setSubmitting(false);
          setError("Unable to complete payment. Please try again.");
        });
        checkout.open();
        checkoutOpened = true;
      } catch {
        setError("Unable to start payment. Please try again.");
      } finally {
        if (!checkoutOpened) setSubmitting(false);
      }
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setPaymentNotice("");
      const createdOrder = await createOrder(selectedAddressId, paymentMethod);
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to place order. Cart may be empty or out of stock."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      <Link to="/cart" className="btn btn-secondary route-back-link" aria-label="Back to Cart"><ArrowLeft size={16} /><span>Back to Cart</span></Link>
      <div className="checkout-page-header">
        <h1 style={{ marginBottom: "4px" }}>Checkout</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Confirm your delivery address and complete your order securely.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {!cart || cart.items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <ShoppingBag size={48} color="var(--primary)" style={{ marginBottom: "16px" }} />
          <h2>Your cart is empty.</h2>
          <Button variant="primary" onClick={() => navigate("/products")} style={{ marginTop: "16px" }}>
            Browse Catalog
          </Button>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* Main Checkout Form / Address Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <section className="checkout-section">
              <div className="checkout-section-heading">
                <MapPin size={22} color="var(--primary)" />
                <h2 style={{ fontSize: "1.3rem", margin: 0 }}>1. Shipping Address</h2>
              </div>

              {addresses.length > 0 && !showNewAddress && (
                <div className="address-options">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        className={`address-option ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedAddressId(addr.id!)}
                        aria-pressed={isSelected}
                      >
                        <div>
                          <p style={{ fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                            {addr.fullName}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            {addr.addressLine}
                          </p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            {addr.city}, {addr.state} {addr.postalCode} &bull; {addr.country}
                          </p>
                        </div>
                        {isSelected && <CheckCircle2 size={22} color="var(--primary)" />}
                      </button>
                    );
                  })}

                  <Button
                    variant="secondary"
                    onClick={() => setShowNewAddress(true)}
                    style={{ marginTop: "12px", width: "fit-content" }}
                  >
                    <PlusCircle size={18} />
                    <span>Add New Address</span>
                  </Button>
                </div>
              )}

              {showNewAddress && (
                <form onSubmit={handleAddAddress} className="new-address-form">
                  <h3 style={{ fontSize: "1.1rem" }}>Enter New Shipping Address</h3>

                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Akshitha Sharma"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="addressLine">Street Address</label>
                    <Input
                      id="addressLine"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. 123 Innovation Way, Apt 4B"
                      required
                    />
                  </div>

                  <div className="checkout-form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State / Province</label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-form-row">
                    <div className="form-group">
                      <label htmlFor="postalCode">Zip / Postal Code</label>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 400001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-form-actions">
                    <Button type="submit" variant="primary" disabled={submitting}>
                      Save Address
                    </Button>
                    {addresses.length > 0 && (
                      <Button type="button" variant="secondary" onClick={() => setShowNewAddress(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
              </section>

            {/* Payment Method Banner */}
            <section className="checkout-section payment-section">
              <div className="checkout-section-heading">
                <CreditCard size={22} color="var(--primary)" />
                <h2 style={{ fontSize: "1.3rem", margin: 0 }}>2. Payment Method</h2>
              </div>
              <div className="payment-options" role="radiogroup" aria-label="Payment method">
                {[
  {
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    details: "Available for eligible orders",
    icon: Banknote,
  },
  {
    name: "UPI",
    description: "Pay instantly using your UPI ID",
    details: "Google Pay • PhonePe • Paytm • BHIM",
    icon: Smartphone,
  },
  {
    name: "Credit / Debit Card",
    description: "Secure card payment",
    details: "Visa • Mastercard • RuPay",
    icon: CreditCard,
  },
  {
    name: "Net Banking",
    description: "Pay directly from your bank account",
    details: "SBI • HDFC • ICICI • Axis • Other banks",
    icon: Landmark,
  },
  {
    name: "Razorpay",
    description: "Secure online payment",
    details: "UPI • Cards • Net Banking • Wallets",
    icon: CreditCard,
  },
].map(({ name, description, details, icon: Icon }) => {
                  const selected = paymentMethod === name;
                  return <button key={name} type="button" role="radio" aria-checked={selected} className={`payment-option ${selected ? "selected" : ""}`} onClick={() => setPaymentMethod(name)}>
                    <Icon
                      size={20}
                      color="var(--primary)"
                      style={{ marginBottom: "8px" }}
                    />

                    <strong style={{ display: "block" }}>
                      {name}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                        marginTop: "4px",
                      }}
                    >
                      {description}
                    </span>

                    <span
                      style={{
                        display: "block",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        marginTop: "6px",
                      }}
                    >
                      {details}
                    </span>
                  </button>;
                })}
              </div>
              {paymentMethod === "Razorpay" && (
                <p className="payment-note">
                  Razorpay Checkout
                  {import.meta.env.DEV ? " · Test Mode" : ""}.
                  Payment is not marked complete until verified.
                </p>
              )}
            </section>
          </div>

          {/* Sticky Summary */}
          <aside className="checkout-summary cart-summary-card">
            <h2 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-main)", fontWeight: "500" }}>
                    {item.productName} <span style={{ color: "var(--text-muted)" }}>x{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: "700" }}>₹{item.subtotal.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="summary-row total">
              <span>Total Payable</span>
              <span style={{ color: "var(--primary)" }}>₹{cart.total.toLocaleString("en-IN")}</span>
            </div>

            <Button
              variant="primary"
              disabled={submitting || !selectedAddressId}
              onClick={handlePlaceOrder}
              style={{ width: "100%", padding: "14px", marginTop: "24px", fontSize: "1.05rem" }}
            >
              <span>{submitting ? (paymentMethod === "Razorpay" ? "Starting Payment..." : "Processing Order...") : paymentMethod === "Razorpay" ? "Pay Now" : "Place Order Now"}</span>
              <ArrowRight size={20} />
            </Button>

            <p className="checkout-summary-note">{paymentMethod === "Razorpay" ? "Payment verification is required before order confirmation." : "Payment selection is recorded with your order."}</p>
            {paymentNotice && <p className="checkout-payment-notice" role="status" aria-live="polite">{paymentNotice}</p>}
          </aside>
        </div>
      )}
    </main>
  );
}

export default Checkout;
