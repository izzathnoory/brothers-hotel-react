import { Link, Outlet } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, Image, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Toaster } from 'react-hot-toast'

const DashboardLayout = () => {
    const { signOut } = useAuth()

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-maroon text-white hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-brand-gold">Admin Panel</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/admin/menu" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors">
                        <UtensilsCrossed size={20} />
                        Menu Management
                    </Link>
                    <Link to="/admin/gallery" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors">
                        <Image size={20} />
                        Gallery
                    </Link>
                    <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors">
                        <Settings size={20} />
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-red-900">
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900 transition-colors text-left"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
            <Toaster position="top-right" />
        </div>
    )
}

export default DashboardLayout
