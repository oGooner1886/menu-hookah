import { create } from 'zustand';
import products_aroma from '../data/productsJSON_aroma.json';
import products_gusto_legacy from '../data/productsJSON.json';
import imageOverrides from '../data/imageOverrides.json';
import titleOverrides from '../data/titleOverrides.json';
import { persist } from 'zustand/middleware';
import { CATEGORIES_CONFIG } from '../config/categories';
import { BRANCHES } from '../config/branches';

// Реэкспорт BRANCHES — чтобы все остальные файлы продолжали импортировать из useStore
export { BRANCHES } from '../config/branches';

const API_URL = 'http://localhost:3000/api';

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

// Словарь: "салат греческий" → "/Salads/Greece.webp"
// Строится из старого статичного JSON Gusto — те же блюда, те же названия
const gustoNameToImage = {};
products_gusto_legacy.forEach((p) => {
  if (p.title && p.gallery) {
    gustoNameToImage[p.title.toLowerCase().trim()] = p.gallery;
  }
  // Также обходим editions если есть
  if (p.editions) {
    p.editions.forEach((ed) => {
      if (ed.title && ed.gallery) {
        gustoNameToImage[ed.title.toLowerCase().trim()] = ed.gallery;
      }
    });
  }
});

// Ручные переопределения (imageOverrides.json) — для имён которые не совпали автоматически
// Ключи нормализуем так же — lowercase + trim
const imageOverridesNormalized = {};
Object.entries(imageOverrides).forEach(([name, path]) => {
  if (!name.startsWith('_')) {
    imageOverridesNormalized[name.toLowerCase().trim()] = path;
  }
});

// Переопределения названий блюд (titleOverrides.json) — приводим названия из iiko к привычному виду
const titleOverridesNormalized = {};
Object.entries(titleOverrides).forEach(([name, displayTitle]) => {
  if (!name.startsWith('_')) {
    titleOverridesNormalized[name.toLowerCase().trim()] = displayTitle;
  }
});

// Обратный словарь из iikoNames: "паста" → "pasta", "классические чаи" → "tea", ...
const iikoCategoryNameToId = {};
CATEGORIES_CONFIG.forEach((cat) => {
  (cat.iikoNames || []).forEach((name) => {
    iikoCategoryNameToId[name.toLowerCase().trim()] = cat.id;
  });
});

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

          if (!data.success || !Array.isArray(data.categories)) {
            console.error('Неожиданный формат ответа меню:', data);
            return;
          }

          // Маппим iiko-категории на наши id из CATEGORIES_CONFIG по названию
          // Используем Map для дедупликации — один uid может встретиться в нескольких iiko-категориях
          const seenUids = new Map();

          data.categories.forEach((cat) => {
            const ourCategoryId =
              iikoCategoryNameToId[cat.name?.toLowerCase().trim()] ?? null;

            if (!ourCategoryId) {
              console.warn(`Категория iiko не найдена в CATEGORIES_CONFIG: "${cat.name}"`);
              return;
            }

            (cat.items || []).forEach((item) => {
              if (!seenUids.has(item.id)) {
                const originalName = item.name || '';
                const originalKey = originalName.toLowerCase().trim();
                const displayTitle = titleOverridesNormalized[originalKey] || originalName;
                const displayKey = displayTitle.toLowerCase().trim();

                // Ищем картинку: iiko → ручные переопределения → авто по названию из старого JSON
                const imagePath =
                  item.image ||
                  imageOverridesNormalized[originalKey] ||
                  imageOverridesNormalized[displayKey] ||
                  gustoNameToImage[displayKey] ||
                  gustoNameToImage[originalKey] ||
                  null;

                if (!imagePath) {
                  console.warn(`[IMG] Нет картинки: "${displayTitle}" (iiko: "${item.name}") → добавь в imageOverrides.json`);
                }

                seenUids.set(item.id, {
                  uid: item.id,
                  title: displayTitle,
                  price: item.price ?? 0,
                  descr: item.description || '',
                  gallery: imagePath,
                  category: ourCategoryId,
                });
              }
            });
          });

          // Сортируем меню по алфавиту
          const productsGusto = Array.from(seenUids.values()).sort((a, b) =>
            (a.title || '').localeCompare(b.title || '', 'ru', { sensitivity: 'base' })
          );

          set({ productsGusto });
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
          const currentBranchOrder = state.orders[state.branch] || {};
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
          const currentBranchOrder = state.orders[state.branch] || {};
          const count = currentBranchOrder[uid];

          if (!count || count <= 0) return {};

          // eslint-disable-next-line no-unused-vars
          const { [uid]: _, ...restItems } = currentBranchOrder;
          return {
            orders: {
              ...state.orders,
              [state.branch]: count === 1 ? restItems : { ...currentBranchOrder, [uid]: count - 1 },
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
      const price = aromaPrice[uid] || 0;
      return total + price * count;
    }, 0);
  } else {
    const menu = state.productsGusto || [];
    const priceMap = {};
    menu.forEach((product) => {
      priceMap[product.uid] = product.price || 0;
    });
    return Object.entries(order).reduce((total, [uid, count]) => {
      const price = priceMap[uid] || 0;
      return total + price * count;
    }, 0);
  }
};
