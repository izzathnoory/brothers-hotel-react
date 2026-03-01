import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ManageMenu = () => {
    const [activeTab, setActiveTab] = useState('items') // 'items' or 'categories'
    const [categories, setCategories] = useState([])
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // Form States
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null) // If null, adding new
    const [formData, setFormData] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const { data: cats } = await supabase.from('categories').select('*').order('name')
            const { data: menu } = await supabase.from('menu_items').select('*, menu_item_categories(category_id, categories(id, name))').order('name')

            // Flatten junction table data into categoryIds and categoryNames
            const processedMenu = (menu || []).map(item => {
                const mappings = item.menu_item_categories || []
                const categoryIds = mappings.map(m => m.category_id)
                const categoryNames = mappings.map(m => m.categories?.name).filter(Boolean)
                const { menu_item_categories, ...rest } = item
                return { ...rest, categoryIds, categoryNames }
            })

            setCategories(cats || [])
            setItems(processedMenu)
        } catch (error) {
            toast.error('Error fetching data')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (table, id) => {
        if (!confirm('Are you sure?')) return
        try {
            const { error } = await supabase.from(table).delete().eq('id', id)
            if (error) throw error
            toast.success('Deleted successfully')
            fetchData()
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        console.log("Navigating to save...", { activeTab, formData, editingItem })

        // Manual Validation
        if (!formData.name) {
            toast.error("Name is required")
            return
        }

        if (activeTab === 'items') {
            if (!formData.price) {
                toast.error("Price is required")
                return
            }
            if (!formData.category_ids || formData.category_ids.length === 0) {
                toast.error("Please select at least one category")
                return
            }
        }

        try {
            const table = activeTab === 'categories' ? 'categories' : 'menu_items'
            console.log("Target Table:", table)

            let dataToSave = { ...formData }

            // Clean up data based on table
            if (activeTab === 'categories') {
                // Categories only need name
                dataToSave = { name: dataToSave.name }
            } else {
                // Menu Items
                // Remove fields that don't belong on the menu_items table
                delete dataToSave.categoryIds
                delete dataToSave.categoryNames
                const selectedCategoryIds = formData.category_ids || []
                delete dataToSave.category_ids

                // Ensure price is a number
                if (dataToSave.price) {
                    dataToSave.price = parseFloat(dataToSave.price)
                }

                // Handle offer_price
                if (dataToSave.offer_price) {
                    dataToSave.offer_price = parseFloat(dataToSave.offer_price)
                } else {
                    dataToSave.offer_price = null
                }

                // Store category_ids temporarily for junction sync
                dataToSave._selectedCategoryIds = selectedCategoryIds
            }

            console.log("Data to save:", dataToSave)

            // If uploading image for item (only for items)
            if (activeTab === 'items' && formData.imageFile) {
                console.log("Uploading image...")
                const file = formData.imageFile
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage.from('menu-images').upload(fileName, file)
                if (uploadError) {
                    console.error("Upload Error:", uploadError)
                    throw uploadError
                }

                const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(fileName)
                dataToSave.image_url = publicUrl
                delete dataToSave.imageFile
                console.log("Image uploaded, URL:", publicUrl)
            } else if (activeTab === 'items') {
                delete dataToSave.imageFile
            }

            // Extract category IDs before saving to menu_items
            const selectedCategoryIds = dataToSave._selectedCategoryIds
            delete dataToSave._selectedCategoryIds

            let result;
            let itemId;
            if (editingItem) {
                console.log("Updating item:", editingItem.id)
                result = await supabase.from(table).update(dataToSave).eq('id', editingItem.id)
                itemId = editingItem.id
            } else {
                console.log("Inserting new item")
                result = await supabase.from(table).insert([dataToSave]).select('id').single()
                itemId = result.data?.id
            }

            const { error } = result
            if (error) {
                console.error("Supabase Error:", error)
                throw error
            }

            // Sync junction table for menu items
            if (activeTab === 'items' && itemId && selectedCategoryIds) {
                // Delete existing mappings
                const { error: delError } = await supabase
                    .from('menu_item_categories')
                    .delete()
                    .eq('menu_item_id', itemId)
                if (delError) throw delError

                // Insert new mappings
                if (selectedCategoryIds.length > 0) {
                    const rows = selectedCategoryIds.map(cid => ({
                        menu_item_id: itemId,
                        category_id: cid,
                    }))
                    const { error: insError } = await supabase
                        .from('menu_item_categories')
                        .insert(rows)
                    if (insError) throw insError
                }
            }

            console.log("Save successful!")
            toast.success('Saved successfully')
            setShowModal(false)
            setEditingItem(null)
            setFormData({})
            fetchData()
        } catch (err) {
            console.error("HandleSave Exception:", err)
            if (err.message.includes("policy")) {
                toast.error("Database Permission Denied! You must run the grant_admin.sql script in Supabase.")
            } else {
                toast.error(`Error: ${err.message}`)
            }
        }
    }

    const openModal = (item = null) => {
        setEditingItem(item)
        if (item) {
            setFormData({ ...item, category_ids: item.categoryIds || [] })
        } else {
            setFormData({ is_available: true, category_ids: [] })
        }
        setShowModal(true)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Manage Menu</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('items')}
                    className={`px-4 py-2 rounded-lg ${activeTab === 'items' ? 'bg-brand-maroon text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Menu Items
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-lg ${activeTab === 'categories' ? 'bg-brand-maroon text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Categories
                </button>
            </div>

            <button
                onClick={() => openModal()}
                className="mb-6 flex items-center gap-2 bg-brand-gold text-brand-maroon px-4 py-2 rounded-lg font-bold hover:bg-yellow-400"
            >
                <Plus size={20} /> Add New {activeTab === 'items' ? 'Item' : 'Category'}
            </button>

            {/* List */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow overflow-hidden">
                {activeTab === 'categories' ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cat.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(cat)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete('categories', cat.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                        <div className="flex items-center gap-2">
                                            {item.offer_price && item.offer_price < item.price ? (
                                                <>
                                                    <p className="text-sm text-gray-500 line-through">Rs. {item.price}</p>
                                                    <p className="text-sm text-brand-maroon dark:text-brand-gold font-bold">Rs. {item.offer_price}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-brand-maroon dark:text-brand-gold font-bold">Rs. {item.price}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.categoryNames?.join(', ')}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.is_available ? 'Available' : 'Out of Stock'}
                                            </span>
                                            {item.offer_text && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-bold border border-yellow-200">
                                                    {item.offer_text}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-auto">
                                    <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete('menu_items', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingItem ? 'Edit' : 'Add'} {activeTab === 'items' ? 'Item' : 'Category'}
                        </h3>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter name"
                                />
                            </div>

                            {activeTab === 'items' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                                        <textarea
                                            className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                            value={formData.description || ''}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter description"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Price (Rs.)</label>
                                            <input
                                                type="number"
                                                className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                                value={formData.price || ''}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="Original Price"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Offer Price (Optional)</label>
                                            <input
                                                type="number"
                                                className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                                value={formData.offer_price || ''}
                                                onChange={e => setFormData({ ...formData, offer_price: e.target.value })}
                                                placeholder="Discounted Price"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Categories</label>
                                        <div className="border rounded p-3 dark:bg-neutral-700 dark:border-neutral-600 space-y-2 max-h-40 overflow-y-auto">
                                            {categories.map(c => (
                                                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={(formData.category_ids || []).includes(c.id)}
                                                        onChange={e => {
                                                            const ids = formData.category_ids || []
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, category_ids: [...ids, c.id] })
                                                            } else {
                                                                setFormData({ ...formData, category_ids: ids.filter(id => id !== c.id) })
                                                            }
                                                        }}
                                                        className="rounded text-brand-maroon focus:ring-brand-gold"
                                                    />
                                                    <span className="text-sm dark:text-gray-300">{c.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Offer (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                            value={formData.offer_text || ''}
                                            onChange={e => setFormData({ ...formData, offer_text: e.target.value })}
                                            placeholder="e.g. 10% OFF, Buy 1 Get 1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Image</label>
                                        <input
                                            type="file"
                                            className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                            onChange={e => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_available"
                                            checked={formData.is_available ?? true}
                                            onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                                        />
                                        <label htmlFor="is_available" className="dark:text-gray-300">Available</label>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
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

export default ManageMenu
