import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../types/category";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../services/categoryService";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { getErrorMessage } from "../../utils/errorMessage";

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load categories."));
    } finally {
      setLoading(false);
    }
  }

  function handleCreateNew() {
    setEditingId(null);
    setName("");
    setDescription("");
    setParentCategoryId("");
    setShowForm(true);
  }

  function handleEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setParentCategoryId(cat.parentCategoryId ? String(cat.parentCategoryId) : "");
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      setError("");
      await deleteCategory(id);
      await loadCategories();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete category."));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (categories.some((category) => category.id !== editingId && category.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      setError("A category with this name already exists.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      if (editingId) {
        await updateCategory(editingId, { name: name.trim(), description: description.trim(), parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null });
      } else {
        await createCategory({ name: name.trim(), description: description.trim(), parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null });
      }
      setShowForm(false);
      await loadCategories();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save category."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main><LoadingMessage /></main>;

  return (
    <main style={{ textAlign: "left", paddingBottom: "60px" }}>
      <Link to="/admin" className="btn btn-secondary admin-back-link" aria-label="Back to Admin Dashboard">
        <ArrowLeft size={16} />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ marginBottom: "4px" }}>Manage Categories</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Organize catalog products into logical department categories.
          </p>
        </div>

        <Button variant="primary" onClick={handleCreateNew}>
          <Plus size={18} />
          <span>Add New Category</span>
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="auth-card" style={{ maxWidth: "100%", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>
            {editingId ? "Edit Category Name" : "Create New Category"}
          </h2>

          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics, Clothing..." required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What belongs in this department?" />
          </div>

          <div className="form-group">
            <label htmlFor="parentCategoryId">Parent category</label>
            <select id="parentCategoryId" className="select-control" value={parentCategoryId} onChange={(e) => setParentCategoryId(e.target.value)}>
              <option value="">Top-level category</option>
              {categories.filter((category) => category.id !== editingId).map((category) => <option key={category.id} value={category.id}>{category.parentCategoryId ? `↳ ${category.name}` : category.name}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Category"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <section className="empty-state" aria-labelledby="empty-categories-title">
          <h2 id="empty-categories-title">No categories yet</h2>
          <p style={{ color: "var(--text-muted)", margin: "8px 0 18px" }}>
            Create a category to organize your store catalog.
          </p>
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus size={18} aria-hidden="true" />
            <span>Add New Category</span>
          </Button>
        </section>
      ) : (
        <section
          aria-label="Categories"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 16,
          }}
        >
          {categories.map((cat) => (
            <article
              key={cat.id}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                padding: 20,
                minWidth: 0,
              }}
            >
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 5 }}>
                Category #{cat.id}
              </p>
              <h2 style={{ fontSize: 19, overflowWrap: "anywhere" }}>{cat.name}</h2>
              {cat.parentCategoryId && <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Parent: {categories.find((item) => item.id === cat.parentCategoryId)?.name || "—"}</p>}
              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: 8,
                  overflowWrap: "anywhere",
                }}
              >
                {cat.description || "No description provided."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(cat)}
                  aria-label={`Edit ${cat.name}`}
                >
                  <Edit size={14} aria-hidden="true" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(cat.id)}
                  aria-label={`Delete ${cat.name}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  <span>Delete</span>
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminCategories;
