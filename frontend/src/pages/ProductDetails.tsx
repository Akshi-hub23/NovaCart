import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Product } from "../types/product";
import type { Review, ProductRating } from "../types/review";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import {
  createReview,
  deleteReview,
  getProductRating,
  getProductReviews,
  updateReview,
} from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Input from "../components/Input";
import ImageWithFallback from "../components/ImageWithFallback";
import StarRating from "../components/StarRating";
import { getErrorMessage } from "../utils/errorMessage";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  ShieldCheck,
  Truck,
  Trash2,
  Edit3,
  MessageSquarePlus,
  PackageCheck,
  Heart,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInfo, setRatingInfo] = useState<ProductRating>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistStateLoading, setWishlistStateLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const productId = Number(id);
        const [prodData, revData, rateData] = await Promise.all([
          getProductById(productId),
          getProductReviews(productId).catch(() => []),
          getProductRating(productId).catch(() => ({
            averageRating: 0,
            totalReviews: 0,
          })),
        ]);
        setProduct(prodData);
        setSelectedImage(prodData.imageUrl);
        setReviews(revData);
        setRatingInfo(rateData);
        if (isAuthenticated) {
          const wishlist = await getWishlist().catch(() => null);
          setIsWishlisted(
            Boolean(
              wishlist?.items.some((item) => item.productId === productId),
            ),
          );
        }
        setWishlistStateLoading(false);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load product details."));
        setWishlistStateLoading(false);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isAuthenticated]);

  async function handleWishlistToggle() {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not update your wishlist."));
    } finally {
      setWishlistLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!product) return;
    if (product.stockQuantity <= 0) {
      setError(product.stockQuantity <= 0 ? "This product is out of stock." : "Select a valid quantity.");
      return;
    }
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      setCartSuccess("");
      setError("");
      await addToCart(product.id, 1);
      setCartSuccess("1 item added to cart.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not add product to cart."));
    } finally {
      setCartLoading(false);
    }
  }

  async function handleBuyNow() {
    await handleAddToCart();
    if (isAuthenticated && !error) {
      navigate("/checkout");
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product || !id) return;
    if (!Number.isInteger(newRating) || newRating < 1 || newRating > 5) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }
    if (!newComment.trim()) {
      setError("Please write a comment for your review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setError("");
      const productId = Number(id);

      if (editingReviewId) {
        await updateReview(editingReviewId, newRating, newComment);
      } else {
        await createReview(productId, newRating, newComment);
      }

      setNewComment("");
      setNewRating(0);
      setEditingReviewId(null);

      // Refresh reviews
      const [revData, rateData] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId),
      ]);
      setReviews(revData);
      setRatingInfo(rateData);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not submit review."));
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleDeleteReview(reviewId: number) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      setError("");
      await deleteReview(reviewId);
      const productId = Number(id);
      const [revData, rateData] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId),
      ]);
      setReviews(revData);
      setRatingInfo(rateData);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete review."));
    }
  }

  function startEditReview(review: Review) {
    setEditingReviewId(review.id);
    setNewRating(review.rating);
    setNewComment(review.comment);
  }

  if (loading)
    return (
      <main>
        <LoadingMessage />
      </main>
    );
  if (!product)
    return (
      <main>
        <EmptyState message="Product not found." />
      </main>
    );

  const galleryImages = product.imageUrl ? [product.imageUrl] : [];
  const activeImage = selectedImage || galleryImages[0] || "";
  return (
    <main style={{ paddingBottom: "60px", textAlign: "left" }}>
      {/* Back Button */}
      <Link
        to="/products"
        className="btn btn-secondary route-back-link"
        aria-label="Back to Products"
        style={{
          marginBottom: "28px",
          padding: "8px 16px",
          fontSize: "0.9rem",
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Products</span>
      </Link>

      {error && <ErrorMessage message={error} />}
      {cartSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 20px",
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--success)",
            marginBottom: "24px",
            fontWeight: "600",
          }}
        >
          <CheckCircle size={20} />
          <span>{cartSuccess}</span>
        </div>
      )}

      {/* Main Detail Grid */}
      <div className="product-detail-layout">
        <div className="product-gallery">
          <div className="detail-image-box">
            <button
              type="button"
              className="wishlist-toggle detail-wishlist-image"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading || wishlistStateLoading}
              aria-label={isWishlisted ? "Remove product from wishlist" : "Add product to wishlist"}
              aria-pressed={isWishlisted}
            >
              <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <ImageWithFallback
              src={activeImage}
              alt={product.name}
              className="detail-main-image"
            />
          </div>
          {galleryImages.length > 0 && (
            <div className="detail-thumbnails" aria-label={`${product.name} image options`}>
              {galleryImages.map((imageUrl, index) => (
                <button
                  type="button"
                  key={imageUrl}
                  className={`detail-thumbnail ${activeImage === imageUrl ? "selected" : ""}`}
                  onClick={() => setSelectedImage(imageUrl)}
                  aria-label={`View ${product.name} image ${index + 1}`}
                  aria-pressed={activeImage === imageUrl}
                >
                  <ImageWithFallback
                    src={imageUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info-box">
          <span
            className="hero-badge"
            style={{ margin: 0, width: "fit-content" }}
          >
            <PackageCheck size={16} /> Product #{product.id}
          </span>

          <span className="product-category">{product.categoryName || "NovaCart selection"}</span>
          {product.brand && <p className="product-brand">Brand: {product.brand}</p>}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <dl className="product-specifications">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key}><dt>{key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <h1 style={{ fontSize: "2.2rem", margin: 0 }}>{product.name}</h1>
          </div>

          {/* Rating Summary */}
          <div className="product-rating-summary">
            {ratingInfo.totalReviews > 0 ? (
              <>
                <StarRating value={ratingInfo.averageRating} readOnly size={18} label="Average product rating" />
                <span>{ratingInfo.averageRating.toFixed(1)} / 5.0</span>
                <span className="product-rating-count">({ratingInfo.totalReviews} customer reviews)</span>
              </>
            ) : <span className="product-rating-count">No ratings yet</span>}
          </div>

          <section className="purchase-panel" aria-label="Purchase options">
            <div className="detail-price-row">
              <span className="detail-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span
                className={`status-badge ${product.stockQuantity > 0 ? "status-shipped" : "status-cancelled"}`}
              >
                {product.stockQuantity > 0
                  ? `In Stock: ${product.stockQuantity}`
                  : "Out of Stock"}
              </span>
            </div>

            <div className="purchase-actions">

              <Button
                variant="primary"
                className="purchase-primary"
                disabled={cartLoading || product.stockQuantity <= 0}
                onClick={handleAddToCart}
                style={{ padding: "12px 28px", fontSize: "1rem" }}
              >
                <ShoppingCart size={20} />
                <span>{product.stockQuantity <= 0 ? "Out of Stock" : cartLoading ? "Adding..." : "Add to Cart"}</span>
              </Button>
              <Button
                variant="outline"
                className="purchase-secondary"
                disabled={cartLoading || product.stockQuantity <= 0}
                onClick={handleBuyNow}
                style={{ padding: "12px 24px", fontSize: "1rem" }}
              >
                <span>Buy Now</span>
              </Button>
            </div>
          </section>

          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: "1.7",
              fontSize: "1.05rem",
            }}
          >
            {product.description}
          </p>

          {/* Features Highlights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-color)",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.9rem",
              }}
            >
              <Truck size={20} color="var(--primary)" />
              <span>Fast Doorstep Delivery</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.9rem",
              }}
            >
              <ShieldCheck size={20} color="var(--primary)" />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section style={{ marginTop: "64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <MessageSquarePlus size={26} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Customer Reviews ({reviews.length})</h2>
        </div>

        {/* Review Submission Form */}
        {isAuthenticated && (
          <form
            onSubmit={handleReviewSubmit}
            className="auth-card"
            style={{ maxWidth: "100%", marginBottom: "32px" }}
          >
            <h3 style={{ marginBottom: "16px" }}>
              {editingReviewId ? "Edit Your Feedback" : "Share Your Experience"}
            </h3>

            <div className="form-group review-rating-field">
              <span className="review-rating-label">How would you rate this product?</span>
              <StarRating value={newRating} onChange={setNewRating} label="Choose a product rating" />
              <span className="selected-rating" aria-live="polite">{newRating > 0 ? `${newRating} out of 5` : "Select a rating"}</span>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review Comment</label>
              <Input
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your honest review about this product..."
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                type="submit"
                variant="primary"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting
                  ? "Submitting..."
                  : editingReviewId
                    ? "Update Review"
                    : "Submit Review"}
              </Button>
              {editingReviewId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingReviewId(null);
                    setNewComment("");
                    setNewRating(0);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <EmptyState message="No reviews yet for this product. Be the first to leave a review!" />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <strong style={{ fontSize: "1rem" }}>
                    {rev.userName || `Customer #${rev.userId}`}
                  </strong>
                  <div className="review-rating-display"><StarRating value={rev.rating} readOnly size={16} label={`${rev.rating} out of 5 stars`} /><span>{rev.rating.toFixed(1)}</span></div>
                </div>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {rev.comment}
                </p>

                {user && user.id === rev.userId && (
                  <div
                    style={{ marginTop: "14px", display: "flex", gap: "10px" }}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => startEditReview(rev)}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteReview(rev.id)}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductDetails;
