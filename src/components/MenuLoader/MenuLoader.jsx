import { useEffect } from 'react';
import { useMenuStore } from '../../store/useMenuStore';

const MenuLoader = () => {
  const loadProducts = useMenuStore((state) => state.loadProducts);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return null;
};

export default MenuLoader;
