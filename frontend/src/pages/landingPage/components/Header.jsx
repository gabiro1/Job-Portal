import React from 'react'
import { motion } from "framer-motion"
// Import the icon directly from Lucide ESM folder for Vite compatibility
import Briefcase from 'lucide-react/dist/esm/icons/briefcase.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const Header = () => {
   const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    return (
        <motion.header
            initial={{opacity:0, y:-20}}
            animate={{opacity:1, y:0}}
            transition={{ duration: 0.6}}
            className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 '
        >
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>
                    
                    {/* logo */}
                    <div className='flex items-center space-x-3'>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white"/>
                        </div>
                        <span className='text-xl font-bold text-gray-900'>JobPortal</span>
                    </div>

                    {/* navigation links */}
                    <nav className='hidden md:flex items-center space-x-8'>
                        <button 
                            className='text-gray-600 hover:text-gray-900 transition-colors font-medium' 
                            onClick={() => navigate("/find-jobs")}
                        >
                            Find Jobs
                        </button>
                        <button 
                            className='text-gray-600 hover:text-gray-900 transition-colors font-medium' 
                            onClick={() => navigate(
                                isAuthenticated && user?.role === "employer"
                                    ? "/employer-dashboard"
                                    : "/login"
                            )}
                        >
                            For Employers
                        </button>
                    </nav>

                    {/* auth buttons */}
                    <div className='flex items-center space-x-3'>
                        {isAuthenticated ? (
                            <div className='flex items-center space-x-3'>
                                <span className='text-gray-700'>Welcome, {user?.fullName}</span>
                                <button
                                    className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md'
                                    onClick={() => navigate(
                                        user?.role === "employer"
                                            ? "/employer-dashboard"
                                            : "/find-jobs"
                                    )}
                                >
                                    Dashboard
                                </button>
                            </div>
                        ) : (
                            <>
                                <button 
                                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-500"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                                <button 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                                    onClick={() => navigate("/signup")}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </motion.header>
    )
}

export default Header
