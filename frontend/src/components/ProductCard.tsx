import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { addToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import { getProductRating } from "../services/reviewService";
import type { ProductRating } from "../types/review";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [rating, setRating] = useState<ProductRating>({ averageRating: 0, totalReviews: 0 });
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isOutOfStock = product.stockQuantity <= 0;
  const discountPercent = Math.min(100, Math.max(0, Number(product.attributes?.discountPercent || 0)));
  const discountedPrice = Math.round(product.price * (1 - discountPercent / 100));

  useEffect(() => {
    getProductRating(product.id).then(setRating).catch(() => undefined);
  }, [product.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getWishlist()
      .then((wishlist) =>
        setIsWishlisted(
          wishlist.items.some((item) => item.productId === product.id),
        ),
      )
      .catch(() => undefined);
  }, [isAuthenticated, product.id]);

  async function handleWishlistToggle() {
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
    } finally {
      setWishlistLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      await addToCart(product.id, 1);
      window.dispatchEvent(new Event("cart-updated"));
    } finally {
      setCartLoading(false);
    }
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link
          to={`/products/${product.id}`}
          className="product-image-link"
          aria-label={`View details for ${product.name}`}
        >
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
          />
        </Link>
        <button
          type="button"
          className="wishlist-toggle"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          <Heart
            size={19}
            fill={isAuthenticated && isWishlisted ? "currentColor" : "none"}
          />
        </button>
        <span
          className={`stock-badge ${isOutOfStock ? "low-stock" : isLowStock ? "low-stock" : ""}`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isLowStock
              ? `Only ${product.stockQuantity} Left`
              : "In Stock"}
        </span>
      </div>

      <div className="product-content">
        <span className="product-category">{product.categoryName || "NovaCart selection"}</span>
        <Link to={`/products/${product.id}`} className="product-link">
          <h3 className="product-title">{product.name}</h3>
        </Link>

        {rating.totalReviews > 0 && <div className="product-rating" aria-label={`Rated ${rating.averageRating.toFixed(1)} out of 5 from ${rating.totalReviews} reviews`}><span aria-hidden="true">★</span> {rating.averageRating.toFixed(1)} ({rating.totalReviews})</div>}
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            {discountPercent > 0 ? <><span className="product-current-price">₹{discountedPrice.toLocaleString("en-IN")}</span><del className="product-original-price">₹{product.price.toLocaleString("en-IN")}</del><span className="product-discount-badge">{discountPercent}% OFF</span></> : <span>₹{product.price.toLocaleString("en-IN")}</span>}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddToCart}
              disabled={isOutOfStock || cartLoading}
              aria-label={`Add ${product.name} to cart`}
              style={{ padding: "8px 10px" }}
            >
              <ShoppingCart size={16} />
            </button>
            <Link
              to={`/products/${product.id}`}
              className="btn btn-primary"
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            >
              <span>View Details</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
