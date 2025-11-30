// client/src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuthHook";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user || !user.token) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.get(
          `${API_BASE_URL}/transactions/summary`,
          config
        );
        setSummaryData(response.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to fetch dashboard data.");
        // If 401 Unauthorized, automatically log out
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, logout]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-lg mx-auto mt-10">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! {error}</span>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return <div className="text-center mt-10">No data found.</div>;
  }

  const totalBalance = summaryData.accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user.name.split(" ")[0]}!
      </h1>

      {/* Account Summary Section */}
      <div className="stats shadow bg-primary text-primary-content mb-8 w-full">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-primary-content opacity-70">
            Total Balance
          </div>
          <div className="stat-value">${totalBalance.toFixed(2)}</div>
          <div className="stat-desc text-primary-content opacity-70">
            {summaryData.accounts.length} Accounts
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details Cards (Column 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaryData.accounts.map((account) => (
              <div
                key={account._id}
                className="card bg-base-100 shadow-xl border border-base-200"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{account.accountType}</h3>
                  <p className="text-sm text-gray-500">
                    Acct No: {account.accountNumber}
                  </p>
                  <div className="divider my-1"></div>
                  <p className="text-2xl font-bold text-success">
                    ${account.balance.toFixed(2)}
                  </p>
                  <div className="card-actions justify-end">
                    {/* Placeholders for quick actions */}
                    {account.isActive ? (
                      <div class="badge badge-success">Active</div>
                    ) : (
                      <div class="badge badge-warning">InActive</div>
                    )}
                    {/* <button className="btn btn-xs btn-outline">Details</button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions (Column 3) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <ul className="menu bg-base-100 w-full rounded-box shadow-xl border border-base-200 p-2">
            {summaryData.transactions.length > 0 ? (
              summaryData.transactions.map((t, index) => (
                <li
                  key={index}
                  className="border-b border-base-200 last:border-b-0"
                >
                  <div className="flex justify-between items-center px-4 py-2">
                    <div>
                      <p className="font-semibold">{t.description}</p>
                      <p className="text-xs text-gray-500">
                        {t.accountId.accountType} ({t.accountId.accountNumber})
                      </p>
                    </div>
                    <span
                      className={`badge badge-lg font-bold ${
                        t.type === "deposit" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {t.type === "deposit" ? "+" : "-"}${t.amount.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No recent transactions found.
              </li>
            )}
          </ul>

          <div className="mt-8 text-center">
            <button onClick={logout} className="btn btn-warning btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
