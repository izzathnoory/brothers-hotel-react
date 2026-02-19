import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const Footer = () => {
    const { settings } = useSettings()
    return (
        <footer className="bg-neutral-900 text-gray-300 pt-10 pb-6 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand & Description */}
                    <div>
                        <h3 className="text-2xl font-bold text-brand-gold mb-4">BROTHERS HOTEL</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            Serving Authentic Sri Lankan Flavours from Sunrise to Midnight.
                            Established in 2013, we bring the taste of tradition to your plate.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
                            {/* Note: TikTok icon not in standard Lucide set, using Twitter as placeholder or check if available */}
                            <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-brand-gold mt-1 flex-shrink-0" />
                                <span>1 Police Station Rd, Kalmunai 32300, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-brand-gold flex-shrink-0" />
                                <span>+94 77 661 7979</span>
                            </li>

                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Opening Hours</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Clock size={18} className="text-brand-gold mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-white">Daily</p>
                                    <p className="text-sm text-gray-400">
                                        {settings && settings.opening_hours ? settings.opening_hours : 'Loading...'}
                                    </p>
                                </div>
                            </li>
                            {settings && settings.closed_days && settings.closed_days !== 'None' && (
                                <li className="text-sm text-red-300 font-medium mt-1">
                                    Closed on {settings.closed_days}
                                </li>
                            )}
                            {settings && settings.is_closed && (
                                <li className="text-sm text-red-500 font-bold mt-2 bg-red-900/20 p-2 rounded border border-red-900/50">
                                    Currently Closed
                                    {settings.reopening_date && (
                                        <span className="block text-xs font-normal text-gray-400 mt-1">
                                            Reopening: {new Date(settings.reopening_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </li>
                            )}
                            {!settings?.is_closed && (
                                <li className="text-sm text-brand-gold font-medium mt-2">
                                    Open for Service
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Brothers Hotel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
