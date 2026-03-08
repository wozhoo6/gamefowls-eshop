import React from 'react'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import { create } from 'zustand'

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    featuredProducts: [],

    setProducts: (products) => set({ products }),
    setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),

    createProduct: async (productData) => {
        set({ loading: true })

        try {
            const res = await axios.post('products', productData)
            set((prev) => ({
                products: [...prev.products, res.data.data],
            }))
            toast.success('Product Created')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchAllActiveProducts: async () => {
        set({ loading: true })

        try {
            const res = await axios.get('/products')
            set({ products: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchProductsByCategory: async (categoryId) => {
        set({ loading: true })

        try {
            const res = await axios.get(`/products/?category=${categoryId}`)
            set({ products: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchProductById: async (productId) => {
        // When loading a single product, the API returns an object.
        // We keep `products` as an array everywhere else, so convert the
        // response into a one-element array to avoid calling array methods
        // on non-array values (see ProductDetailsPage).
        set({ loading: true })

        try {
            const res = await axios.get(`/products/${productId}`)
            const productData = res.data.data
            // if somehow the API returns an array already, just use it
            set({ products: Array.isArray(productData) ? productData : [productData] })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true })

        try {
            const res = await axios.get('/products?isFeatured=true')
            set({ featuredProducts: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchSellerProducts: async (sellerId) => {
        set({ loading: true })

        try {
            const res = await axios.get(`/products/seller/${sellerId}`)
            set({ products: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:',msg)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchSellerProductByCategory: async (categoryId) => {
        try {
            const res = await axios.get(`/products/seller/product/${categoryId}`)
            set({ products: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    updateProduct: async (productId, productData) => {
        set({ loading: true })
        try {
            const res = await axios.put(`products/${productId}`, productData)
            set((prev) => ({
                products: prev.products.map((product) =>
                    product._id === productId ? { ...product, ...res.data.data } : product),
            }))
            toast.success('Product Updated')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    toggleFeature: async (productId, isFeatured) => {

        set({ loading: true })
        try {

            const res = await axios.put(`products/${productId}`, { isFeatured })

            set((prev) => ({
                products: prev.products.map((product) =>
                    product._id === productId ? { ...product, ...res.data.data } : product),
            }))

            toast.success('Product Updated')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    deleteProduct: async (productId) => {

        set({ loading: true })
        try {
            const res = await axios.patch(`products/delete/${productId}`)

            set((prev) => ({
                products: prev.products.filter(product => product._id !== productId),
            }))

            toast.success('Product Deleted')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    }
}))


