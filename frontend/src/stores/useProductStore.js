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
            console.error('Full error:', error?.response?.data)
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

    fetchSellerProducts: async () => {
        set({ loading: true })

        try {
            const res = await axios.get('/products/seller')
            set({ products: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            console.error('Full error:', error?.response?.data)
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    fetchSellerProductByCategory: async (categoryId) => {
        try {
            const res = await axios.get(`/products/seller/${categoryId}`)
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


