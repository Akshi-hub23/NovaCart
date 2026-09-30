import { useState, useEffect, useRef, startTransition, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/cartService";
import { getCategories } from "../services/categoryService";
import {
  ShoppingBag,
  Store,
  ShoppingCart,
  User as UserIcon,
  ShieldCheck,
  LogIn,
  UserPlus,
  Menu,
  X,
  Search,
  Sparkles,
  Shirt,
  Smartphone,
  Monitor,
  Headphones,
  House,
  CookingPot,
  Gamepad2,
  Apple,
  Dumbbell,
  Sofa,
  BookOpen,
  Heart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // Close mobile menu on route change
    startTransition(() => setMobileMenuOpen(false));
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      getCart().catch(() => null).then((cart) => {
        if (cart) {
          setCartCount(
            cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
          );
        }
      });
    } else {
      startTransition(() => {
        setCartCount(0);
      });
    }
  }, [isAuthenticated, location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  }

  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/" className="brand-logo">
          <ShoppingBag size={28} />
          <span>NovaCart</span>
        </Link>

        <form className="header-search" onSubmit={handleSearch} role="search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products, brands and more"
            aria-label="Search products"
          />
          <button type="submit" aria-label="Submit product search">Search</button>
        </form>

        {/* Desktop Navigation */}
        <nav className="nav-links-desktop" aria-label="Main navigation">

          <Link
            to="/cart"
            className={`nav-link cart-link ${isActive("/cart") ? "active" : ""}`}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                <UserIcon size={18} />
                <span>Profile</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`nav-link admin-pill ${isActive("/admin") ? "active" : ""}`}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              )}

            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ padding: "6px 16px" }}
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "6px 16px" }}
              >
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <CategoryNavigation />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">

          <Link
            to="/cart"
            className={`nav-link cart-link ${isActive("/cart") ? "active" : ""}`}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                <UserIcon size={20} />
                <span>Profile</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`nav-link admin-pill ${isActive("/admin") ? "active" : ""}`}
                >
                  <ShieldCheck size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              )}

            </>
          ) : (
            <div
              className="mobile-auth-btns"
              style={{ display: "flex", gap: "10px", marginTop: "10px" }}
            >
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function getCategoryIcon(name: string) {
  const category = name.toLowerCase();
  if (category.includes("fashion") || category.includes("cloth")) return Shirt;
  if (category.includes("mobile") || category.includes("phone")) return Smartphone;
  if (category.includes("electronic") || category.includes("computer")) return Monitor;
  if (category.includes("audio") || category.includes("headphone")) return Headphones;
  if (category.includes("health")) return Heart;
  if (category.includes("beauty")) return Sparkles;
  if (category.includes("appliance")) return CookingPot;
  if (category.includes("home") || category.includes("kitchen")) return House;
  if (category.includes("toy") || category.includes("game")) return Gamepad2;
  if (category.includes("food") || category.includes("grocery")) return Apple;
  if (category.includes("sport") || category.includes("fitness")) return Dumbbell;
  if (category.includes("furniture")) return Sofa;
  if (category.includes("book")) return BookOpen;
  if (category.includes("you") || category.includes("recommend")) return Sparkles;
  return Store;
}

function CategoryNavigation() {
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string; parentCategoryId?: number | null }[]>([]);
  const [compact, setCompact] = useState(false);
  const [openRootId, setOpenRootId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    const onScroll = () => setCompact(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpenRootId(null);
    setExpandedIds(new Set());
  }, [location.pathname, location.search]);
  useEffect(() => {
    if (openRootId === null) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpenRootId(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenRootId(null);
        navRef.current?.querySelector<HTMLButtonElement>(".market-nav-item > button[aria-expanded='true']")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openRootId]);
  const seenIds = new Set<number>();
  const seenNames = new Set<string>();
  const rootCategories = categories.filter((category) => {
    if (category.parentCategoryId != null || seenIds.has(category.id)) return false;
    const normalizedName = category.name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
    if (!normalizedName || seenNames.has(normalizedName)) return false;
    seenIds.add(category.id);
    seenNames.add(normalizedName);
    return true;
  });
  const routeCategoryId = Number(new URLSearchParams(location.search).get("category"));
  const activeRouteRootId = Number.isFinite(routeCategoryId) && routeCategoryId > 0 ? getRootCategoryId(routeCategoryId, categories) : null;
  const openRoot = rootCategories.find((category) => category.id === openRootId);
  const rootChildren = openRoot ? categories.filter((category) => category.parentCategoryId === openRoot.id) : [];
  const toggleBranch = (categoryId: number) => setExpandedIds((current) => {
    const next = new Set(current);
    if (next.has(categoryId)) next.delete(categoryId);
    else next.add(categoryId);
    return next;
  });

  return <nav ref={navRef} className={`market-nav${compact ? " is-compact" : ""}`} aria-label="Shop by category">
    <div className="market-nav-inner">
      <div className="market-nav-item"><Link to="/" className={location.pathname === "/" ? "active" : undefined} aria-current={location.pathname === "/" ? "page" : undefined}><Sparkles size={19} strokeWidth={1.8} aria-hidden="true" /><span>For You</span></Link></div>
      {rootCategories.map((category) => {
        const Icon = getCategoryIcon(category.name);
        const children = categories.some((item) => item.parentCategoryId === category.id);
        const isOpen = openRootId === category.id;
        const active = isOpen || activeRouteRootId === category.id;
        return <div className="market-nav-item" key={category.id}>
          {children ? <button type="button" className={active ? "active" : undefined} aria-expanded={isOpen} aria-haspopup="true" onClick={() => { setOpenRootId(isOpen ? null : category.id); setExpandedIds(new Set()); }}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span className="market-nav-label">{category.name}<ChevronDown size={14} className="market-nav-chevron" aria-hidden="true" /></span></button> : <Link to={`/products?category=${category.id}`}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{category.name}</span></Link>}
        </div>;
      })}
    </div>
    {openRoot && <div className="market-category-menu" role="region" aria-label={`${openRoot.name} categories`}>
      <div className="market-category-menu-heading"><Link to={`/products?category=${openRoot.id}`}>Browse {openRoot.name}</Link><button type="button" className="market-menu-close" onClick={() => setOpenRootId(null)} aria-label="Close categories"><X size={18} /></button></div>
      <CategoryBranch items={rootChildren} categories={categories} expandedIds={expandedIds} onToggle={toggleBranch} />
    </div>}
  </nav>;
}

function getRootCategoryId(categoryId: number, categories: NavigationCategory[]): number | null {
  let current = categories.find((category) => category.id === categoryId);
  while (current?.parentCategoryId) current = categories.find((category) => category.id === current?.parentCategoryId);
  return current?.id ?? null;
}

type NavigationCategory = { id: number; name: string; parentCategoryId?: number | null };

function CategoryBranch({ items, categories, expandedIds, onToggle, nested = false }: {
  items: NavigationCategory[];
  categories: NavigationCategory[];
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  nested?: boolean;
}) {
  return <ul className={`market-category-menu-list${nested ? " market-category-nested" : ""}`}>
    {items.map((category) => {
      const children = categories.filter((item) => item.parentCategoryId === category.id);
      const expanded = expandedIds.has(category.id);
      return <li key={category.id}>
        <div className="market-category-menu-row">
          {children.length ? <button type="button" aria-expanded={expanded} onClick={() => onToggle(category.id)}>{category.name}</button> : <Link to={`/products?category=${category.id}`}>{category.name}</Link>}
          {children.length > 0 && <button type="button" className="market-subcategory-toggle" aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name}`} aria-expanded={expanded} onClick={() => onToggle(category.id)}><ChevronRight size={16} aria-hidden="true" /></button>}
        </div>
        {expanded && children.length > 0 && <CategoryBranch items={children} categories={categories} expandedIds={expandedIds} onToggle={onToggle} nested />}
      </li>;
    })}
  </ul>;
}

export default Header;

