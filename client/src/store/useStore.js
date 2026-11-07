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

// Конфигурация группировки позиций для демонстрации заказчику:
// 1. modal + bottom_sheet: Картофель фри (шторка снизу)
// 2. modal + centered_modal: Соус на выбор (классическое окно по центру, как было раньше)
// 3. inline_switch: Вишнёвый чай (переключатель 0.5 л / 1 л прямо в карточке без окон)
const PRODUCT_EDITIONS_GROUPS = [
  {
    groupId: 'group-french-fries',
    title: 'Картофель фри',
    category: 'snacks',
    gallery: '/Snack/French fries.webp',
    descr: 'Хрустящий картофель фри с золотистой корочкой',
    uiType: 'modal',
    modalType: 'bottom_sheet',
    items: [
      { iikoName: 'Картофель фри 150гр', subtitle: '150 г', weight: '150г' },
      { iikoName: 'Картофель фри 250гр', subtitle: '250 г', weight: '250г' },
    ],
  },
  {
    groupId: 'group-sauce',
    title: 'Соус на выбор',
    category: 'snacks',
    gallery: '/Snack/sauce.webp',
    descr: 'Фирменные порционные соусы к закускам и блюдам',
    uiType: 'modal',
    modalType: 'centered_modal',
    items: [
      { iikoName: 'Сырный соус порция', subtitle: 'Сырный', weight: '' },
      { iikoName: 'Чесночный соус порция', subtitle: 'Чесночный', weight: '' },
      { iikoName: 'Барбекю соус порция', subtitle: 'Барбекю', weight: '' },
      { iikoName: 'Кетчуп соус', subtitle: 'Кетчуп', weight: '' },
      { iikoName: 'Кисло сладкий соус порция', subtitle: 'Кисло-сладкий', weight: '' },
      { iikoName: 'Соус терияки порция', subtitle: 'Терияки', weight: '' },
      { iikoName: '1000 островов соус', subtitle: '1000 островов', weight: '' },
      { iikoName: 'Сладкий чили соус', subtitle: 'Сладкий чили', weight: '' },
    ],
  },
  {
    groupId: 'group-cherry-tea',
    title: 'Вишнёвый чай',
    category: 'tea',
    gallery: '/Tea/Cherry.webp',
    descr: 'Ароматный согревающий чай с вишней',
    uiType: 'inline_switch',
    items: [
      { iikoName: 'Вишневый чай 0,5л', subtitle: '0.5 л', weight: '0.5 л' },
      { iikoName: 'Вишневый чай 1л', subtitle: '1 л', weight: '1 л' },
    ],
  },
];

const editionItemToGroupMap = new Map();
PRODUCT_EDITIONS_GROUPS.forEach((grp) => {
  grp.items.forEach((it) => {
    editionItemToGroupMap.set(it.iikoName.toLowerCase().trim(), {
      group: grp,
      config: it,
    });
  });
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
      item: null,

      setItem: (item) => set({ item }),

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
          const activeGroups = new Map();

          data.categories.forEach((cat) => {
            const ourCategoryId =
              iikoCategoryNameToId[cat.name?.toLowerCase().trim()] ?? null;

            if (!ourCategoryId) {
              console.warn(`Категория iiko не найдена в CATEGORIES_CONFIG: "${cat.name}"`);
              return;
            }

            (cat.items || []).forEach((item) => {
              const originalName = item.name || '';
              const originalKey = originalName.toLowerCase().trim();

              // Проверяем, объединяется ли позиция в группу с выбором порции (Bottom Sheet)
              if (editionItemToGroupMap.has(originalKey)) {
                const { group, config } = editionItemToGroupMap.get(originalKey);
                if (!activeGroups.has(group.groupId)) {
                  activeGroups.set(group.groupId, {
                    uid: group.groupId,
                    title: group.title,
                    descr: item.description || group.descr || '',
                    gallery: group.gallery,
                    category: group.category || ourCategoryId,
                    price: item.price ?? 0,
                    uiType: group.uiType || 'modal',
                    modalType: group.modalType || 'bottom_sheet',
                    editions: [],
                  });
                }
                const grpObj = activeGroups.get(group.groupId);
                grpObj.editions.push({
                  uid: item.id,
                  title: group.title,
                  subtitle: config.subtitle,
                  weight: config.weight,
                  price: item.price ?? 0,
                  gallery: group.gallery,
                  descr: item.description || '',
                });
                // Минимальная цена для бейджа "от ... ₽"
                grpObj.price = Math.min(...grpObj.editions.map((e) => e.price));
                return;
              }

              if (!seenUids.has(item.id)) {
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

          // Добавляем объединенные группы в меню
          activeGroups.forEach((grp) => {
            grp.editions.sort((a, b) => a.price - b.price);
            seenUids.set(grp.uid, grp);
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
      if (product.editions) {
        product.editions.forEach((ed) => {
          priceMap[ed.uid] = ed.price || 0;
        });
      }
    });
    return Object.entries(order).reduce((total, [uid, count]) => {
      const price = priceMap[uid] || 0;
      return total + price * count;
    }, 0);
  }
};
