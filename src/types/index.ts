

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: UserRole;
  phone?: string;
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

export interface Address {
  id: string;
  name: string;
  homeFloor: string;
  locality: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: Omit<Address, 'id'>;
    paymentMethod: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Canceled';
    createdAt: any;
}


export interface PromoCode {
    code: string;
    type: "Percentage" | "Fixed" | "Free Delivery";
    value: number;
}

export interface StoreSettings {
    featuredProductIds: string[];
    featuredCategoryIds: string[];
    deliveryFee: number;
    freeDeliveryThreshold: number;
    promoCodes: PromoCode[];
}
