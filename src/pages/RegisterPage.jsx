import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthHook';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {

  const { register, user, loading, error } = useAuth();
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null); 

  // redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null); 

    // Client-side validation: Check if passwords match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    // validation field check
    if (!name || !email || !password) {
        setLocalError("Please fill in all fields.");
        return;
    }

    // register from AuthContext
    await register(name, email, password);
  };

  return (
    <div className="flex justify-center items-center pt-20">
      
  
      <div className="card w-96 bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-1">Create Your Account</h2>
          <p className="text-gray-500 mb-6">Start your secure digital banking experience.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
      
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
    
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
    
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>


            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
    
            {(localError || error) && (
                <div className="alert alert-error text-sm mt-3">
                    {localError || error}
                </div>
            )}

            <div className="card-actions justify-end pt-2">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm pt-4">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}