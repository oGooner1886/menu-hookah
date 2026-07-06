export interface ProductEdition {
  uid: number;
  title?: string;
  subtitle?: string;
  price: number;
  gallery?: string;
  weight?: string;
}

export interface Product {
  uid: number;
  title: string;
  price: number;
  descr?: string;
  gallery?: string;
  category?: string;
  portion?: number;
  editions?: ProductEdition[];
}

export interface OrderItem extends ProductEdition {
  parentTitle?: string;
}

export type OrderMap = Record<number, number>;

export type Branch = 'gusto' | 'aroma';

export type PriceMap = Record<number, number>;
