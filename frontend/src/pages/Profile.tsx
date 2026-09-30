import type { ReactNode } from "react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Address, Order } from "../types/order";
import { getUserAddresses } from "../services/addressService";
import { getMyOrders } from "../services/orderService";
import { getWishlist, removeFromWishlist, moveToCart, type WishlistResponse } from "../services/wishlistService";
import { updateMyProfile } from "../services/authService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import ImageWithFallback from "../components/ImageWithFallback";
import { Heart, Calendar, LogOut, Mail, MapPin, Package, User, Trash2, ShoppingCart, ArrowRight, Edit2, ShieldCheck } from "lucide-react";
import { getErrorMessage } from "../utils/errorMessage";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

type Section = "personal" | "orders" | "wishlist" | "addresses";
function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [params, setParams] = useSearchParams();
  const section = (params.get("section") as Section) || "personal";
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setFeedback("");
    const load = section === "orders" ? getMyOrders().then((value) => { if (active) setOrders(value); })
      : section === "wishlist" ? getWishlist().then((value) => { if (active) setWishlist(value); })
      : section === "addresses" ? getUserAddresses().then((value) => { if (active) setAddresses(value); })
      : Promise.resolve();
    load.catch((err: unknown) => { if (active) setError(getErrorMessage(err, "Unable to load this account section.")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [section]);

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 100) { setError("Name must be between 2 and 100 characters."); return; }
    try { setSaving(true); setError(""); const updated = await updateMyProfile(trimmed); updateUser(updated); setName(updated.name || trimmed); setEditing(false); setFeedback("Personal details saved."); }
    catch (err: unknown) { setError(getErrorMessage(err, "Unable to save your details.")); }
    finally { setSaving(false); }
  }

  async function wishlistAction(productId: number, action: "remove" | "move") {
    try { setActionLoadingId(productId); setError("");
      if (action === "move") await moveToCart(productId);
      const updated = await removeFromWishlist(productId); setWishlist(updated);
      window.dispatchEvent(new Event("wishlist-updated"));
      setFeedback(action === "move" ? "Item moved to your cart." : "Item removed from your wishlist.");
    } catch (err: unknown) { setError(getErrorMessage(err, "Wishlist update failed.")); }
    finally { setActionLoadingId(null); }
  }

  const sections: { id: Section; label: string; icon: ReactNode }[] = [
    { id: "personal", label: "Personal Details", icon: <User size={18} /> },
    { id: "orders", label: "Orders", icon: <Package size={18} /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={18} /> },
  ];
  return <main className="account-page">
    <header className="account-page-header"><div><p className="account-eyebrow">Account center</p><h1>{user?.name || "My Account"}</h1><p>{user?.email ? `${user.email} · ${user.role || "Customer"}` : "Manage your personal details and shopping activity."}</p></div></header>
    <div className="account-layout">
      <aside className="account-sidebar" aria-label="Account navigation">
        <div className="account-sidebar-user"><span className="account-avatar" aria-hidden="true"><User size={22} /></span><div><strong>{user?.name || "NovaCart customer"}</strong><span>{user?.email}</span></div></div>
        <nav className="account-nav">{sections.map((item) => <button key={item.id} type="button" className={`account-nav-link${section === item.id ? " active" : ""}`} aria-current={section === item.id ? "page" : undefined} onClick={() => { setParams(item.id === "personal" ? {} : { section: item.id }); setEditing(false); }}>{item.icon}{item.label}</button>)}</nav>
        <button type="button" className="account-logout" onClick={logout}><LogOut size={18} /> Logout</button>
      </aside>
      <section className="account-content" aria-live="polite">
        {error && <ErrorMessage message={error} />}{feedback && <p className="account-feedback" role="status">{feedback}</p>}
        {loading ? <LoadingMessage /> : <>
          {section === "personal" && <>
            <div className="account-section-heading"><div><p className="account-eyebrow">Personal information</p><h2>Profile details</h2></div><span className="account-role"><ShieldCheck size={15} /> {user?.role || "Customer"}</span></div>
            {editing ? <form className="profile-edit-form" onSubmit={saveDetails}><label htmlFor="profile-name">Name</label><input id="profile-name" value={name} minLength={2} maxLength={100} required onChange={(e) => setName(e.target.value)} />{user?.email && <p>Email <strong>{user.email}</strong></p>}<div className="profile-form-actions"><Button type="button" variant="secondary" onClick={() => { setName(user?.name || ""); setEditing(false); }}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button></div></form> : <><dl className="profile-fields"><ProfileField icon={<User size={18} />} label="Name" value={user?.name || "Not provided"} /><ProfileField icon={<Mail size={18} />} label="Email" value={user?.email || "Not provided"} />{user?.createdAt && <ProfileField icon={<Calendar size={18} />} label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />}</dl><Button className="profile-edit-button" onClick={() => setEditing(true)}><Edit2 size={16} /> Edit Personal Details</Button></>}
          </>}
          {section === "orders" && <><div className="account-section-heading"><div><p className="account-eyebrow">Purchase history</p><h2>My Orders</h2></div><Package /></div>{!orders.length ? <EmptyState message="You have no orders yet." /> : <div className="account-order-list">{orders.map((order) => <article className="account-order" key={order.id}><div><strong>Order #{order.id}</strong><p>{new Date(order.createdAt).toLocaleDateString()} · {order.status}</p>{order.paymentMethod && <small>Payment: {order.paymentMethod}</small>}<OrderStatusTimeline status={order.status} compact /></div><strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong><Link className="btn btn-secondary" to={`/orders/${order.id}`}>View Details <ArrowRight size={15} /></Link></article>)}</div>}</>}
          {section === "wishlist" && <><div className="account-section-heading"><div><p className="account-eyebrow">Saved for later</p><h2>Wishlist</h2></div><Heart /></div>{!wishlist?.items.length ? <EmptyState message="Your wishlist is empty." /> : <div className="account-wishlist-list">{wishlist.items.map((item) => <article className="account-wishlist-item" key={item.id}><Link to={`/products/${item.productId}`}><ImageWithFallback src={item.imageUrl} alt={item.productName} /></Link><div className="account-wishlist-info"><Link to={`/products/${item.productId}`}><strong>{item.productName}</strong></Link><b>₹{item.unitPrice.toLocaleString("en-IN")}</b><span>{item.isInStock ? "In Stock" : "Out of Stock"}</span><Link to={`/products/${item.productId}`}>View Product</Link></div><div className="account-wishlist-actions"><Button disabled={!item.isInStock || actionLoadingId === item.productId} onClick={() => void wishlistAction(item.productId, "move")}><ShoppingCart size={15} />{actionLoadingId === item.productId ? "Working…" : "Move to Cart"}</Button><Button variant="secondary" disabled={actionLoadingId === item.productId} onClick={() => void wishlistAction(item.productId, "remove")}><Trash2 size={15} />Remove</Button></div></article>)}</div>}</>}
          {section === "addresses" && <><div className="account-section-heading"><div><p className="account-eyebrow">Delivery details</p><h2>Saved Addresses</h2></div><MapPin /></div>{!addresses.length ? <p className="account-empty">No saved addresses found. Addresses saved during checkout will appear here.</p> : <div className="address-list">{addresses.map((address) => <article className="address-item" key={address.id}><strong>{address.fullName}</strong><p>{address.addressLine}</p><span>{address.city}, {address.state} {address.postalCode} · {address.country}</span></article>)}</div>}</>}
        </>}
      </section>
    </div>
  </main>;
}
function ProfileField({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="profile-field"><span className="profile-field-icon" aria-hidden="true">{icon}</span><div><dt>{label}</dt><dd>{value}</dd></div></div>; }
export default Profile;
