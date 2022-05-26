import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import cartItems from '../../data/cart.data';
import {openModal} from '../modal/modalSlice';

const url = 'https://course-api.com/react-useReducer-cart-project';
import axios from 'axios';
const initialState = {
  cartItems: cartItems,
  amount: 4,
  total: 0,
  isLoading: true
};
export const getCartItems: any = createAsyncThunk(
  'cart/getCartItems',
  async (name, thunkAPI) => {
    try {
      // console.log(name);
      // console.log(thunkAPI);
      // console.log(thunkAPI.getState());
      // thunkAPI.dispatch(openModal());
      const resp = await axios(url);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);
const cartSlice: any = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
    },
    increase: (state, {payload}) => {
      const cartItem: any = state.cartItems.find(
        item => item.id === payload.id
      );
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, {payload}) => {
      const cartItem: any = state.cartItems.find(
        item => item.id === payload.id
      );
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: state => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item: any) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    }
  },
  extraReducers: {
    [getCartItems.pending]: state => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      // console.log(action);
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      console.log(action);
      state.isLoading = false;
    }
  }
});

// console.log(cartSlice);
export const {
  clearCart,
  removeItem,
  increase,
  decrease,
  calculateTotals
} = cartSlice.actions;
export default cartSlice.reducer;
