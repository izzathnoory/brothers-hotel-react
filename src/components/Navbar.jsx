import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone, Moon, Sun, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') || true
        }
        return true
    })
    const { user, isAdmin } = useAuth()
    const { lang, setLang, t } = useLanguage()

    // Initialize theme on mount
    useState(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleTheme = () => {
        setIsDark(!isDark)
        if (!isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    const toggleMenu = () => setIsOpen(!isOpen)

    const cycleLang = () => {
        if (lang === 'en') setLang('ta')
        else if (lang === 'ta') setLang('si')
        else setLang('en')
    }

    const navLinks = [
        { name: t('home'), path: '/' },
        { name: t('menu'), path: '/menu' },
        { name: t('gallery'), path: '/gallery' },
        { name: t('about'), path: '/about' },
    ]



    return (
        <nav className="bg-brand-maroon text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="font-bold text-xl tracking-wider flex items-center gap-2">
                            <span className="text-brand-gold">BROTHERS</span> HOTEL
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
                                            ? 'bg-brand-gold text-brand-maroon'
                                            : 'hover:bg-red-900 text-gray-200'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <button onClick={cycleLang} className="p-2 rounded-full hover:bg-red-900 transition-colors flex items-center gap-1">
                            <Globe size={20} />
                            <span className="uppercase font-bold text-xs">{lang}</span>
                        </button>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-red-900 transition-colors">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Phone Action */}
                        <a href="tel:+94776617979" className="flex items-center gap-2 bg-brand-gold text-brand-maroon px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                            <Phone size={18} />
                            <span>{t('orderNow')}</span>
                        </a>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-red-900 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-brand-maroon pb-4">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'bg-brand-gold text-brand-maroon'
                                        : 'text-gray-200 hover:bg-red-900'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="flex items-center gap-4 mt-4 px-3">
                            <button onClick={toggleTheme} className="p-2 rounded-full bg-red-900 text-white">
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button onClick={cycleLang} className="p-2 rounded-full bg-red-900 text-white flex gap-1 items-center">
                                <Globe size={20} />
                                <span className="uppercase font-bold text-xs">{lang}</span>
                            </button>
                            <a href="tel:+94776617979" className="flex-1 text-center bg-brand-gold text-brand-maroon px-4 py-2 rounded-full font-bold">
                                {t('orderNow')}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
