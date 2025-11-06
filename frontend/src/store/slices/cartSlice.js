import { createSlice } from '@reduxjs/toolkit';
const initial = { items: [] };
const slice = createSlice({
  name: 'cart',
  initialState: initial,
  reducers: {
    addItem(state, action){
      const it = action.payload;
      // consider variant/selection when deduping cart entries
      const match = state.items.findIndex(i => i.dishId === it.dishId && (i.variant || null) === (it.variant || null));
      if(match > -1) state.items[match].quantity += it.quantity; else state.items.push(it);
    },
    removeItem(state, action){
      const p = action.payload;
      if(typeof p === 'string'){
        // old callers pass dishId string -> remove all variants of that dish
        state.items = state.items.filter(i=> i.dishId !== p);
      } else if(p && p.dishId){
        const { dishId, variant } = p;
        state.items = state.items.filter(i => !(i.dishId === dishId && (variant ? i.variant === variant : true)));
      }
    },
    updateQuantity(state, action){
      const { dishId, quantity, variant } = action.payload;
      const idx = state.items.findIndex(i=> i.dishId === dishId && (variant ? i.variant === variant : true));
      if(idx>-1){ if(quantity > 0) state.items[idx].quantity = quantity; else state.items.splice(idx,1); }
    },
    clearCart(state){ state.items = []; }
  }
});
export const { addItem, removeItem, updateQuantity, clearCart } = slice.actions;
export default slice.reducer;
