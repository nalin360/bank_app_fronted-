import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuthHook';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateAccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('Savings');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    if (!user) {
        navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!user || !user.token) {
        setError('Authentication required to create an account.');
        logout(); 
        return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/accounts`,
        { accountType },
        config
      );

      setSuccess(`Success! New ${response.data.accountType} account (${response.data.accountNumber}) created.`);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 3000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Account creation failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">Open New Account</h2>
          <p className="text-gray-500 mb-6">Choose the type of bank account you want to open.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
        
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Select Account Type</span>
              </label>
              
              <div className="flex space-x-4">
                <label className="label cursor-pointer p-0">
                  <span className="label-text mr-2">Savings</span>
                  <input
                    type="radio"
                    name="accountType"
                    value="Savings"
                    checked={accountType === 'Savings'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="radio radio-primary"
                  />
                </label>
                
                <label className="label cursor-pointer p-0">
                  <span className="label-text mr-2">Checking</span>
                  <input
                    type="radio"
                    name="accountType"
                    value="Checking"
                    checked={accountType === 'Checking'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="radio radio-primary"
                  />
                </label>
              </div>
            </div>


            <div className="alert alert-info shadow-lg p-3">
                   <span>Initial balance will be $0.00.</span>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    'Create Account'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}