import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthHook';
/**
 * Component to protect routes that require authentication.
 * If the user is logged in, it renders the child routes via <Outlet />.
 * If not logged in, it redirects to the /login page.
 * @param {object} props
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth(); 

 
  // loading spinner 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
 
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  
  // Handle Authentication : If the user object exists, allow access
  if (user) {
    return <Outlet />;
  }


  // If no user object, redirect to the login page
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;