import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveBranchFromPath, useMenuStore } from '../../store/useMenuStore';

const BranchSync = () => {
  const location = useLocation();
  const setBranch = useMenuStore((state) => state.setBranch);

  useLayoutEffect(() => {
    const branch = resolveBranchFromPath(location.pathname);
    if (branch) setBranch(branch);
    // на /order и / филиал не меняем — остаётся последний выбранный
  }, [location.pathname, setBranch]);

  return null;
};

export default BranchSync;
