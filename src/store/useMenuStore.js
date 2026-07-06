import { create } from 'zustand';
import { fetchAllMenus } from '../services/api';

const buildPriceMap = (products) => {
  const map = {};

  products.forEach((prod) => {
    if (prod.uid) map[prod.uid] = prod.price || 0;
    if (prod.editions) {
      prod.editions.forEach((ed) => {
        map[ed.uid] = ed.price || 0;
      });
    }
  });

  return map;
};

export const resolveBranchFromPath = (pathname) => {
  if (pathname.startsWith('/aroma/menu')) return 'aroma';
  if (pathname.startsWith('/gusto/menu')) return 'gusto';
  return null;
};

export const useMenuStore = create((set, get) => ({
  productsGusto: [],
  productsAroma: [],
  isLoading: true,
  error: null,
  branch: 'gusto',
  order: {},
  amount: 0,
  item: null,

  setBranch: (branch) => set({ branch }),

  getCurrentProducts: () => {
    const { branch, productsGusto, productsAroma } = get();
    return branch === 'aroma' ? productsAroma : productsGusto;
  },

  getPriceMap: () => buildPriceMap(get().getCurrentProducts()),

  addToOrder: (uid) => {
    const price = get().getPriceMap()[uid] || 0;
    set((state) => ({
      order: { ...state.order, [uid]: (state.order[uid] || 0) + 1 },
      amount: state.amount + price,
    }));
  },

  removeFromOrder: (uid) => {
    const count = get().order[uid];
    if (!count || count <= 0) return;

    const price = get().getPriceMap()[uid] || 0;

    set((state) => {
      if (count === 1) {
        const newOrder = { ...state.order };
        delete newOrder[uid];
        return {
          order: newOrder,
          amount: Math.max(0, state.amount - price),
        };
      }

      return {
        order: { ...state.order, [uid]: count - 1 },
        amount: Math.max(0, state.amount - price),
      };
    });
  },

  deleteOrder: () => set({ order: {}, amount: 0 }),

  setItem: (item) => set({ item }),

  loadProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const { productsGusto, productsAroma } = await fetchAllMenus();
      set({ productsGusto, productsAroma, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export const selectCurrentProducts = (state) => (state.branch === 'aroma' ? state.productsAroma : state.productsGusto);
