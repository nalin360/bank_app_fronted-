import { createContext, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    // Initialize state by trying to retrieve user from localStorage
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Utility function to save user data and token
    const saveUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };



    /**
     * Registers a new user 
     */
    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/users', { name, email, password });
            saveUser(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Authenticates user and retrieves a token.
     */
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/users/login', { email, password });
            saveUser(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Context value to be provided to consuming components
    const contextValue = {
        user,
        loading,
        error,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

