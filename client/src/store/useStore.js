import { create } from 'zustand';
import products_aroma from '../data/productsJSON_aroma.json';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:3000/api';

export const BRANCHES = {
  GUSTO: 'gusto',
  AROMA: 'aroma',
};

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

const aromaPrice = buildPriceMap(aromaProducts);

export const useStore = create(
  persist(
    (set, get) => ({
      //* ============================================================
      //!  AUTH + сессия
      //* ============================================================
      sessionToken: null,
      user: null,
      tableNumber: null,

      setAuth: (token, user) => set({ sessionToken: token, user }),
      logout: () => set({ sessionToken: null, user: null }),
      setTableNumber: (num) => set({ tableNumber: num }),

      //* ============================================================
      //!  MENU + филиалы
      //* ============================================================

      branch: BRANCHES.GUSTO,
      productsGusto: [],
      productsAroma: aromaProducts,
      isLoadingMenu: false,

      setBranch: (branch) => {
        set({ branch });
        if (branch === BRANCHES.GUSTO && get().productsGusto.length === 0) {
          get().fetchMenu();
        }
      },

      fetchMenu: async () => {
        if (get().branch === BRANCHES.AROMA) return;

        set({ isLoadingMenu: true });
        try {
          const res = await fetch(`${API_URL}/menu`);
          const data = await res.json();
          set({ productsGusto: data.categories || data });
        } catch (error) {
          console.error('Ошибка загрузки меню iiko:', error);
        } finally {
          set({ isLoadingMenu: false });
        }
      },

      //* ============================================================
      //!  КОРЗИНА
      //* ============================================================

      orders: {
        [BRANCHES.GUSTO]: {},
        [BRANCHES.AROMA]: {},
      },

      addToOrder: (uid) => {
        set((state) => {
          const currentBranchOrder = state.orders[currentBranch] || {};
          return {
            orders: {
              ...state.orders,
              [state.branch]: {
                ...currentBranchOrder,
                [uid]: (currentBranchOrder[uid] || 0) + 1,
              },
            },
          };
        });
      },

      removeFromOrder: (uid) => {
        set((state) => {
          const currentBranchOrder = state.orders[currentBranch] || {};
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
    }),
    {
      name: 'restaurant-cart-storage',
      partialize: (state) => ({
        orders: state.orders,
        branch: state.branch,
        sessionToken: state.sessionToken,
        user: state.user,
        tableNumber: state.tableNumber,
      }),
    },
  ),
);

//* ============================================================
//!  СЕЛЕКТОРЫ
//* ============================================================

export const selectCurrentProducts = (state) =>
  state.branch === BRANCHES.AROMA ? state.productsAroma : state.productsGusto;

export const selectCurrentOrder = (state) => {
  return state.orders[state.branch] || {};
};

export const selectCurrentTotalItems = (state) => {
  const order = state.orders[state.branch] || {};
  return Object.values(order).reduce((sum, count) => sum + count, 0);
};

export const selectCurrentAmount = (state) => {
  const currentBranch = state.branch;
  const order = state.orders[currentBranch] || {};

  if (Object.keys(order).length === 0) return 0;

  if (currentBranch === BRANCHES.AROMA) {
    return Object.entries(order).reduce((total, [uid, count]) => {
      const price = priceMap[uid] || 0;
      return total + price * count;
    }, 0);
  } else {
    const menu = state.productsGusto || [];
    const priceMap = {};
    menu.forEach((category) => {
      category.items?.forEach((product) => {
        priceMap[product.id] = product.price || 0;
      });
    });
    return Object.entries(order).reduce((total, [uid, count]) => {
      const price = priceMap[uid] || 0;
      return total + price * count;
    }, 0);
  }
};
