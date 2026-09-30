// Matches AddressResponseDto: { id, fullName, addressLine, city, state, postalCode, country }
export interface Address {
  id?: number;
  fullName: string;      // backend: "fullName"
  addressLine: string;   // backend: "addressLine" (not "street")
  city: string;
  state: string;
  postalCode: string;    // backend: "postalCode" (not "zipCode")
  country: string;
}

// Matches OrderItemResponseDto: { id, productId, productName, quantity, unitPrice, subtotal }
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;   // backend: "unitPrice"
  subtotal: number;    // backend: "subtotal" (not "totalPrice")
  totalPrice: number;  // normalized from the API's `subtotal`
}

// Matches OrderResponseDto: { id, userId, totalAmount, status, address, items, createdAt }
export interface Order {
  id: number;
  userId: number;
  totalAmount: number;     // backend: "totalAmount"
  status: string;
  paymentMethod: string;
  address?: Address;       // backend: "address" (not "shippingAddress")
  items: OrderItem[];
  createdAt: string;       // backend: "createdAt" (not "orderDate")
}
