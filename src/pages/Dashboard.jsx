import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import "./Dashboard.css";

import TransactionTable from "../components/transactionTable";

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("currentUser") ?? "null"
  );

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, []);


  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will permanently delete all your transactions."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/user/delete/${user._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.removeItem("userId");
      localStorage.removeItem("currentUser");

      alert("Account deleted successfully");

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Failed to delete account");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/transaction/get/${user._id}`
      );

      const data = await res.json();

      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch transactions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    ["userId", "currentUser"].forEach((key) =>
      localStorage.removeItem(key)
    );

    navigate("/", { replace: true });
  };

  const totalTransactions = transactions.length;

  const totalExpense = transactions.reduce(
    (sum, transaction) =>
      sum + Number(transaction.amount || 0),
    0
  );

  const totalCashback = transactions.reduce(
    (sum, transaction) =>
      sum + Number(transaction.cashback || 0),
    0
  );

  const netExpense = totalExpense - totalCashback;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Expense Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage your transactions
          </p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="welcome-card">
          <p className="welcome-text">
            Welcome Back
          </p>

          <h2 className="user-name">
            {user.name}
          </h2>
        </div>

        <div className="action-section">
          <button
            className="primary-btn"
            onClick={() =>
              navigate("/transaction")
            }
          >
            Add Transaction
          </button>

          <button
            className="secondary-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="delete-account-btn"
            onClick={handleDeleteUser}
          >
            Delete Account
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-title">
              Total Transactions
            </p>

            <h3 className="stat-value">
              {totalTransactions}
            </h3>
          </div>

          <div className="stat-card">
            <p className="stat-title">
              Total Expense
            </p>

            <h3 className="stat-value">
              ₹{totalExpense.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

          <div className="stat-card">
            <p className="stat-title">
              Total Cashback
            </p>

            <h3 className="stat-value">
              ₹{totalCashback.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

          <div className="stat-card">
            <p className="stat-title">
              Net Expense
            </p>

            <h3 className="stat-value">
              ₹{netExpense.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            Loading transactions...
          </div>
        ) : (
          <div className="table-wrapper">
            <TransactionTable
              transactions={transactions}
              setTransactions={setTransactions}
              fetchTransactions={fetchTransactions}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;