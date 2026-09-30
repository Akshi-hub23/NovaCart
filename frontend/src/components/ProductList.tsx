import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <section>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductList;