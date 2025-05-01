import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItems = Record<number, number>;

type CartState = {
  items: CartItems;
  setCart: (items: CartItems) => void;
  clearCart: () => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},

      setCart: (items) => set({ items }),

      clearCart: () => set({ items: {} }),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
