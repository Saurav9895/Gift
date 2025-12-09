export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

export interface Category {
    id: string;
    name: string;
    imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}
