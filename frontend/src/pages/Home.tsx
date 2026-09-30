import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import type { Category } from "../types/category";
import type { Product } from "../types/product";
import ProductCard from "../components/ProductCard";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import ImageWithFallback from "../components/ImageWithFallback";
import {
  ArrowRight,
  RotateCcw,
  Truck,
  Headphones,
  ShieldCheck,
} from "lucide-react";


function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCategories().catch(() => [])])
      .then(([productData, categoryData]) => {
        setProducts(productData.filter((product) => product.isActive !== false));
        setCategories(categoryData);
      })
      .catch(() => setError("We could not load the latest products."))
      .finally(() => setLoading(false));
  }, []);

  const newestProducts = useMemo(() => [...products].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }), [products]);
  const newArrivals = newestProducts.slice(0, 4);
  const featuredProducts = products.filter((product) => !newArrivals.some((item) => item.id === product.id)).slice(0, 4);
  const allDealProducts = products
    .filter((product) => Number(product.attributes?.discountPercent || 0) > 0)
    .sort((a, b) => Number(b.attributes?.discountPercent || 0) - Number(a.attributes?.discountPercent || 0));
  const dealProducts = allDealProducts.slice(0, 4);
  const highestDiscount = Math.max(0, ...allDealProducts.map((product) => Number(product.attributes?.discountPercent || 0)));
  const heroVisualProducts = [
    ...allDealProducts.slice(0, 4),
    ...newestProducts.filter((product) => !allDealProducts.slice(0, 4).some((deal) => deal.id === product.id)),
  ].slice(0, 4);
  const homeCategoryOrder = ["electronics", "mobiles", "fashion", "beauty", "toys", "food", "health", "home appliances"];
  const electronicsCategory = categories.find((category) => !category.parentCategoryId && category.name.trim().toLowerCase() === "electronics");
  const smartTechIds = electronicsCategory ? getCategoryIds(electronicsCategory.id, categories) : null;
  const smartTechProduct = (smartTechIds ? products.find((product) => smartTechIds.has(product.categoryId)) : undefined) || featuredProducts[0] || newArrivals[0];
  const categoryCards = categories
    .filter((category, index, roots) => !category.parentCategoryId && homeCategoryOrder.includes(category.name.trim().toLowerCase()) && roots.findIndex((item) => item.name.trim().toLowerCase() === category.name.trim().toLowerCase()) === index)
    .sort((a, b) => homeCategoryOrder.indexOf(a.name.trim().toLowerCase()) - homeCategoryOrder.indexOf(b.name.trim().toLowerCase()))
    .map((category) => ({ category, product: products.find((product) => getCategoryIds(category.id, categories).has(product.categoryId)) }))
    .filter((item): item is { category: Category; product: Product } => Boolean(item.product));
  const categoryOfferCards = categories
    .filter((category, index, all) => {
      const normalizedName = category.name.trim().toLowerCase();
      return !category.parentCategoryId && homeCategoryOrder.includes(normalizedName) && all.findIndex((item) => !item.parentCategoryId && item.name.trim().toLowerCase() === normalizedName) === index;
    })
    .map((category) => {
      const ids = getCategoryIds(category.id, categories);
      const categoryDeals = allDealProducts.filter((product) => ids.has(product.categoryId));
      return { category, product: categoryDeals[0], discount: Math.max(0, ...categoryDeals.map((product) => Number(product.attributes?.discountPercent || 0))) };
    })
    .filter((offer): offer is { category: Category; product: Product; discount: number } => Boolean(offer.product));

  return (
    <main className="home-page">
      <div className="home-top-strip"><span>Thoughtful products for everyday living</span><Link to="/products">Explore the collection <ArrowRight size={13} /></Link></div>

      {error && <ErrorMessage message={error} />}
      {loading && <LoadingMessage />}
      {!loading && !error && (
        <>
          <section className="home-hero home-promo-hero" aria-labelledby="hero-heading">
            <div className="home-hero-copy">
              <p className="home-kicker">Special offers</p>
              <h1 id="hero-heading">Shop smarter.<br />Save more.</h1>
              <p>Great deals across your favourite categories.</p>
              <div className="home-promo-actions">
                {highestDiscount > 0 && <div className="home-promo-badge"><span>Up to</span><strong>{Math.min(50, highestDiscount)}% OFF</strong><span>selected products</span></div>}
                <div className="home-promo-buttons"><Link to="/products" className="btn btn-primary">Shop Deals <ArrowRight size={16} aria-hidden="true" /></Link></div>
              </div>
              <div className="home-promo-highlights" aria-label="Shopping benefits">
                <span><ShieldCheck size={15} aria-hidden="true" />Curated deals</span>
                <span><ShieldCheck size={15} aria-hidden="true" />Secure checkout</span>
                <span><Truck size={15} aria-hidden="true" />Fast delivery</span>
              </div>
            </div>

            <div className="home-hero-image home-promo-collage" aria-label="Selected NovaCart products">
              {heroVisualProducts.map((product, index) => <Link key={product.id} to={`/products/${product.id}`} className={`home-promo-tile tile-${index + 1}`} aria-label={`View ${product.name}`}><ImageWithFallback src={product.imageUrl} alt={product.name} />{Number(product.attributes?.discountPercent || 0) > 0 && <span className="home-promo-product-discount">{product.attributes?.discountPercent}% OFF</span>}</Link>)}
              {!heroVisualProducts.length && <span className="home-hero-no-image">Explore the NovaCart collection</span>}
            </div>
          </section>

          <section className="home-benefits" aria-label="NovaCart services">
            <Benefit icon={<ShieldCheck size={19} />} title="Secure Checkout" text="Protected payments" />
            <Benefit icon={<RotateCcw size={19} />} title="Easy Returns" text="Simple return process" />
            <Benefit icon={<Truck size={19} />} title="Fast Delivery" text="Order updates included" />
            <Benefit icon={<Headphones size={19} />} title="24/7 Support" text="Here when you need us" />
          </section>

          <ProductSection title="Today's Deals" eyebrow="Handpicked products at better prices" products={dealProducts} variant="deals" />

          {categoryCards.length > 0 && <section className="home-section" aria-labelledby="category-heading"><SectionHeading eyebrow="Browse the edit" title="Shop by Category" link="/products" /><div className="home-category-grid">{categoryCards.map(({ category, product }) => <Link to={`/products?category=${category.id}`} className="home-category-card" key={category.id}><div className="home-category-image"><ImageWithFallback src={product.imageUrl} alt={product.name} /></div><div><h3>{category.name}</h3><span>Shop now <ArrowRight size={14} /></span></div></Link>)}</div></section>}

          {categoryOfferCards.length > 0 && <section className="home-section home-category-offers" aria-labelledby="category-offers-heading"><SectionHeading eyebrow="Offers from the catalog" title="Featured Offers" link="/products" /><div className="home-category-offer-grid">{categoryOfferCards.slice(0, 4).map(({ category, product, discount }) => <Link key={category.id} to={`/products?category=${category.id}`} className="home-category-offer"><ImageWithFallback src={product.imageUrl} alt={product.name} /><span className="home-category-offer-copy"><strong>{category.name}</strong><span>Up to {discount}% OFF</span><span className="home-category-offer-cta">Shop now <ArrowRight size={14} /></span></span></Link>)}</div></section>}

          {smartTechProduct && <section className="home-featured-pick home-electronics-offer" aria-labelledby="featured-pick-heading"><div><p className="home-kicker">Smart tech for everyday life</p><h2 id="featured-pick-heading">Make room for better tech.</h2><p>Explore smart picks for work, play and everything in between.</p><Link to={electronicsCategory ? `/products?category=${electronicsCategory.id}` : "/products"} className="btn btn-primary">Explore Smart Tech <ArrowRight size={16} /></Link></div><Link to={`/products/${smartTechProduct.id}`} className="home-pick-product"><ImageWithFallback src={smartTechProduct.imageUrl} alt={smartTechProduct.name} /><div><strong>{smartTechProduct.name}</strong><span>₹{smartTechProduct.price.toLocaleString("en-IN")}</span></div></Link></section>}

          <ProductSection title="Trending Now" eyebrow="Popular picks from the collection" products={featuredProducts} />
          <ProductSection title="New Arrivals" eyebrow="Recently added to the catalog" products={newArrivals} />

          {highestDiscount > 0 && <section className="home-offer-band"><div><p className="home-kicker">NovaCart offers</p><h2>Better products. Better prices.</h2><p>Discover offers across electronics, fashion and more.</p></div><Link to="/products" className="btn btn-primary">Explore Offers <ArrowRight size={16} /></Link></section>}
        </>
      )}
    </main>
  );
}

function SectionHeading({ eyebrow, title, link }: { eyebrow: string; title: string; link: string }) { return <div className="home-section-heading"><div><p className="home-kicker">{eyebrow}</p><h2>{title}</h2></div><Link to={link}>View all <ArrowRight size={14} /></Link></div>; }
function ProductSection({ title, eyebrow, products, variant }: { title: string; eyebrow: string; products: Product[]; variant?: "deals" }) { if (!products.length) return null; return <section className={`home-section${variant === "deals" ? " home-deals-section" : ""}`}><SectionHeading eyebrow={eyebrow} title={title} link="/products" /><div className={`home-product-grid${variant === "deals" ? " home-deal-grid" : ""}`} aria-label={variant === "deals" ? `${title} products` : undefined}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>; }
function Benefit({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="home-benefit">{icon}<div><strong>{title}</strong><span>{text}</span></div></div>; }

function getCategoryIds(parentId: number, categories: Category[]): Set<number> {
  const ids = new Set([parentId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentCategoryId && ids.has(category.parentCategoryId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return ids;
}

export default Home;
