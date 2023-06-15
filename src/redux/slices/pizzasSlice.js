import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Бизнес логика получения списка товаров магазина
export const fetchPizzas = createAsyncThunk(
   "pizza/fetchPizzasStatus",
   async (params, thunkAPI) => {
      const { category, search, sortBy, order, currentPage } = params;
      const { data } = await axios.get(
         `https://6469e04603bb12ac20946e3a.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      );
      if (data.length === 0) {
         return thunkAPI.rejectWithValue("Pizzas null");
      }
      return thunkAPI.fulfillWithValue(data);
   }
);

const initialState = {
   items: [],
   status: "loading", // loading |  success | error
};

const pizzasSlice = createSlice({
   name: "pizza",
   initialState,
   reducers: {
      setItems(state, action) {
         state.items = action.payload;
      },
   },
   extraReducers: {
      [fetchPizzas.pending]: (state) => {
         state.status = "loading";
         state.items = [];
      },

      [fetchPizzas.fulfilled]: (state, action) => {
         state.items = action.payload;
         state.status = "success";
      },

      [fetchPizzas.rejected]: (state, action) => {
         state.status = "error";
         state.items = [];
      },
   },
});

export const { setItems } = pizzasSlice.actions;

export default pizzasSlice.reducer;
