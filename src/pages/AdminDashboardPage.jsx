// client/src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Redirect non-admins
  useEffect(() => {
    if (!user || !user.isAdmin) {
      // If logged in as non-admin, go to dashboard. If not logged in, go to login.
      navigate(user ? "/dashboard" : "/login");
    }
  }, [user, navigate]);

  const fetchAllAccounts = async () => {
    if (!user || !user.token) return;

    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      // FIX: Update the endpoint URL to /api/accounts/all
      const response = await axios.get(`${API_BASE_URL}/accounts/all`, config);
      setAccounts(response.data);
    } catch (err) {
      setError(
        'Failed to load accounts. Ensure the "Get All Accounts" endpoint exists.'
      );
      if (err.response?.status === 401 || err.response?.status === 403)
        logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchAllAccounts();
    }
  }, [user]); // Run once on admin login

  const handleToggleStatus = async (accountId, currentStatus) => {
    setMessage(null);
    setError(null);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const newStatus = !currentStatus;

      const response = await axios.put(
        `${API_BASE_URL}/accounts/status/${accountId}`,
        { isActive: newStatus },
        config
      );

      // Update the local state with the new status
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc._id === accountId ? { ...acc, isActive: newStatus } : acc
        )
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to toggle account status."
      );
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error) return <div className="alert alert-error mt-10">{error}</div>;
  if (!user || !user.isAdmin) return null; // Should be handled by useEffect redirect

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🏦 Admin Account Management</h1>
      <p className="mb-4 text-gray-600">Total Accounts: {accounts.length}</p>

      {message && <div className="alert alert-success mb-4">{message}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200">
              <th>Account #</th>    
              <th>User Name</th> {/* Changed from User ID */}
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc._id} className="bg-base-100 shadow-md">
                <td className="font-mono">{acc.accountNumber}</td>
                {/* FIX: Acce   ss a specific string property (e.g., name or email) */}
                <td className="text-sm">
                  {acc.userId.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    ({acc.userId.email})
                  </span>
                </td>
                <td>{acc.accountType}</td>
                <td>${acc.balance.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      acc.isActive ? "badge-success" : "badge-error"
                    }`}
                  >
                    {acc.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      acc.isActive ? "btn-error" : "btn-success"
                    }`}
                    onClick={() => handleToggleStatus(acc._id, acc.isActive)}
                  >
                    {acc.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
