import axios from '../lib/axios'
import toast from 'react-hot-toast'
import { create } from 'zustand'

export const useCartStore = create((set, get) => ({

    cart: [],
    loading: false,
    cartLength: 0,

    setCart: (cart) => set({ cart }),

    // 🛒 Fetch Cart
    fetchCart: async () => {
        set({ loading: true })
        try {
            const res = await axios.get('/cart')
            set({ cart: res.data.data })
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to fetch cart'
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    // ➕ Add to Cart
    addToCart: async (productId, quantity = 1) => {
        try {
            const res = await axios.post('/cart', { productId })
            set({ cart: res.data.data })
            // update length stored in state
            await get().getCartLength()
            toast.success('Added to cart')
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                toast.error("Please log in to add items to your cart.")
            return ({ err: msg })
        }
    },

    // 🔄 Update Quantity
    updateCartItem: async (productId, quantity) => {
        try {
            const res = await axios.put('/cart', { productId, quantity })

            console.log(quantity)

            set({ cart: res.data.data })
            toast.success('Cart updated')
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to update cart'
            toast.error(msg)
            console.log
        }
    },

    // ❌ Remove Item
    removeCartItem: async (productId) => {
        try {
            await axios.delete(`/cart/${productId}`)

            set((state) => ({
                cart: state.cart.filter(
                    (cartItem) => cartItem._id !== productId
                )
            }))
            await get().getCartLength()

            toast.success('Item removed')
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to remove item'
            toast.error(msg)
        }
    },

    // 🗑 Clear Cart
    clearCart: async () => {
        try {
            await axios.delete('/cart')

            set({ cart: [] })
            toast.success('Cart cleared')
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to clear cart'
            toast.error(msg)
        }
    },

    // 💰 Computed Total (client-side)
    getCartTotal: () => {
        const cart = get().cart
        return cart.reduce((total, item) => {
            const price = item.product?.price || 0
            return total + price * item.quantity
        }, 0)
    },

    getCartLength: async () => {
        const res = await axios.get('/cart/length')
        set({ cartLength: res.data.data || 0 })
    }

}))