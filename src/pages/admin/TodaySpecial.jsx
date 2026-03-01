import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Star, Search, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

const TodaySpecial = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('menu_items')
                .select('*, menu_item_categories(category_id, categories(id, name))')
                .eq('is_available', true)
                .order('name')

            if (error) throw error

            // Flatten category data
            const processed = (data || []).map(item => {
                const mappings = item.menu_item_categories || []
                const categoryNames = mappings.map(m => m.categories?.name).filter(Boolean)
                const { menu_item_categories, ...rest } = item
                return { ...rest, categoryNames }
            })

            setItems(processed)
        } catch (err) {
            toast.error('Error fetching menu items')
        } finally {
            setLoading(false)
        }
    }

    const isSpecialActive = (item) => {
        if (!item.today_special_at) return false
        const markedAt = new Date(item.today_special_at)
        const now = new Date()
        const hoursDiff = (now - markedAt) / (1000 * 60 * 60)
        return hoursDiff < 24
    }

    const toggleSpecial = async (item) => {
        try {
            const isCurrentlySpecial = isSpecialActive(item)
            const newValue = isCurrentlySpecial ? null : new Date().toISOString()

            const { error } = await supabase
                .from('menu_items')
                .update({ today_special_at: newValue })
                .eq('id', item.id)

            if (error) throw error

            toast.success(isCurrentlySpecial ? 'Removed from Today\'s Special' : 'Marked as Today\'s Special!')
            fetchItems()
        } catch (err) {
            toast.error(err.message)
        }
    }

    const getTimeRemaining = (item) => {
        if (!item.today_special_at) return null
        const markedAt = new Date(item.today_special_at)
        const expiresAt = new Date(markedAt.getTime() + 24 * 60 * 60 * 1000)
        const now = new Date()
        const diffMs = expiresAt - now
        if (diffMs <= 0) return 'Expired'
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        return `${hours}h ${mins}m remaining`
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryNames?.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Separate active specials from other items
    const activeSpecials = filteredItems.filter(item => isSpecialActive(item))
    const otherItems = filteredItems.filter(item => !isSpecialActive(item))

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-maroon"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Star className="text-amber-500" size={28} fill="currentColor" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Today's Special</h2>
            </div>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Select menu items to feature as today's special on the Home page. Items automatically expire after <strong>24 hours</strong>.
            </p>

            {/* Search */}
            <div className="relative w-full md:w-80 mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
            </div>

            {/* Active Specials */}
            {activeSpecials.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                        <Star size={20} fill="currentColor" /> Active Specials ({activeSpecials.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeSpecials.map(item => (
                            <div key={item.id} className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                                    <p className="text-sm text-brand-maroon dark:text-brand-gold font-bold">Rs. {item.offer_price || item.price}</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">{getTimeRemaining(item)}</p>
                                </div>
                                <button
                                    onClick={() => toggleSpecial(item)}
                                    className="self-center px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors flex-shrink-0"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Menu Items */}
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                All Menu Items ({otherItems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                            <p className="text-sm text-brand-maroon dark:text-brand-gold font-bold">Rs. {item.offer_price || item.price}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.categoryNames?.join(', ')}</p>
                        </div>
                        <button
                            onClick={() => toggleSpecial(item)}
                            className="self-center px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors flex-shrink-0 flex items-center gap-1"
                        >
                            <Star size={14} fill="currentColor" /> Add
                        </button>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No items found.
                </div>
            )}
        </div>
    )
}

export default TodaySpecial
