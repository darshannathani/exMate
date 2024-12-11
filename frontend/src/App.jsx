import PropTypes from 'prop-types';
import { Suspense} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { adminRoutes } from './routes/adminRoutes';
import { candidateRoutes } from './routes/candidateRoutes';
import { publicRoutes } from './routes/publicRoutes';

const Layout = ({ children }) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
};
Layout.propTypes = {
    children: PropTypes.node
};
const ProtectedRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, userRole } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    return element;
};
ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
    requiredRole: PropTypes.oneOf(['ROLE_ADMIN', 'ROLE_CANDIDATE'])
};
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                {publicRoutes.map(route => (
                                    <Route 
                                        key={route.path} 
                                        path={route.path} 
                                        element={route.element} 
                                    />
                                ))}
                                {adminRoutes.map(route => (
                                    <Route 
                                        key={route.path} 
                                        path={route.path} 
                                        element={
                                            <ProtectedRoute 
                                                element={route.element} 
                                                requiredRole="ROLE_ADMIN" 
                                            />
                                        } 
                                    />
                                ))}
                                {candidateRoutes.map(route => (
                                    <Route 
                                        key={route.path} 
                                        path={route.path} 
                                        element={
                                            <ProtectedRoute 
                                                element={route.element} 
                                                requiredRole="ROLE_CANDIDATE" 
                                            />
                                        } 
                                    />
                                ))}
                                <Route path="*" element={<div>404 - Page Not Found</div>} />
                            </Routes>
                        </Suspense>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;