import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useMenu = () => {
    const [categories, setCategories] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true)

                // Fetch categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name')

                if (categoriesError) throw categoriesError

                // Fetch menu items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('menu_items')
                    .select('*, categories(name)')
                    .order('name')

                if (itemsError) throw itemsError

                setCategories(categoriesData)
                setMenuItems(itemsData)
            } catch (err) {
                console.error('Error fetching menu:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    return { categories, menuItems, loading, error }
}
