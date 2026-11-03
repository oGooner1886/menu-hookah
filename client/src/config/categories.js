import { BRANCHES } from './branches';

// iikoNames — список названий категорий из iiko, которые мапятся на этот id.
// Сравнение регистронезависимое. Категории iiko не из этого списка — игнорируются.
export const CATEGORIES_CONFIG = [
  {
    id: 'salads',
    label: 'Салаты',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['салаты'],
  },
  {
    id: 'pasta',
    label: 'Пасты',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['пасты', 'паста'],
  },
  {
    id: 'poke',
    label: 'Поке',
    branches: [BRANCHES.GUSTO],
    iikoNames: ['поке'],
  },
  {
    id: 'snacks',
    label: 'Закуски',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['закуски'],
  },
  {
    id: 'hotDish',
    label: 'Горячее',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['горячее', 'горячие блюда'],
  },
  {
    id: 'soup',
    label: 'Супы',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['супы', 'суп'],
  },
  {
    id: 'desserts',
    label: 'Десерты',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['десерты', 'десерт'],
  },
  {
    id: 'iceCream',
    label: 'Мороженое',
    branches: [BRANCHES.GUSTO],
    iikoNames: ['мороженое', 'мороженое комбо'],
  },
  {
    id: 'milkshake',
    label: 'Молочные коктейли',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['молочные коктейли', 'молочный коктейль'],
  },
  {
    id: 'smoothie',
    label: 'Смузи',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['смузи'],
  },
  {
    id: 'coffee',
    label: 'Кофе',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['кофе'],
  },
  {
    id: 'tea',
    label: 'Чай',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['чай', 'классические чаи', 'фирменные чаи', 'чаи'],
  },
  {
    id: 'lemonade',
    label: 'Лимонады',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['лимонады', 'лимонад'],
  },
  {
    id: 'drink',
    label: 'Напитки',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['напитки', 'напиток'],
  },
  {
    id: 'alcohol',
    label: 'Алкоголь',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['алкоголь', 'алкогольные напитки', 'настойки'],
  },
  {
    id: 'coctail',
    label: 'Коктейли',
    branches: [BRANCHES.GUSTO, BRANCHES.AROMA],
    iikoNames: ['коктейли', 'коктейль'],
  },
];
