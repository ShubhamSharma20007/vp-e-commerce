import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    carts: []
}

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const itemExists = state.carts.find((item) => item._id === action.payload._id)
            if (itemExists) {
                itemExists.quantity += 1
            } else {
                state.carts.push({ ...action.payload, quantity: 1 })
            }

        },
        removeFromCart: (state, action) => {
            state.carts = state.carts.filter((item) => item.id !== action.payload)
        },
        clearCart: (state) => {
            state.carts = []
        },

    }
})

export const { addToCart, removeFromCart, clearCart } = productSlice.actions
export default productSlice.reducer