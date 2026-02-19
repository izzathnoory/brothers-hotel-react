import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingButtons from '../components/FloatingButtons'
import { Toaster } from 'react-hot-toast'

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <FloatingButtons />
            <Toaster position="bottom-right" />
        </div>
    )
}

export default Layout
