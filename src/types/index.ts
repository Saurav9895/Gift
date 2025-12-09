
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
  shortDescription: string;
  longDescription: string;
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

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
