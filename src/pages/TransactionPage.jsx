import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuthHook';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransactionPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState('deposit'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Accounts on Load 
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user || !user.token) return navigate('/login');

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        
        // /api/accounts 
        const response = await axios.get(`${API_BASE_URL}/accounts`, config);
        setAccounts(response.data);
        
        // Pre-select the first account if available
        if (response.data.length > 0) {
          setSelectedAccountId(response.data[0]._id);
        }
      } catch (err) {
        console.error("Account Fetch Error:", err);
        setError('Failed to load accounts. Please try again.');
        if (err.response?.status === 401) logout();
      }
    };

    fetchAccounts();
  }, [user, navigate, logout]);


// Form Submission 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const endpoint = actionType === 'deposit' ? '/transactions/deposit' : '/transactions/withdraw';
    const transactionAmount = parseFloat(amount);
    
    if (transactionAmount <= 0 || isNaN(transactionAmount)) {
        setError("Please enter a valid amount greater than zero.");
        setLoading(false);
        return;
    }

    try {
      const selectedAccountObj = accounts.find(acc => acc._id === selectedAccountId);

      if (!selectedAccountObj) {
          throw new Error("Invalid Account Selected");
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        accountNumber: selectedAccountObj.accountNumber, 
        amount: transactionAmount,
      };

      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        payload,
        config
      );

      // Success message and reset form state
      setMessage(`${actionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful! New balance: $${response.data.newBalance.toFixed(2)}`);
      setAmount(''); 

      if (response.data.success) {
        navigate('/dashboard');
      }

      
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Transaction failed: ${actionType}.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (accounts.length === 0 && !loading) {
      return <div className="text-center mt-10">
                <p>You need to create an account first.</p>
                <button onClick={() => navigate('/account/new')} className="btn btn-primary mt-4">Create New Account</button>
             </div>;
  }


  const currentAccount = accounts.find(acc => acc._id === selectedAccountId);

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">
            {actionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </h2>
          <p className="text-gray-500 mb-6">Process a transaction on your selected account.</p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Action Type Tabs/Buttons */}
            <div className="tabs tabs-boxed w-full">
              <a 
                onClick={() => setActionType('deposit')} 
                className={`tab tab-lg flex-1 ${actionType === 'deposit' ? 'tab-active btn-primary' : ''}`}
              >
                Deposit
              </a>
              <a 
                onClick={() => setActionType('withdraw')} 
                className={`tab tab-lg flex-1 ${actionType === 'withdraw' ? 'tab-active btn-primary' : ''}`}
              >
                Withdraw
              </a>
            </div>

            {/* Account Selector */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Select Account</span>
                {currentAccount && <span className="label-text-alt">Current Balance: ${currentAccount.balance.toFixed(2)}</span>}
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                required
              >
                {accounts.map((acc) => (
                  // TODO : if account is inactive make that option disable 
                  <option key={acc._id} value={acc._id} disabled={!acc.isActive}>
                    <div className='flex justify-between'>

                    <div>{acc.accountType} (Acct: {acc.accountNumber})</div>
                    {acc.isActive ? (
                      <div class="bg-green-500">Active</div>
                    ) : (
                      <div class="badge badge-outline badge-warning">InActive</div>
                    )}
                    </div>
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Amount to {actionType}</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 500.00"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
              />
            </div>
            
            {/* Messages */}
            {message && <div className="alert alert-success">{message}</div>}
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
                    `${actionType === 'deposit' ? 'Process Deposit' : 'Process Withdrawal'}`
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}