import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Plus, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ManageReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ rating: 5 })

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setReviews(data)
        } catch (error) {
            toast.error('Error fetching reviews')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', id)
            if (error) throw error
            toast.success('Deleted successfully')
            setReviews(reviews.filter(r => r.id !== id))
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            const { error } = await supabase.from('reviews').insert([formData])
            if (error) throw error
            toast.success('Review added successfully')
            setShowModal(false)
            setFormData({ rating: 5 })
            fetchReviews()
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Reviews</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-brand-gold text-brand-maroon px-4 py-2 rounded-lg font-bold hover:bg-yellow-400"
                >
                    <Plus size={20} /> Add Review
                </button>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Comment</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {reviews.map(review => (
                            <tr key={review.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{review.customer_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 flex">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{review.comment}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(review.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Review</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Customer Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    value={formData.customer_name || ''}
                                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Rating</label>
                                <select
                                    className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Comment</label>
                                <textarea
                                    className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    rows="3"
                                    value={formData.comment || ''}
                                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-maroon text-white rounded hover:bg-red-900"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageReviews
