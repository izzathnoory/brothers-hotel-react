import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        opening_hours: '05:00 AM – 04:00 PM',
        is_closed: false,
        reopening_date: null,
        closed_days: 'Friday'
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSettings()

        // Subscribe to changes
        const subscription = supabase
            .channel('site_settings')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, payload => {
                setSettings(payload.new)
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single() // We only have one row with ID 1

            if (error) {
                // If table doesn't exist or empty, we use defaults
                console.warn("Could not fetch settings:", error.message)
                return
            }

            if (data) {
                setSettings(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateSettings = async (newSettings) => {
        try {
            const { error } = await supabase
                .from('site_settings')
                .update(newSettings)
                .eq('id', 1)

            if (error) throw error

            // Optimistic update
            setSettings({ ...settings, ...newSettings })
            return { success: true }
        } catch (error) {
            console.error("Error updating settings:", error)
            return { success: false, error }
        }
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    )
}
