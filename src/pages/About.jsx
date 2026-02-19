import { MapPin, Clock, Award } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const About = () => {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Hero Section */}
            <div className="bg-brand-maroon text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-gold">{t('aboutTitle')}</h1>
                    <p className="text-xl text-gray-200">{t('aboutSubtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Brothers Hotel Interior"
                            className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-brand-maroon dark:text-brand-gold">{t('ourStory')}</h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            <p>
                                Brothers Hotel, established in 2013 by <strong>S.I.M Firthous</strong>, has grown to become a beloved culinary landmark in Kalmunai.
                                Our journey began with a simple vision: to serve authentic, high-quality Sri Lankan food that tastes just like home.
                            </p>
                            <p>
                                Over the years, we have mastered the art of combining traditional spices and fresh local ingredients to create dishes that delight the senses.
                                From our early morning breakfast specialties to our late-night dinner options, every meal is prepared with care and passion.
                            </p>
                            <p>
                                We believe in warm hospitality and creating an atmosphere where families and friends can come together to enjoy great food and conversation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats / Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg text-center hover:-translate-y-1 transition-transform">
                        <Award className="w-12 h-12 mx-auto text-brand-maroon dark:text-brand-gold mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Excellence</h3>
                        <p className="text-gray-600 dark:text-gray-400">Serving quality food for over a decade</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg text-center hover:-translate-y-1 transition-transform">
                        <Clock className="w-12 h-12 mx-auto text-brand-maroon dark:text-brand-gold mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('openDaily')}</h3>
                        <p className="text-gray-600 dark:text-gray-400">05:00 AM – 04:00 PM</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg text-center hover:-translate-y-1 transition-transform">
                        <MapPin className="w-12 h-12 mx-auto text-brand-maroon dark:text-brand-gold mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('location')}</h3>
                        <p className="text-gray-600 dark:text-gray-400">1 Police Station Rd, Kalmunai</p>
                    </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] w-full bg-gray-200">
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
                </div>
            </div>
        </div>
    )
}

export default About
