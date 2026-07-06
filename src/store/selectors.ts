import type { AppStore } from './storeTypes';
import type { PriceMap, Product } from './types';

export const selectBranch = (state: AppStore) => state.branch;

export const selectCurrentProducts = (state: AppStore): Product[] =>
  state.branch === 'aroma' ? state.productsAroma : state.productsGusto;

export const selectPriceMap = (state: AppStore): PriceMap => {
  const map: PriceMap = {};
  selectCurrentProducts(state).forEach((prod) => {
    if (prod.uid) map[prod.uid] = prod.price ?? 0;
    prod.editions?.forEach((ed) => {
      map[ed.uid] = ed.price ?? 0;
    });
  });
  return map;
};

export const selectOrderAmount = (state: AppStore) => state.amount;

export const selectOrder = (state: AppStore) => state.order;

export const selectEditingItem = (state: AppStore) => state.editingItem;

export const selectWelcomeModalOpen = (state: AppStore) => state.welcomeModalOpen;
