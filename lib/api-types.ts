export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UploadResponse {
  url: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
}

export interface CategoryCreatePayload {
  name: string;
  imageUrl: string;
  active: boolean;
}

export interface CategoryUpdatePayload {
  name?: string;
  imageUrl?: string;
  active?: boolean;
}

export interface ApiProduct {
  id: number | string;
  productName?: string;
  productDescription?: string;
  imageUrl?: string;
  price: number;
  displayOrder?: number;
  category?: Category | string;
  name?: string;
  description?: string;
  image?: string;
  inStock?: boolean;
  active?: boolean;
  status?: string;
}

export interface ProductCreatePayload {
  productName: string;
  productDescription: string;
  imageUrl: string;
  price: number;
  displayOrder: number;
  categoryId: string;
}

export interface ProductUpdatePayload {
  productName?: string;
  productDescription?: string;
  imageUrl?: string;
  price?: number;
  displayOrder?: number;
  categoryId?: string;
  active?: boolean;
}

export interface Banner {
  id?: number | string;
  title?: string;
  subtitle?: string;
  tag?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  image?: string;
  accent?: string;
  active?: boolean;
  status?: string;
}

export interface BannerCreatePayload {
  title: string;
  subtitle?: string;
  tag?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  active?: boolean;
}

export interface BannerUpdatePayload {
  title?: string;
  subtitle?: string;
  tag?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  active?: boolean;
}

export interface BannerStatusPayload {
  active: boolean;
}

export type LeadType = 'QUOTE' | 'CONTACT';

export interface LeadProductPayload {
  productId: number | string;
  name?: string;
  price?: number;
  quantity: number;
}

export interface LeadItemRequest {
  productId: string | number;
  quantity: number;
}

export interface LeadCreatePayload {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  message?: string;
  type: LeadType;
  products?: LeadProductPayload[];
  source?: string;
  items?: LeadItemRequest[];
}

export interface Lead {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  message?: string;
  type?: LeadType;
  products?: LeadProductPayload[];
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}
