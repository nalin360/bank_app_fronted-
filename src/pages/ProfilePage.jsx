// client/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuthHook';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfilePage() {
  const { user, login } = useAuth(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load current user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Basic Validation
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };


      const payload = { name, email };
      if (password) {
        payload.password = password;
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        payload,
        config
      );

      setMessage('Profile updated successfully.');
      
      // Update local storage/context with new name/email if they changed
      const updatedUserData = { ...user, name: response.data.name, email: response.data.email };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">User Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
      
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
      
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="divider text-sm text-gray-400">Change Password (Optional)</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

     =
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            {/* Messages */}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="card-actions justify-end mt-4">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}