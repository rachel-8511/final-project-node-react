import { createSlice } from "@reduxjs/toolkit";

const productsInitSlice={
    products:[]

}

const productSlice=createSlice(
    {
        name:"products",
        initialState:productsInitSlice,
        reducers:{

        }
    }
)

export default productSlice.reducer