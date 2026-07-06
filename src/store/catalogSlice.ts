import type { StateCreator } from 'zustand';
import type { AppStore } from './storeTypes';
import type { Branch, Product } from './types';

export interface CatalogSlice {
  productsGusto: Product[];
  productsAroma: Product[];
  branch: Branch;
  setBranch: (branch: Branch) => void;
  initCatalog: (gusto: Product[], aroma: Product[]) => void;
}

export const createCatalogSlice: StateCreator<AppStore, [], [], CatalogSlice> = (set) => ({
  productsGusto: [],
  productsAroma: [],
  branch: 'gusto',

  setBranch: (branch) => set({ branch }),

  initCatalog: (gusto, aroma) => set({ productsGusto: gusto, productsAroma: aroma }),
});
