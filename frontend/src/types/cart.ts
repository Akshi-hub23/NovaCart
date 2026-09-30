// Matches CartItemResponseDto: { id, productId, productName, price, quantity, subtotal }
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;       // backend: "price"
  quantity: number;
  subtotal: number;    // backend: "subtotal"
}

// Matches CartResponseDto: { id, userId, items, total, createdAt, updatedAt }
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;       // backend: "total"
  createdAt?: string;
  updatedAt?: string;
}
