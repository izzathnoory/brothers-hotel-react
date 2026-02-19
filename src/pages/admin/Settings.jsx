import { useState, useEffect } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Save, Clock, Calendar, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Settings = () => {
    const { settings, updateSettings, loading } = useSettings()
    const [formData, setFormData] = useState({
        opening_hours: '',
        is_closed: false,
        reopening_date: '',
        closed_days: ''
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (settings) {
            setFormData({
                opening_hours: settings.opening_hours || '',
                is_closed: settings.is_closed || false,
                reopening_date: settings.reopening_date || '',
                closed_days: settings.closed_days || ''
            })
        }
    }, [settings])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        const result = await updateSettings(formData)
        if (result.success) {
            toast.success("Settings updated successfully!")
        } else {
            toast.error("Failed to update settings.")
        }
        setSaving(false)
    }

    if (loading) return <div>Loading settings...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                Site Settings
            </h2>

            <form onSubmit={handleSave} className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg space-y-6">

                {/* Opening Hours */}
                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300 flex items-center gap-2">
                        <Clock size={18} /> Opening Hours Text
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                        value={formData.opening_hours}
                        onChange={e => setFormData({ ...formData, opening_hours: e.target.value })}
                        placeholder="e.g. 05:00 AM – 04:00 PM"
                    />
                    <p className="text-xs text-gray-500 mt-1">This text will be displayed in the footer and home page.</p>
                </div>

                {/* Closed Days */}
                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300 flex items-center gap-2">
                        <Clock size={18} /> Closed Days
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                        value={formData.closed_days || ''}
                        onChange={e => setFormData({ ...formData, closed_days: e.target.value })}
                        placeholder="e.g. Friday"
                    />
                    <p className="text-xs text-gray-500 mt-1">Specify days when the shop is regularly closed (e.g. "Friday" or "None").</p>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Shop Status */}
                <div>
                    <label className="block text-sm font-medium mb-4 dark:text-gray-300 flex items-center gap-2">
                        <AlertTriangle size={18} /> Shop Status
                    </label>

                    <div className="flex items-center gap-4 mb-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.is_closed}
                                onChange={e => setFormData({ ...formData, is_closed: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {formData.is_closed ? 'Shop is CLOSED' : 'Shop is OPEN'}
                            </span>
                        </label>
                    </div>

                    {formData.is_closed && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300 flex items-center gap-2">
                                <Calendar size={18} /> Reopening Date (Optional)
                            </label>
                            <input
                                type="date"
                                className="w-full border rounded-lg p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                value={formData.reopening_date || ''}
                                onChange={e => setFormData({ ...formData, reopening_date: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">If set, a message "Reopening on [Date]" will be shown.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-brand-maroon text-white px-6 py-2 rounded-lg font-bold hover:bg-red-900 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Settings
