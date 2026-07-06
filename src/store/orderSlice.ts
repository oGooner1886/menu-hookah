import type { StateCreator } from 'zustand';
import type { AppStore } from './storeTypes';
import type { OrderMap } from './types';
import { selectPriceMap } from './selectors';

export interface OrderSlice {
  order: OrderMap;
  amount: number;
  lastAddedItemId: number | null;
  addToOrder: (uid: number) => void;
  removeFromOrder: (uid: number) => void;
  deleteOrder: () => void;
}

export const createOrderSlice: StateCreator<AppStore, [], [], OrderSlice> = (set, get) => ({
  order: {},
  amount: 0,
  lastAddedItemId: null,

  addToOrder: (uid) => {
    const price = selectPriceMap(get())[uid] ?? 0;
    set((state) => ({
      order: { ...state.order, [uid]: (state.order[uid] ?? 0) + 1 },
      amount: state.amount + price,
      lastAddedItemId: uid,
    }));
  },

  removeFromOrder: (uid) => {
    const state = get();
    const count = state.order[uid];
    if (!count || count <= 0) return;

    const price = selectPriceMap(state)[uid] ?? 0;

    if (count === 1) {
      const newOrder = { ...state.order };
      delete newOrder[uid];
      set({
        order: newOrder,
        amount: Math.max(0, state.amount - price),
        lastAddedItemId: null,
      });
    } else {
      set({
        order: { ...state.order, [uid]: count - 1 },
        amount: Math.max(0, state.amount - price),
        lastAddedItemId: null,
      });
    }
  },

  deleteOrder: () => set({ order: {}, amount: 0, lastAddedItemId: null }),
});
