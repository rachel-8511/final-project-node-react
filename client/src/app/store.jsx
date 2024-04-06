import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";
import authSliceReducer from "../features/auth/authSlice"
const store=configureStore({
    reducer: {
        auth: authSliceReducer,
       [apiSlice.reducerPath]:apiSlice.reducer,

    },
    middleware:(getDefautMiddleware)=>getDefautMiddleware().concat(apiSlice.middleware),
    devTools:true
})
export default store