import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const Home = () => {
    const { settings } = useSettings()
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center bg-neutral-900 text-white overflow-hidden">
                {/* Background Image Placeholder - In real app, use an actual image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40"></div>

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
