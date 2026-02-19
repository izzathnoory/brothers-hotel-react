import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            checkAdmin(session?.user)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            checkAdmin(session?.user)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const checkAdmin = async (currentUser) => {
        if (!currentUser) {
            setIsAdmin(false)
            return
        }

        // In a real app, you might check a 'role' in 'admin_users' table or metadata
        // For now, let's assume we check against a specific email or metadata
        // Or we can query the admin_users table if we created it

        const { data, error } = await supabase
            .from('admin_users')
            .select('role')
            .eq('id', currentUser.id)
            .single()

        if (data && data.role === 'admin') {
            setIsAdmin(true)
        } else {
            // Fallback or explicit check for the owner email/UID if database is empty initially
            const adminEmails = ['shahbazfirthows@gmail.com', 'izzathnoory11@gmail.com']
            const adminIds = ['88ca3a05-60be-4f18-b3ad-f7df8762d14e']

            if (adminEmails.includes(currentUser.email) || adminIds.includes(currentUser.id)) {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        }
    }

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        isAdmin,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
