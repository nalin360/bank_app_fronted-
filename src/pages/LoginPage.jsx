import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthHook'; // Import the custom hook
import { useNavigate, Link } from 'react-router-dom';
import { validate, VALIDATOR_EMAIL } from '../utils/validators';

export default function LoginPage() {
  // Destructure state and actions from the Auth Context
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();

  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validatorError , setvalidatorError] = useState('')
 


  // Effect to redirect if the user is already logged in
  useEffect(() => {

    // validating email
    const isValidEmail = validate(email,[
      VALIDATOR_EMAIL()
    ]) 

    if (!isValidEmail) {
      setvalidatorError('Email is not valid')
    }else{
      setvalidatorError('')
    }

    if (user) {
      // Redirect to the dashboard if authentication is successful
      navigate('/dashboard');
    }
  }, [user, navigate,email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      // Call the login function from AuthContext
      await login(email, password);
    }
  };

  const changeHandler = (e) => {
    setEmail(e.target.value)
  };
  return (
    <div className="flex justify-center items-center pt-20">
      
      {/* DaisyUI Card Component */}
      <div className="card w-96 bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-1">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Sign in to access your secure bank accounts.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={changeHandler}
                required
              />
            </div>
            {validatorError && <div className="alert alert-error text-sm mt-3">{validatorError}</div>}
            
            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) =>setPassword(e.target.value) }
                required
              />
            </div>
            
            {/* Global Error Display */}
            {error && <div className="alert alert-error text-sm mt-3">{error}</div>}

            <div className="card-actions justify-end pt-2">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm pt-4">
            Don't have an account?{' '}
            <Link to="/register" className="link link-primary font-semibold">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}