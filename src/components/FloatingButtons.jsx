import { Phone, MessageCircle } from 'lucide-react'

const FloatingButtons = () => {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
            {/* WhatsApp Button */}
            <a
                href="https://wa.me/94776617979"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 flex items-center justify-center"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={24} />
            </a>

            {/* Phone Button */}
            <a
                href="tel:+94776617979"
                className="bg-brand-gold text-brand-maroon p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-transform hover:scale-110 flex items-center justify-center"
                aria-label="Call Now"
            >
                <Phone size={24} />
            </a>
        </div>
    )
}

export default FloatingButtons
