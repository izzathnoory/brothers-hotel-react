import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const Gallery = () => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setImages(data)
            } catch (err) {
                console.error('Error fetching gallery:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchGallery()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-maroon dark:border-brand-gold"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-4 text-brand-maroon dark:text-brand-gold">Gallery</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Glimpses of our ambiance and culinary creations</p>

            {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                            <img
                                src={img.image_url}
                                alt="Gallery item"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No images in gallery yet.</p>
                </div>
            )}
        </div>
    )
}

export default Gallery
