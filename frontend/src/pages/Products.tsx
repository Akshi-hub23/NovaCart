import { startTransition, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import LoadingMessage from "../components/LoadingMessage";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import { getCategories } from "../services/categoryService";
import { getProductRating } from "../services/reviewService";
import type { ProductRating } from "../types/review";
import type { Category } from "../types/category";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type PriceRange = string;
type PriceRangeOption = { value: PriceRange; label: string; min: number; max: number };

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [ratings, setRatings] = useState<Record<number, ProductRating>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    searchParams.get("category") && Number.isFinite(Number(searchParams.get("category"))) ? Number(searchParams.get("category")) : null,
  );
  const [priceRange, setPriceRange] = useState<PriceRange | "">("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [minimumDiscount, setMinimumDiscount] = useState(0);
  const [minimumRating, setMinimumRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const productsPerPage = 8;

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        const activeProducts = data.filter((product) => product.isActive !== false);
        setProducts(activeProducts);
        const entries = await Promise.all(activeProducts.map(async (product) => [product.id, await getProductRating(product.id).catch(() => ({ averageRating: 0, totalReviews: 0 }))] as const));
        setRatings(Object.fromEntries(entries));
      } catch (loadError) {
        console.error("Failed to load products:", loadError);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategories(await getCategories());
      } catch (loadError) {
        console.error("Failed to load categories:", loadError);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory") || searchParams.get("gender");
    startTransition(() => {
      setSearchTerm(searchParams.get("search") || "");
      const chosen = category ? (Number.isFinite(Number(category)) ? categories.find((item) => item.id === Number(category)) : categories.find((item) => item.name.toLowerCase() === category.replaceAll("-", " ").toLowerCase())) : undefined;
      const target = subcategory ? categories.find((item) => item.name.toLowerCase() === subcategory.replaceAll("-", " ").toLowerCase() && (chosen ? isDescendant(item, chosen.id, categories) : true)) : chosen;
      setSelectedCategoryId(target?.id ?? null);
    });
  }, [searchParams, categories]);

  const categoryProductIds = selectedCategoryId === null ? null : getCategoryTreeIds(selectedCategoryId, categories);
  const categoryProducts = products.filter((product) => categoryProductIds === null || categoryProductIds.has(product.categoryId));
  const priceRanges = getPriceRanges(categoryProducts);
  const selectedPrice = priceRanges.find((range) => range.value === priceRange);
  const hasRatings = categoryProducts.some((product) => Boolean(ratings[product.id]?.totalReviews));
  const collectedAttributeOptions = selectedCategoryId === null ? {} : collectAttributeOptions(categoryProducts);
  const attributeOptions = collectedAttributeOptions;
  const discountOptions = Array.from(new Set(categoryProducts.map((product) => Number(product.attributes?.discountPercent || 0)).filter((discount) => Number.isFinite(discount) && discount > 0))).sort((a, b) => a - b);
  const rootCategories = categories.filter((category) => !category.parentCategoryId);
  const selectedCategoryRecord = categories.find((category) => category.id === selectedCategoryId);
  const filterCategories = selectedCategoryId === null ? rootCategories : categories.filter((category) => category.id === selectedCategoryId || category.parentCategoryId === selectedCategoryId || category.id === selectedCategoryRecord?.parentCategoryId);
  const parsedMinPrice = minPrice === "" ? undefined : Number(minPrice);
  const parsedMaxPrice = maxPrice === "" ? undefined : Number(maxPrice);

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search) || (product.categoryName || "").toLowerCase().includes(search);
    const matchesCategory = categoryProductIds === null || categoryProductIds.has(product.categoryId);
    const matchesPriceRange = !selectedPrice || (product.price >= selectedPrice.min && product.price <= selectedPrice.max);
    const matchesCustomMin = parsedMinPrice === undefined || (!Number.isNaN(parsedMinPrice) && product.price >= parsedMinPrice);
    const matchesCustomMax = parsedMaxPrice === undefined || (!Number.isNaN(parsedMaxPrice) && product.price <= parsedMaxPrice);
    const discount = Number(product.attributes?.discountPercent || 0);
    const matchesDiscount = minimumDiscount === 0 || discount >= minimumDiscount;
    const rating = ratings[product.id];
    const matchesRating = minimumRating === 0 || Boolean(rating?.totalReviews && rating.averageRating >= minimumRating);
    const matchesAttributes = Object.entries(selectedAttributes).every(([key, values]) => values.length === 0 || values.includes(product.attributes?.[key] || ""));
    return matchesSearch && matchesCategory && matchesPriceRange && matchesCustomMin && matchesCustomMax && matchesDiscount && matchesRating && matchesAttributes;
  });

  useEffect(() => {
    startTransition(() => setCurrentPage(1));
  }, [searchTerm, selectedCategoryId, priceRange, minPrice, maxPrice, minimumDiscount, minimumRating, sortOption, selectedAttributes]);

  useEffect(() => {
    setPriceRange("");
    setSelectedAttributes({});
    setMinimumDiscount(0);
    setMinimumRating(0);
    setMinPrice("");
    setMaxPrice("");
  }, [selectedCategoryId]);

  const sortedProducts = [...filteredProducts];
  if (sortOption === "name-asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortOption === "name-desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  if (sortOption === "price-asc") sortedProducts.sort((a, b) => a.price - b.price);
  if (sortOption === "price-desc") sortedProducts.sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const selectedCategoryTrail = selectedCategoryId === null ? [] : getCategoryTrail(selectedCategoryId, categories);

  function clearFilters() {
    setSearchParams({});
    startTransition(() => {
      setSelectedCategoryId(null);
      setPriceRange("");
      setMinPrice("");
      setMaxPrice("");
      setSelectedAttributes({});
      setMinimumDiscount(0);
      setMinimumRating(0);
      setSearchTerm("");
    });
  }

  function removeFilter(filter: "search" | "category" | "price" | "custom-min" | "custom-max" | "rating" | "discount") {
    if (filter === "search") setSearchTerm("");
    if (filter === "category") { setSelectedCategoryId(null); setSearchParams((current) => { const next = new URLSearchParams(current); next.delete("category"); next.delete("subcategory"); next.delete("gender"); return next; }); }
    if (filter === "price") setPriceRange("");
    if (filter === "custom-min") setMinPrice("");
    if (filter === "custom-max") setMaxPrice("");
    if (filter === "discount") setMinimumDiscount(0);
    if (filter === "rating") setMinimumRating(0);
  }

  function toggleAttributeFilter(key: string, value: string, checked: boolean) {
    setSelectedAttributes((current) => {
      const values = current[key] || [];
      const nextValues = checked ? [...new Set([...values, value])] : values.filter((item) => item !== value);
      const next = { ...current };
      if (nextValues.length) next[key] = nextValues;
      else delete next[key];
      return next;
    });
  }

  const hasSelectedAttributes = Object.values(selectedAttributes).some((values) => values.length > 0);
  const hasFilters = Boolean(searchTerm || selectedCategoryId !== null || priceRange || minPrice || maxPrice || minimumDiscount > 0 || minimumRating > 0 || hasSelectedAttributes);
  const activeFilterCount = [searchTerm, selectedCategoryId !== null, priceRange, minPrice, maxPrice, minimumDiscount > 0, minimumRating > 0].filter(Boolean).length + Object.values(selectedAttributes).reduce((count, values) => count + values.length, 0);

  return (
    <main className="products-page">
      <div className="products-breadcrumb"><Link to="/">For You</Link>{selectedCategoryTrail.map((category) => <span key={category.id}> / {category.name}</span>)}{selectedCategoryTrail.length === 0 && <><span>/</span><span>Products</span></>}</div>
      <header className="products-heading">
        <div><h1>{selectedCategory?.name || "Explore Products"}</h1><p>{selectedCategory?.description || "Shop across NovaCart departments with practical filters and clear availability."}</p></div>
        <span className="results-total">{filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}</span>
      </header>

      <div className="mobile-filter-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setMobileFiltersOpen(true)}><Filter size={16} /> Filters{activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}</button>
        <label className="mobile-sort-control"><ArrowUpDown size={16} /><span className="sr-only">Sort products</span><select value={sortOption} onChange={(event) => setSortOption(event.target.value)} aria-label="Sort products"><SortOptions /></select></label>
      </div>

      <div className="results-layout">
        <FilterPanel
          categories={filterCategories}
          showRatings={hasRatings}
          hasProducts={categoryProductIds === null ? products.length > 0 : categoryProducts.length > 0}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={(id) => { setSelectedCategoryId(id); setSearchParams((current) => { const next = new URLSearchParams(current); if (id) next.set("category", String(id)); else next.delete("category"); next.delete("subcategory"); next.delete("gender"); return next; }); }}
          priceRanges={priceRanges}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minimumRating={minimumRating}
          setMinimumRating={setMinimumRating}
          discountOptions={discountOptions}
          minimumDiscount={minimumDiscount}
          setMinimumDiscount={setMinimumDiscount}
          attributeOptions={attributeOptions}
          selectedAttributes={selectedAttributes}
          setAttributeFilter={toggleAttributeFilter}
        />
        <section className="results-content">
          <div className="products-toolbar">
            <div className="products-search"><Search size={17} /><input type="search" placeholder="Search products, categories or details" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Search products" /></div>
            <label className="desktop-sort"><ArrowUpDown size={16} /><span className="sr-only">Sort products</span><select value={sortOption} onChange={(event) => setSortOption(event.target.value)} aria-label="Sort products"><SortOptions /></select></label>
          </div>

          {hasFilters && <div className="active-filters" aria-label="Active filters">
            <strong>Active filters</strong>
            {searchTerm && <FilterChip label={`Search: ${searchTerm}`} onRemove={() => removeFilter("search")} />}
            {selectedCategory && <FilterChip label={`Category: ${selectedCategory.name}`} onRemove={() => removeFilter("category")} />}
            {priceRange && <FilterChip label={`Price: ${selectedPrice?.label || "Selected"}`} onRemove={() => removeFilter("price")} />}
            {minPrice && <FilterChip label={`Min ₹${minPrice}`} onRemove={() => removeFilter("custom-min")} />}
            {maxPrice && <FilterChip label={`Max ₹${maxPrice}`} onRemove={() => removeFilter("custom-max")} />}
            {minimumDiscount > 0 && <FilterChip label={`${minimumDiscount}% off or more`} onRemove={() => removeFilter("discount")} />}
            {minimumRating > 0 && <FilterChip label={minimumRating + "+ stars"} onRemove={() => removeFilter("rating")} />}
            {Object.entries(selectedAttributes).flatMap(([key, values]) => values.map((value) => <FilterChip key={`${key}-${value}`} label={`${attributeLabels[key] || key}: ${value}`} onRemove={() => toggleAttributeFilter(key, value, false)} />))}
            <button type="button" className="clear-filters" onClick={clearFilters}>Clear all</button>
          </div>}

          <div className="results-count-row"><p className="product-count">{filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}</p>{hasFilters && <span className="filtered-note">Filtered results</span>}</div>
          {loading && <LoadingMessage />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && products.length === 0 && <EmptyState message="No products available at the moment." />}
          {!loading && !error && products.length > 0 && filteredProducts.length === 0 && <div className="no-results"><EmptyState message="No products found for these filters." /><button type="button" className="btn btn-primary" onClick={clearFilters}>Clear filters</button></div>}
          {!loading && !error && filteredProducts.length > 0 && <ProductList products={currentProducts} />}
          {!loading && !error && totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />}
        </section>
      </div>

      {mobileFiltersOpen && <div className="filter-drawer-backdrop" role="presentation" onClick={() => setMobileFiltersOpen(false)}><aside className="filter-drawer" role="dialog" aria-modal="true" aria-label="Product filters" onClick={(event) => event.stopPropagation()}><div className="filter-drawer-header"><h2>Filters</h2><button type="button" className="icon-button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X size={20} /></button></div><FilterPanel categories={filterCategories} showRatings={hasRatings} hasProducts={categoryProductIds === null ? products.length > 0 : categoryProducts.length > 0} selectedCategoryId={selectedCategoryId} setSelectedCategoryId={(id) => { setSelectedCategoryId(id); setSearchParams((current) => { const next = new URLSearchParams(current); if (id) next.set("category", String(id)); else next.delete("category"); next.delete("subcategory"); next.delete("gender"); return next; }); }} priceRanges={priceRanges} priceRange={priceRange} setPriceRange={setPriceRange} minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} minimumRating={minimumRating} setMinimumRating={setMinimumRating} discountOptions={discountOptions} minimumDiscount={minimumDiscount} setMinimumDiscount={setMinimumDiscount} attributeOptions={attributeOptions} selectedAttributes={selectedAttributes} setAttributeFilter={toggleAttributeFilter} /><div className="filter-drawer-actions"><button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear All</button><button type="button" className="btn btn-primary" onClick={() => setMobileFiltersOpen(false)}>Apply Filters</button></div></aside></div>}
    </main>
  );
}

function getPriceRanges(products: Product[]): PriceRangeOption[] {
  const prices = Array.from(new Set(products.map((product) => Number(product.price)).filter(Number.isFinite))).sort((a, b) => a - b);
  if (!prices.length) return [];
  const groupCount = Math.min(4, prices.length);
  const chunkSize = Math.ceil(prices.length / groupCount);
  const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const ranges: PriceRangeOption[] = [];
  for (let index = 0; index < prices.length; index += chunkSize) {
    const group = prices.slice(index, index + chunkSize);
    const min = group[0];
    const max = group[group.length - 1];
    ranges.push({
      value: `${min}-${max}`,
      label: min === max ? `₹${currency.format(min)}` : `₹${currency.format(min)} - ₹${currency.format(max)}`,
      min,
      max,
    });
  }
  return ranges;
}

function getCategoryTreeIds(parentId: number, categories: Category[]): Set<number> {
  const ids = new Set([parentId]);
  let changed = true;
  while (changed) { changed = false; for (const category of categories) if (category.parentCategoryId && ids.has(category.parentCategoryId) && !ids.has(category.id)) { ids.add(category.id); changed = true; } }
  return ids;
}
function isDescendant(category: Category, parentId: number, categories: Category[]): boolean {
  let current = category;
  while (current.parentCategoryId) { if (current.parentCategoryId === parentId) return true; const parent = categories.find((item) => item.id === current.parentCategoryId); if (!parent) return false; current = parent; }
  return false;
}
function SortOptions() { return <><option value="default">Sort: Featured</option><option value="name-asc">Name: A to Z</option><option value="name-desc">Name: Z to A</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></>; }

function FilterPanel({ categories, showRatings, hasProducts, selectedCategoryId, setSelectedCategoryId, priceRanges, priceRange, setPriceRange, minPrice, setMinPrice, maxPrice, setMaxPrice, minimumRating, setMinimumRating, discountOptions, minimumDiscount, setMinimumDiscount, attributeOptions, selectedAttributes, setAttributeFilter }: {
  categories: Category[]; showRatings: boolean; hasProducts: boolean; selectedCategoryId: number | null; setSelectedCategoryId: (value: number | null) => void;
  priceRanges: PriceRangeOption[]; priceRange: PriceRange | ""; setPriceRange: (value: PriceRange | "") => void; minPrice: string; setMinPrice: (value: string) => void; maxPrice: string; setMaxPrice: (value: string) => void;
  minimumRating: number; setMinimumRating: (value: number) => void; discountOptions: number[]; minimumDiscount: number; setMinimumDiscount: (value: number) => void;
  attributeOptions: Record<string, string[]>; selectedAttributes: Record<string, string[]>; setAttributeFilter: (key: string, value: string, checked: boolean) => void;
}) {
  return (
    <aside className="filter-panel">
      <div className="filter-panel-title"><SlidersHorizontal size={17} /><h2>Filters</h2></div>
      <details className="filter-group" open><summary>Categories</summary>
        <label className="filter-option"><input type="radio" name="category-filter" checked={selectedCategoryId === null} onChange={() => setSelectedCategoryId(null)} /><span>All categories</span></label>
        {categories.map((category) => <label className={`filter-option${category.parentCategoryId ? " subcategory-filter-option" : ""}`} key={category.id}><input type="radio" name="category-filter" checked={selectedCategoryId === category.id} onChange={() => setSelectedCategoryId(category.id)} /><span>{category.name}</span></label>)}
      </details>
      {hasProducts && <details className="filter-group" open><summary>Price</summary>
        {priceRanges.map((range) => <label className="filter-option" key={range.value}><input type="radio" name="price-filter" checked={priceRange === range.value} onChange={() => setPriceRange(range.value)} /><span>{range.label}</span></label>)}
        <div className="custom-price"><label htmlFor="min-price">Minimum</label><input id="min-price" inputMode="numeric" type="number" min="0" placeholder="₹ Min" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /><label htmlFor="max-price">Maximum</label><input id="max-price" inputMode="numeric" type="number" min="0" placeholder="₹ Max" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></div>
      </details>}
      {discountOptions.length > 0 && <details className="filter-group" open><summary>Discount</summary>{discountOptions.map((discount) => <label className="filter-option" key={discount}><input type="radio" name="discount-filter" checked={minimumDiscount === discount} onChange={() => setMinimumDiscount(discount)} /><span>{discount}% and above</span></label>)}<label className="filter-option"><input type="radio" name="discount-filter" checked={minimumDiscount === 0} onChange={() => setMinimumDiscount(0)} /><span>Any discount</span></label></details>}
      {Object.entries(attributeOptions).filter(([, values]) => values.length > 0).map(([key, values]) => <details className="filter-group" key={key} open><summary>{attributeLabels[key] || key}</summary><label className="filter-option"><input type="checkbox" checked={!selectedAttributes[key]?.length} onChange={() => selectedAttributes[key]?.length && selectedAttributes[key].forEach((value) => setAttributeFilter(key, value, false))} /><span>Any</span></label>{values.map((value) => <label className="filter-option" key={value}><input type="checkbox" checked={selectedAttributes[key]?.includes(value) || false} onChange={(event) => setAttributeFilter(key, value, event.target.checked)} /><span>{formatAttributeOption(key, value)}</span></label>)}</details>)}
      {showRatings && <details className="filter-group" open><summary>Customer rating</summary>
        {[4, 3, 2, 1].map((rating) => <label className="filter-option" key={rating}><input type="radio" name="rating-filter" checked={minimumRating === rating} onChange={() => setMinimumRating(rating)} /><span>{rating}★ &amp; above</span></label>)}
        <label className="filter-option"><input type="radio" name="rating-filter" checked={minimumRating === 0} onChange={() => setMinimumRating(0)} /><span>Any rating</span></label>
      </details>}
    </aside>
  );
}function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) { return <span className="filter-chip">{label}<button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`}><X size={13} /></button></span>; }
function Pagination({ currentPage, totalPages, setCurrentPage }: { currentPage: number; totalPages: number; setCurrentPage: (page: number) => void }) { return <div className="pagination"><button type="button" className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>{Array.from({ length: totalPages }, (_, index) => <button type="button" key={index + 1} className={`page-btn ${currentPage === index + 1 ? "active" : ""}`} onClick={() => setCurrentPage(index + 1)} aria-label={`Page ${index + 1}`}>{index + 1}</button>)}<button type="button" className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next page"><ChevronRight size={16} /></button></div>; }

export default Products;

const attributeLabels: Record<string, string> = {
  gender: "Gender",
  productType: "Product type",
  size: "Size",
  color: "Color",
  ramGb: "RAM",
  storageGb: "Storage",
  batteryMah: "Battery",
  supports5G: "5G support",
  network: "Network",
  operatingSystem: "Operating system",
  processor: "Processor",
  screenSizeInches: "Screen size",
  connectionType: "Connection",
  skinType: "Skin type",
  shade: "Shade",
  ageGroup: "Age group",
  capacity: "Capacity",
  energyRating: "Energy rating",
  dietary: "Dietary",
  displayType: "Display type",
  measurementType: "Measurement type",
  finish: "Finish",
  spf: "SPF",
  material: "Material",
  weight: "Weight",
  features: "Features",
  packSize: "Pack size",
  foodType: "Food type",
  bluetooth: "Bluetooth",
  noiseCancellation: "Noise cancellation",
  dpi: "DPI",
  fastCharging: "Fast charging",
};

function collectAttributeOptions(products: Product[]): Record<string, string[]> {
  const valuesByAttribute = new Map<string, Set<string>>();
  for (const product of products) {
    for (const [key, rawValue] of Object.entries(product.attributes ?? {})) {
      if (!attributeLabels[key] || key === "discountPercent" || key === "supports5G" || !rawValue.trim()) continue;
      const values = valuesByAttribute.get(key) ?? new Set<string>();
      values.add(rawValue.trim());
      valuesByAttribute.set(key, values);
    }
  }
  return Object.fromEntries([...valuesByAttribute.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, values]) => [key, [...values].sort((left, right) => left.localeCompare(right))]));
}

function formatAttributeOption(key: string, value: string): string {
  if (key === "ramGb") return `${value} GB`;
  if (key === "storageGb") return /^\d+$/.test(value) ? `${value} GB` : value;
  if (key === "batteryMah") return `${value} mAh`;
  if (key === "screenSizeInches") return `${value}\"`;
  return value;
}

function getCategoryTrail(categoryId: number, categories: Category[]): Category[] {
  const trail: Category[] = [];
  let current = categories.find((category) => category.id === categoryId);
  while (current) {
    trail.unshift(current);
    current = current.parentCategoryId ? categories.find((category) => category.id === current?.parentCategoryId) : undefined;
  }
  return trail;
}
