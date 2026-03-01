import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useMenu } from '../hooks/useMenu'
import heroImage from '../assets/images/home-hero.jpg'

const Home = () => {
    const { settings } = useSettings()
    const { menuItems } = useMenu()

    // Filter today's specials
    const todaySpecials = menuItems.filter(item => item.isTodaySpecial && item.is_available)
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center bg-neutral-900 text-white overflow-hidden">
                <img src={heroImage} alt="Brothers Hotel - Authentic Sri Lankan Cuisine" className="absolute inset-0 w-full h-full object-cover opacity-40" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-brand-gold drop-shadow-lg tracking-tight">
                        BROTHERS HOTEL
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 font-light text-gray-100 max-w-2xl mx-auto">
                        Serving Authentic Sri Lankan Flavours from <span className="text-brand-gold font-medium">Sunrise to Sunset</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/menu"
                            className="px-8 py-3 bg-brand-maroon text-white font-bold rounded-full hover:bg-red-800 transition-transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            View Menu <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/about"
                            className="px-8 py-3 bg-white text-brand-maroon font-bold rounded-full hover:bg-gray-100 transition-transform hover:scale-105"
                        >
                            Find Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Today's Special Section */}
            {todaySpecials.length > 0 && (
                <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white dark:from-neutral-800 dark:to-neutral-900">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Star className="text-amber-500" size={28} fill="currentColor" />
                                <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon dark:text-brand-gold">Today's Special</h2>
                                <Star className="text-amber-500" size={28} fill="currentColor" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Don't miss out on our handpicked specials for today!</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {todaySpecials.map(item => (
                                <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border-2 border-amber-200 dark:border-amber-700">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                                                <Star size={12} fill="currentColor" /> Special
                                            </span>
                                        </div>
                                        {item.offer_text && (
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-brand-gold text-brand-maroon px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md">
                                                    {item.offer_text}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                            <div className="text-right">
                                                {item.offer_price && item.offer_price < item.price ? (
                                                    <>
                                                        <span className="text-sm text-gray-500 line-through mr-1">Rs. {item.price}</span>
                                                        <span className="text-lg font-bold text-brand-maroon dark:text-brand-gold">Rs. {item.offer_price}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-brand-maroon dark:text-brand-gold">Rs. {item.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        {item.description && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                to="/menu"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-maroon text-white font-bold rounded-full hover:bg-red-800 transition-transform hover:scale-105"
                            >
                                View Full Menu <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className="py-20 px-4 bg-brand-maroon text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-gold">Our Story</h2>
                    <p className="text-lg leading-relaxed mb-8 text-gray-100">
                        Established in 2013 by <span className="font-semibold text-brand-gold">S.I.M Firthous</span>, Brothers Hotel has been a culinary landmark in Kalmunai.
                        We take pride in serving authentic Sri Lankan dishes prepared with traditional recipes and the freshest ingredients.
                        Whether you are looking for a hearty breakfast or a satisfying lunch, we are here to serve you with warm hospitality.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
                        <div className="p-6 bg-red-900/50 rounded-xl backdrop-blur-sm relative overflow-hidden">
                            <Clock className="w-10 h-10 mx-auto text-brand-gold mb-4" />
                            <h3 className="text-xl font-bold mb-2">
                                {settings?.is_closed ? 'Temporarily Closed' : 'Open Daily'}
                            </h3>
                            <p className="text-gray-300">
                                {settings?.opening_hours || 'Loading...'}
                            </p>
                            {settings?.closed_days && settings.closed_days !== 'None' && (
                                <p className="text-red-300 text-sm font-bold mt-1">
                                    Closed on {settings.closed_days}
                                </p>
                            )}
                            {settings?.is_closed && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center p-2">
                                        <span className="text-brand-gold font-bold">CLOSED</span>
                                        {settings.reopening_date && (
                                            <p className="text-xs text-white">Back on {new Date(settings.reopening_date).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-red-900/50 rounded-xl backdrop-blur-sm">
                            <MapPin className="w-10 h-10 mx-auto text-brand-gold mb-4" />
                            <h3 className="text-xl font-bold mb-2">Location</h3>
                            <p className="text-gray-300">1 Police Station Rd, Kalmunai</p>
                        </div>
                        <div className="p-6 bg-red-900/50 rounded-xl backdrop-blur-sm">
                            <div className="w-10 h-10 mx-auto text-brand-gold mb-4 flex items-center justify-center text-2xl font-bold">10+</div>
                            <h3 className="text-xl font-bold mb-2">Years of Service</h3>
                            <p className="text-gray-300">Since 2013</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] w-full relative bg-gray-200">
                <iframe
                    title="Brothers Hotel Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.187313627045!2d81.8159!3d7.4184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae53f7bd4593457%3A0x6280456108169999!2sBrothers%20Hotel!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>
        </div>
    )
}

export default Home
