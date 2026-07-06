import { create } from 'zustand';
import { createCatalogSlice } from './catalogSlice';
import { createOrderSlice } from './orderSlice';
import { createUISlice } from './uiSlice';
import type { AppStore } from './storeTypes';

export type { AppStore } from './storeTypes';
export type { Product, ProductEdition, OrderMap, Branch } from './types';
export {
  selectBranch,
  selectCurrentProducts,
  selectPriceMap,
  selectOrderAmount,
  selectOrder,
  selectEditingItem,
  selectWelcomeModalOpen,
} from './selectors';

export const useAppStore = create<AppStore>()((...args) => ({
  ...createCatalogSlice(...args),
  ...createOrderSlice(...args),
  ...createUISlice(...args),
}));
