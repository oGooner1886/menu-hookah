import type { StateCreator } from 'zustand';
import type { AppStore } from './storeTypes';
import type { Product } from './types';

export interface UISlice {
  editingItem: Product | null;
  setEditingItem: (item: Product | null) => void;
  welcomeModalOpen: boolean;
  setWelcomeModalOpen: (open: boolean) => void;
}

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (set) => ({
  editingItem: null,
  setEditingItem: (item) => set({ editingItem: item }),
  welcomeModalOpen: true,
  setWelcomeModalOpen: (open) => set({ welcomeModalOpen: open }),
});
