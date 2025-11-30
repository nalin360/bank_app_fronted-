import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthHook';
import LoginPage from './LoginPage'; 

export default function AdminLoginPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if the user is logged in AND is an Admin
    useEffect(() => {
        if (user && user.isAdmin) {
            navigate('/admin/dashboard');
        } else if (user && !user.isAdmin) {
            // Logged in but not an admin - redirect non-admin users away
            navigate('/dashboard'); 
        }
    }, [user, navigate]);

    // Render the standard login form
    return (
        <LoginPage isAdminRoute={true} />
    );
}