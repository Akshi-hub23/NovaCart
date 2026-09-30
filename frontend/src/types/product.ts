export interface Product {
  id: number;
  categoryId: number;
  categoryName?: string;
  brand?: string;
  attributes?: Record<string, string>;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isActive?: boolean;
  createdAt?: string;
}
