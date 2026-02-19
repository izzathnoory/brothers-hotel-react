import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ManageGallery = () => {
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setImages(data)
        } catch (error) {
            console.error('Error fetching images:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchImages()
    }, [])

    const handleUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('gallery-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery-images')
                .getPublicUrl(filePath)

            // Insert into database
            const { error: dbError } = await supabase
                .from('gallery')
                .insert([{ image_url: publicUrl }])

            if (dbError) throw dbError

            toast.success('Image uploaded successfully')
            fetchImages()
        } catch (error) {
            toast.error('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id, imageUrl) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        try {
            // Delete from DB
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id)

            if (error) throw error

            // Ideally delete from storage too, but parsing path is needed
            // For now, just DB delete
            toast.success('Image deleted')
            setImages(images.filter(img => img.id !== id))
        } catch (error) {
            toast.error('Error deleting image: ' + error.message)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Manage Gallery</h2>

            <div className="mb-8">
                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-neutral-800 border-2 border-dashed rounded-lg appearance-none cursor-pointer hover:border-brand-maroon focus:outline-none">
                    <span className="flex items-center space-x-2">
                        <Upload className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                            {uploading ? 'Uploading...' : 'Drop image to Upload or Click'}
                        </span>
                    </span>
                    <input type="file" name="file_upload" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
                </label>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="relative group">
                            <img src={img.image_url} alt="Gallery" className="w-full h-32 object-cover rounded-lg" />
                            <button
                                onClick={() => handleDelete(img.id, img.image_url)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ManageGallery
