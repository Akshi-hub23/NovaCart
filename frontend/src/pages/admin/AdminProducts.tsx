import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ImageWithFallback from "../../components/ImageWithFallback";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { getErrorMessage } from "../../utils/errorMessage";

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for Create / Edit
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [attributesJson, setAttributesJson] = useState("{}");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [prodData, catData] = await Promise.all([
        getProducts().catch(() => []),
        getCategories().catch(() => []),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load admin products."));
    } finally {
      setLoading(false);
    }
  }

  function handleCreateNew() {
    setEditingId(null);
    setName("");
    setBrand("");
    setAttributesJson("{}");
    setDescription("");
    setPrice("");
    setStockQuantity("");
    setCategoryId(categories.length > 0 ? String(categories[0].id) : "");
    setImageUrl("");
    setIsActive(true);
    setShowForm(true);
  }

  function handleEdit(prod: Product) {
    setEditingId(prod.id);
    setName(prod.name);
    setBrand(prod.brand || "");
    setAttributesJson(JSON.stringify(prod.attributes || {}, null, 2));
    setDescription(prod.description);
    setPrice(String(prod.price));
    setStockQuantity(String(prod.stockQuantity));
    setCategoryId(String(prod.categoryId));
    setImageUrl(prod.imageUrl);
    setIsActive(prod.isActive !== false);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setError("");
      await deleteProduct(id);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete product."));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      setError("Name, price, and category are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let attributes: Record<string, string>;
      try {
        const parsed: unknown = JSON.parse(attributesJson || "{}");
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)
          || Object.values(parsed).some((value) => !["string", "number", "boolean"].includes(typeof value))) {
          throw new Error("Attributes must be a JSON object containing only text, number, or boolean values.");
        }
        attributes = Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, String(value)]));
      } catch (parseError) {
        setError(parseError instanceof Error ? parseError.message : "Product attributes must be valid JSON.");
        return;
      }

      const dto = {
        name,
        brand: brand.trim() || undefined,
        attributes,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity || 0),
        categoryId: Number(categoryId),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        isActive,
      };

      if (editingId) {
        await updateProduct(editingId, dto);
      } else {
        await createProduct(dto);
      }

      setShowForm(false);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save product."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main className="admin-page admin-products-page" style={{ textAlign: "left", paddingBottom: "60px" }}>
      <Link to="/admin" className="btn btn-secondary admin-back-link">
        <ArrowLeft size={16} />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="admin-page-heading">
        <div>
          <h1 style={{ marginBottom: "4px" }}>Manage Products</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Add, update, or remove items from the store catalog.
          </p>
        </div>

        <Button variant="primary" onClick={handleCreateNew}>
          <Plus size={18} />
          <span>Add New Product</span>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="auth-card" style={{ maxWidth: "100%", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>
            {editingId ? "Edit Product Details" : "Create New Product"}
          </h2>

          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="attributes">Product attributes (JSON)</label>
            <textarea id="attributes" className="input-field" rows={5} value={attributesJson} onChange={(e) => setAttributesJson(e.target.value)} placeholder={'{"ramGb":"8","storageGb":"256","supports5G":"true"}'} />
            <small>Enter only specifications that apply to this product. Available values become category filters.</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="admin-product-pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <Input id="stockQuantity" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              className="select-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.parentCategoryId ? `↳ ${c.name}` : c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Product is active in the storefront
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Product"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <section className="empty-state" aria-labelledby="empty-products-title">
          <h2 id="empty-products-title">No products yet</h2>
          <p style={{ color: "var(--text-muted)", margin: "8px 0 18px" }}>
            Add a product to start building your store catalog.
          </p>
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus size={18} aria-hidden="true" />
            <span>Add New Product</span>
          </Button>
        </section>
      ) : (
        <section
          aria-label="Products"
          className="admin-product-grid"
        >
          {products.map((prod) => {
            const categoryName =
              categories.find((category) => category.id === prod.categoryId)?.name ||
              prod.categoryName ||
              `#${prod.categoryId}`;
            const isActive = prod.isActive !== false;

            return (
              <article
                key={prod.id}
                className="admin-product-card"
              >
                <div className="admin-product-image">
                  {prod.imageUrl ? (
                  <ImageWithFallback
                    src={prod.imageUrl}
                    alt={`Product image: ${prod.name}`}
                    loading="lazy"
                  />
                ) : (
                  <span aria-hidden="true">No image available</span>
                )}
                </div>

                <div className="admin-product-content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h2 className="admin-product-title">
                        {prod.name}
                      </h2>
                      <p className="admin-product-meta">
                        {categoryName}
                      </p>
                      {prod.brand && <p className="admin-product-meta">Brand: {prod.brand}</p>}
                    </div>
                    <span className={`status-badge ${
                        isActive ? "status-shipped" : "status-cancelled"
                      }`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {prod.description && (
                    <p className="admin-product-description">
                      {prod.description}
                    </p>
                  )}

                  <div className="admin-product-inventory">
                    <strong>₹{prod.price.toLocaleString("en-IN")}</strong>
                    <span>{prod.stockQuantity} in stock</span>
                  </div>

                  <div className="admin-product-actions">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(prod)}
                      aria-label={`Edit ${prod.name}`}
                    >
                      <Edit size={14} aria-hidden="true" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(prod.id)}
                      aria-label={`Delete ${prod.name}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default AdminProducts;
