import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Star, Clock, Image as ImageIcon, ArrowRight } from 'lucide-react'

const Dashboard = () => {
    const [specials, setSpecials] = useState([])
    const [, setTick] = useState(0) // force re-render every minute for countdown

    useEffect(() => {
        fetchSpecials()
        // Update countdown every minute
        const interval = setInterval(() => setTick(t => t + 1), 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchSpecials = async () => {
        try {
            const { data } = await supabase
                .from('menu_items')
                .select('id, name, price, offer_price, image_url, today_special_at')
                .not('today_special_at', 'is', null)
                .eq('is_available', true)
                .order('today_special_at', { ascending: false })

            // Filter to only active (within 24h)
            const now = new Date()
            const active = (data || []).filter(item => {
                const markedAt = new Date(item.today_special_at)
                return (now - markedAt) / (1000 * 60 * 60) < 24
            })
            setSpecials(active)
        } catch (err) {
            console.error('Error fetching specials:', err)
        }
    }

    const getTimeRemaining = (todaySpecialAt) => {
        const markedAt = new Date(todaySpecialAt)
        const expiresAt = new Date(markedAt.getTime() + 24 * 60 * 60 * 1000)
        const now = new Date()
        const diffMs = expiresAt - now
        if (diffMs <= 0) return { text: 'Expired', urgent: true }
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        return {
            text: `${hours}h ${mins}m remaining`,
            urgent: hours < 2
        }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Welcome, Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Menu Items</h3>
                    <p className="text-3xl font-bold text-brand-maroon dark:text-brand-gold">Manage</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Gallery Images</h3>
                    <p className="text-3xl font-bold text-brand-maroon dark:text-brand-gold">Update</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Reviews</h3>
                    <p className="text-3xl font-bold text-brand-maroon dark:text-brand-gold">View</p>
                </div>
            </div>

            {/* Today's Special Section */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Star className="text-amber-500" size={24} fill="currentColor" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Today's Special</h3>
                    </div>
                    <Link
                        to="/admin/today-special"
                        className="text-sm text-brand-maroon dark:text-brand-gold font-medium hover:underline flex items-center gap-1"
                    >
                        Manage <ArrowRight size={14} />
                    </Link>
                </div>

                {specials.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-8 text-center">
                        <Star className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
                        <p className="text-gray-500 dark:text-gray-400 mb-3">No active specials right now.</p>
                        <Link
                            to="/admin/today-special"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors"
                        >
                            <Star size={14} fill="currentColor" /> Add Today's Special
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {specials.map(item => {
                            const timer = getTimeRemaining(item.today_special_at)
                            return (
                                <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden border border-amber-200 dark:border-amber-700">
                                    <div className="flex gap-4 p-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                                            <p className="text-sm text-brand-maroon dark:text-brand-gold font-bold">
                                                Rs. {item.offer_price || item.price}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 flex items-center gap-2 text-sm font-medium ${timer.urgent
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                        }`}>
                                        <Clock size={14} />
                                        {timer.text}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <p className="mt-8 text-gray-600 dark:text-gray-400">Select an option from the sidebar to get started.</p>
        </div>
    )
}
export default Dashboard
