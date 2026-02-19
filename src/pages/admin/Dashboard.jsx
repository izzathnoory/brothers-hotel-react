const Dashboard = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Welcome, Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Menu Items</h3>
                    <p className="text-3xl font-bold text-brand-maroon dark:text-brand-gold">Manage</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Gallery Images</h3>
                    <p className="text-3xl font-bold text-brand-maroon dark:text-brand-gold">Update</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Reviews</h3>
                    <p className="text-3xl font-bold text-brand-maroon dark:text-brand-gold">View</p>
                </div>
            </div>
            <p className="mt-8 text-gray-600 dark:text-gray-400">Select an option from the sidebar to get started.</p>
        </div>
    )
}
export default Dashboard
