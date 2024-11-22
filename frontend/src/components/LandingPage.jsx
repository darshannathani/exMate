import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-hidden`}>
            <div className="max-w-7xl mx-auto">
                <div className={`relative z-10 pb-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}>
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Welcome to </span>
                                <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} block xl:inline`}>ExMate</span>
                            </h1>
                            <p className={`mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                Your comprehensive examination management system. Streamline your exam processes and manage candidates efficiently.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link
                                        to="/login"
                                        className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} md:py-4 md:text-lg md:px-10`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link
                                        to="/dashboard"
                                        className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${isDarkMode ? 'text-blue-400 bg-gray-700 hover:bg-gray-600' : 'text-blue-700 bg-blue-100 hover:bg-blue-200'} md:py-4 md:text-lg md:px-10`}
                                    >
                                        View Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
