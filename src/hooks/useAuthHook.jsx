// client/src/hooks/useAuthHook.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the context object

/**
 * Custom hook to consume the AuthContext.
 * Use this hook in any component that needs user info or auth actions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};