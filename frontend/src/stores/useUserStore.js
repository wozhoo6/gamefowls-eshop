import React from 'react'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import { create } from 'zustand'

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    sellers: [],

    signup: async (userData) => {
        set({ loading: true })

        const { name, password, email, contactNumber } = userData

        try {
            const res = await axios.post('/auth/signup', { name, email, password, contactNumber })
            set({ user: res.data.data, loading: false })
        } catch (error) {
            set({ loading: false })
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(error?.response?.data?.message)
        }
    },

    login: async (userData) => {
        set({ loading: true })

        try {
            const { email, password } = userData
            const res = await axios.post('/auth/login', { email, password })
            set({ user: res.data.data, loading: false })

        } catch (error) {
            set({ loading: false })
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(error?.response?.data?.message)
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true })

        try {
            const res = await axios.get('/auth/profile')
            set({ user: res.data.data, checkingAuth: false })
        } catch (error) {
            set({ user: null, checkingAuth: false })
        }
    },

    fetchSellerName: async (sellerId) => {
        set({ checkingAuth: true })

        const res = await axios.get(`/auth/seller/${sellerId}`)
        const seller = res.data.data
        return (seller.name)

    },

    logout: async () => {
        await axios.post("/auth/logout");
        set({ user: null });
    },

    fetchAllSeller: async () => {
        set({ loading: true })

        try {
            const res = await axios.get('/auth/seller/all')
            set({ sellers: res.data.data})

        } catch (error) {
            set({ loading: false })
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(error?.response?.data?.message)
        } finally {
            set({ loading: false })
        }
    }
}))


