import type { CatalogSlice } from './catalogSlice';
import type { OrderSlice } from './orderSlice';
import type { UISlice } from './uiSlice';

export type AppStore = CatalogSlice & OrderSlice & UISlice;
