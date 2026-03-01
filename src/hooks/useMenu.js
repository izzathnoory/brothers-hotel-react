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

                // Fetch menu items with their categories via junction table
                const { data: itemsData, error: itemsError } = await supabase
                    .from('menu_items')
                    .select('*, menu_item_categories(category_id, categories(id, name))')
                    .order('name')

                if (itemsError) throw itemsError

                // Flatten the nested join into categoryIds and categoryNames arrays
                const now = new Date()
                const processedItems = (itemsData || []).map(item => {
                    const mappings = item.menu_item_categories || []
                    const categoryIds = mappings.map(m => m.category_id)
                    const categoryNames = mappings
                        .map(m => m.categories?.name)
                        .filter(Boolean)

                    // Check if today's special is still active (within 24h)
                    let isTodaySpecial = false
                    if (item.today_special_at) {
                        const markedAt = new Date(item.today_special_at)
                        const hoursDiff = (now - markedAt) / (1000 * 60 * 60)
                        isTodaySpecial = hoursDiff < 24
                    }

                    // Remove the raw join data, add flattened arrays
                    const { menu_item_categories, ...rest } = item
                    return {
                        ...rest,
                        categoryIds,
                        categoryNames,
                        isTodaySpecial,
                    }
                })

                setCategories(categoriesData)
                setMenuItems(processedItems)
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
