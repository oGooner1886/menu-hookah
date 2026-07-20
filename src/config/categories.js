import { BRANCHES } from '../store/useStore';

export const CATEGORIES_CONFIG = [
  { id: 'salads', label: 'Салаты', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'poke', label: 'Поке', branches: [BRANCHES.GUSTO] },
  { id: 'pasta', label: 'Пасты', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'snacks', label: 'Закуски', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'hotDish', label: 'Горячее', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'soup', label: 'Супы', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'desserts', label: 'Десерты', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'iceCream', label: 'Мороженое', branches: [BRANCHES.GUSTO] },
  { id: 'milkshake', label: 'Молочные коктейли', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'smoothie', label: 'Смузи', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'coffee', label: 'Кофе', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'tea', label: 'Чай', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'lemonade', label: 'Лимонады', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'drink', label: 'Напитки', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'alcohol', label: 'Алкоголь', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
  { id: 'coctail', label: 'Коктейли', branches: [BRANCHES.GUSTO, BRANCHES.AROMA] },
];
