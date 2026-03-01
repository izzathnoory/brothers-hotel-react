import { useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { Search, Star } from 'lucide-react'

const Menu = () => {
    const { categories, menuItems, loading, error } = useMenu()
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-maroon dark:border-brand-gold"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error loading menu: {error}
            </div>
        )
    }

    // Filter items based on category and search
    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.categoryIds?.includes(selectedCategory)
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Group categories for tabs (All + fetched categories)
    // We need to handle the case where categories might be empty if DB is empty
    // But we want to show 'All' at least.

    return (
        <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 pt-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2 text-brand-maroon dark:text-brand-gold">Our Menu</h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-10">Explore our authentic Sri Lankan dishes</p>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
                    {/* Categories */}
                    <div className="flex overflow-x-auto pb-2 gap-2 w-full md:w-auto hide-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === 'All'
                                ? 'bg-brand-maroon text-white dark:bg-brand-gold dark:text-brand-maroon'
                                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                    ? 'bg-brand-maroon text-white dark:bg-brand-gold dark:text-brand-maroon'
                                    : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                        />
                    </div>
                </div>

                {/* Today's Special Section */}
                {(() => {
                    const todaySpecials = filteredItems.filter(item => item.isTodaySpecial && item.is_available)
                    if (todaySpecials.length === 0) return null
                    return (
                        <div className="mb-12">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Star className="text-amber-500" size={24} fill="currentColor" />
                                <h2 className="text-2xl md:text-3xl font-bold text-brand-maroon dark:text-brand-gold">Today's Special</h2>
                                <Star className="text-amber-500" size={24} fill="currentColor" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {todaySpecials.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border-2 border-amber-300 dark:border-amber-600">
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                                                    <Star size={12} fill="currentColor" /> Special
                                                </span>
                                            </div>
                                            {item.offer_text && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-brand-gold text-brand-maroon px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md">
                                                        {item.offer_text}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                                <div className="text-right">
                                                    {item.offer_price && item.offer_price < item.price ? (
                                                        <>
                                                            <span className="text-sm text-gray-500 line-through mr-2">Rs. {item.price}</span>
                                                            <span className="text-lg font-bold text-brand-maroon dark:text-brand-gold">Rs. {item.offer_price}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-brand-maroon dark:text-brand-gold">Rs. {item.price}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr className="mt-12 border-gray-200 dark:border-gray-700" />
                        </div>
                    )
                })()}

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                    />
                                    {!item.is_available && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">Out of Stock</span>
                                        </div>
                                    )}
                                    {item.is_available && item.offer_text && (
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-brand-gold text-brand-maroon px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md">
                                                {item.offer_text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                        <div className="text-right">
                                            {item.offer_price && item.offer_price < item.price ? (
                                                <>
                                                    <span className="text-sm text-gray-500 line-through mr-2">Rs. {item.price}</span>
                                                    <span className="text-lg font-bold text-brand-maroon dark:text-brand-gold">Rs. {item.offer_price}</span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold text-brand-maroon dark:text-brand-gold">Rs. {item.price}</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No items found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Menu
