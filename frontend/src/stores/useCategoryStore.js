import React from 'react'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import { create } from 'zustand'


export const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,

    setCaegories: (categories) => set({ categories }),

    fetchAllCategories: async () => {
        set({ loading: true })

        try {

            const res = await axios.get('/category')
            set({ categories: res.data.data })
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(error?.response?.data?.message)
        } finally {
            set({ loading: false })
        }
    }

}))