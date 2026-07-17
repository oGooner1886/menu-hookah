import { create } from 'zustand';
import products_gusto from '../data/productsJSON.json';
import products_aroma from '../data/productsJSON_aroma.json';

export const BRANCHES = {
  GUSTO: 'gusto',
  AROMA: 'aroma',
};

const gustoProducts = products_gusto || [];
const aromaProducts = products_aroma || [];

const buildPriceMap = (products) => {
  const map = {};
  if (!products) return map;
  products.forEach((prod) => {
    if (prod.uid) map[prod.uid] = prod.price || 0;
    if (prod.editions) {
      prod.editions.forEach((ed) => {
        if (ed.uid) map[ed.uid] = ed.price || 0;
      });
    }
  });
  return map;
};

const gustoPrice = buildPriceMap(gustoProducts);
const aromaPrice = buildPriceMap(aromaProducts);

export const useStore = create((set) => ({
  productsGusto: gustoProducts,
  productsAroma: aromaProducts,
  priceMaps: {
    [BRANCHES.GUSTO]: gustoPrice,
    [BRANCHES.AROMA]: aromaPrice,
  },
  branch: [BRANCHES.GUSTO],
  item: null, // активны йтовар из модалки
  orders: {
    [BRANCHES.GUSTO]: {},
    [BRANCHES.AROMA]: {},
  },
  setBranch: (branch) => set({ branch }),
  setItem: (item) => set({ item }),

  addToOrder: (uid) => {
    set((state) => {
      const currentBranch = state.branch;
      const currentBranchOrder = state.orders[currentBranch];
      return {
        orders: {
          ...state.orders,
          [currentBranch]: {
            ...currentBranchOrder,
            [uid]: (currentBranchOrder[uid] || 0) + 1,
          },
        },
      };
    });
  },
  removeFromOrder: (uid) => {
    set((state) => {
      const currentBranch = state.branch;
      const currentBranchOrder = state.orders[currentBranch];
      const count = currentBranchOrder[uid];

      if (!count || count <= 0) return {};

      // eslint-disable-next-line no-unused-vars
      const { [uid]: _, ...restItems } = currentBranchOrder;
      return {
        orders: {
          ...state.orders,
          [currentBranch]: count === 1 ? restItems : { ...currentBranchOrder, [uid]: count - 1 },
        },
      };
    });
  },
  deleteOrder: () => {
    set((state) => ({
      orders: {
        ...state.orders,
        [state.branch]: {},
      },
    }));
  },
}));

export const selectCurrentProducts = (state) =>
  state.branch === BRANCHES.AROMA ? state.productsAroma : state.productsGusto;

export const selectCurrentOrder = (state) => {
  return state.orders[state.branch] || {};
};

export const selectCurrentAmount = (state) => {
  const currentBranch = state.branch;
  const order = state.orders[currentBranch];
  const priceMap = state.priceMaps[currentBranch];

  return Object.entries(order).reduce((total, [uid, count]) => {
    const price = priceMap[uid] || 0;
    return total + price * count;
  }, 0);
};

export const selectCurrentTotalItems = (state) => {
  const order = state.orders[state.branch];
  return Object.values(order).reduce((sum, count) => sum + count, 0);
};
