import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: "",
    checkName: null,
    idProducts: null,
    products: null,
    idProcductCheck: [],
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {

    checkName: (state,action) => {
        state.checkName = action.payload;
    },

    updateID: (state,action) => {
        state.idProducts = action.payload;
    },

    updateProducts: (state,action) => {
        state.products = action.payload;
    },

    updateIDProductCheck: (state,action) => {
        if (action.payload.includes(null) && action.payload.length === 1 ) {
            state.idProcductCheck = []
        } else {
            state.idProcductCheck = action.payload;
        }
    },


  },
});

export const {updateBrand, updatePrice, checkBrand, checkPrice, checkName, updateID, updateProducts, updateIDProductCheck, updateIDProductCheckPrice} = productsSlice.actions;

export default productsSlice.reducer;