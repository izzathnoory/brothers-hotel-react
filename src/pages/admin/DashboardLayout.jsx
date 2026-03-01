import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, Image, Settings, LogOut, Star, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Toaster } from 'react-hot-toast'

const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu Management' },
    { to: '/admin/today-special', icon: Star, label: "Today's Special" },
    { to: '/admin/gallery', icon: Image, label: 'Gallery' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

const DashboardLayout = () => {
    const { signOut } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const NavContent = () => (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-brand-gold">Admin Panel</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navLinks.map(({ to, icon: Icon, label }) => (
                    <Link
                        key={to}
                        to={to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === to
                                ? 'bg-red-900 text-brand-gold'
                                : 'hover:bg-red-900'
                            }`}
                    >
                        <Icon size={20} />
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-red-900">
                <button
                    onClick={() => { setSidebarOpen(false); signOut() }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900 transition-colors text-left"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </>
    )

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-brand-maroon text-white hidden md:flex flex-col">
                <NavContent />
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-brand-maroon text-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white hover:text-brand-gold"
                >
                    <X size={24} />
                </button>
                <NavContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden bg-brand-maroon text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="hover:text-brand-gold">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-brand-gold">Admin Panel</h1>
                </div>
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            <Toaster position="top-right" />
        </div>
    )
}

export default DashboardLayout
