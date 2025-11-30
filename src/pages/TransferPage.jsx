import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";
import {
  validate,
  VALIDATOR_MIN,
  VALIDATOR_REQUIRE,
} from "../utils/validators";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransferPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Accounts on Load
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user || !user.token) return navigate("/login");

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const response = await axios.get(`${API_BASE_URL}/accounts`, config);
        const fetchedAccounts = response.data;
        setAccounts(fetchedAccounts);
        console.log(fetchedAccounts);

        if (fetchedAccounts.length > 0) {
          const source = fetchedAccounts[0];
          setSourceAccountId(source._id);

          const dest = fetchedAccounts.find((acc) => acc._id !== source._id);
          setDestinationAccountId(dest ? dest._id : "");
        }
      } catch (err) {
        setError("Failed to load accounts. Please try again.");
        if (err.response?.status === 401) logout();
      }
    };

    fetchAccounts();
  }, [user, navigate, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const isAmountValid = validate(amount.toString(), [
      VALIDATOR_REQUIRE(),
      VALIDATOR_MIN(0.01),
    ]);

    if (!isAmountValid) {
      setError("Please enter a valid amount greater than zero.");
      setLoading(false);
      return;
    }

    // Validate Accounts Logic
    console.log(sourceAccountId); // 6925db22ee406001f84ee399
    console.log(destinationAccountId); // 6925db22ee406001f84ee399
    if (sourceAccountId === destinationAccountId) {
      setError("Source and destination accounts must be different.");
      setLoading(false);
      return;
    }

    // Validation
    const transferAmount = parseFloat(amount);
    const sourceAccount = accounts.find((acc) => acc._id === sourceAccountId);

    if (sourceAccount && sourceAccount.balance < transferAmount) {
      setError(
        "Insufficient funds. Transfer amount exceeds source account balance."
      );
      setLoading(false);
      return;
    }

    const sourceAccountObj = accounts.find(
      (acc) => acc._id === sourceAccountId
    );
    const destinationAccountObj = accounts.find(
      (acc) => acc._id === destinationAccountId
    );

    if (!sourceAccountObj || !destinationAccountObj) {
      throw new Error("Invalid source or destination account selected.");
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        fromAccountNumber: sourceAccountObj.accountNumber,
        toAccountNumber: destinationAccountObj.accountNumber,
        amount: transferAmount,
      };

      // POST /api/transactions/transfer
      const response = await axios.post(
        `${API_BASE_URL}/transactions/transfer`,
        payload,
        config
      );

      setMessage(`Transfer successful! $${transferAmount.toFixed(2)} moved.`);
      setAmount("");
      console.log(response.data);

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "Transfer failed.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (accounts.length < 2 && !loading) {
    return (
      <div className="text-center mt-10">
        <p className="mb-4">
          You need at least two accounts to make a transfer.
        </p>
        <button
          onClick={() => navigate("/account/new")}
          className="btn btn-primary"
        >
          Create New Account
        </button>
      </div>
    );
  }

  const currentSourceAccount = accounts.find(
    (acc) => acc._id === sourceAccountId
  );

  // destination list doesn't show the currently selected source
  const destinationOptions = accounts.filter(
    (acc) => acc._id !== sourceAccountId
  );

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">Fund Transfer</h2>
          <p className="text-gray-500 mb-6">
            Move money between your own accounts securely.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source Account Selector */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Source Account (Debit)
                </span>
                {currentSourceAccount && (
                  <span className="label-text-alt text-error font-bold">
                    Balance: ${currentSourceAccount.balance.toFixed(2)}
                  </span>
                )}
              </label>

              <select
                // TODO : if account is inactive make that option disable

                className="select select-bordered w-full"
                value={sourceAccountId}
                onChange={(e) => {
                  const newSource = e.target.value;
                  setSourceAccountId(newSource);

                  // Auto-select a different destination account
                  const other = accounts.find((acc) => acc._id !== newSource);
                  setDestinationAccountId(other ? other._id : "");
                }}
                required
              >
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id} disabled={!acc.isActive}>
                    {acc.accountType} ({acc.accountNumber})
                     {acc.isActive ? (
                      <div class="bg-green-500">Active</div>
                    ) : (
                      <div class="badge badge-outline badge-warning">InActive</div>
                    )}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Account Selector */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Destination Account (Credit)
                </span>
              </label>

              <select
                className="select select-bordered w-full"
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
                required
                disabled={destinationOptions.length === 0}
              >
                {destinationOptions.map((acc) => (
                  <option key={acc._id} value={acc._id} disabled={!acc.isActive}>
                    {acc.accountType} ({acc.accountNumber})
                     {acc.isActive ? (
                      <div class="bg-green-500">Active</div>
                    ) : (
                      <div class="badge badge-outline badge-warning">InActive</div>
                    )}
                    
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Transfer Amount
                </span>
              </label>
              <input
                type="number"
                placeholder="e.g., 100.00"
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
                className={`btn btn-warning w-full ${
                  loading ? "btn-disabled" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  "Confirm Transfer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
