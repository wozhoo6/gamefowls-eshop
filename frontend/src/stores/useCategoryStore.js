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
    },

    createParentCategory: async (categoryName) => {
        set({ loading: true })

        try {
            const res = await axios.post('/category', (null, categoryName))
            set((prev) => ({
                categories: [...prev.categories, res.data.data]
            }))
            toast.success('New Category Added')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },


    createSubcategory: async (categoryData) => {
        set({ loading: true })
        const { parentId, name } = categoryData
        try {
            const res = await axios.post('/category', { parentId, name })
            set((prev) => ({
                categories: [...prev.categories, res.data.data]
            }))
            toast.success('New Category Added')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    },

    deleteCategory: async (categoryId) => {
        set({ loading: true })
        try {
            const res = await axios.delete(`/category/${categoryId}`)
            set((prev) => ({
                categories: prev.categories.filter(category => category._id !== categoryId)
            }))
            toast.success('Category Deleted')
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'An error occurred'
            toast.error(msg)
        } finally {
            set({ loading: false })
        }
    }


}))