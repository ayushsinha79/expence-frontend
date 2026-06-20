import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./Dashboard.css";

import TransactionTable from "../components/transactionTable";

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user] = useState(() =>
    JSON.parse(
      localStorage.getItem("currentUser") ??
        "null"
    )
  );

  useEffect(() => {
    if (user?._id) {
      fetchTransactions();
    }
  }, [user?._id]);

  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will permanently delete all your transactions."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/delete/${user._id}`,
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
        `${API_BASE_URL}/transaction/get/${user._id}`
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
    localStorage.clear();
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

  const netExpense =
    totalExpense - totalCashback;

  const groupedTransactions =
    transactions.reduce(
      (groups, transaction) => {
        const userName =
          transaction.belongsTo?.name ||
          "Unknown";

        if (!groups[userName]) {
          groups[userName] = [];
        }

        groups[userName].push(
          transaction
        );

        return groups;
      },
      {}
    );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Bryant Tracker
          </h1>

          <p className="dashboard-subtitle">
            Track spending and cashback
          </p>
        </div>

        <div className="profile-pill">
          {user.name}
        </div>
      </div>

      <div className="dashboard-card">

        <div className="hero-card">
          <p className="hero-label">
            Net Expense
          </p>

          <h1 className="hero-amount">
            ₹
            {netExpense.toLocaleString(
              "en-IN"
            )}
          </h1>

          <div className="hero-details">
            <span>
              Expense ₹
              {totalExpense.toLocaleString(
                "en-IN"
              )}
            </span>

            <span>
              Cashback ₹
              {totalCashback.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
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
              ₹
              {totalExpense.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

          <div className="stat-card">
            <p className="stat-title">
              Total Cashback
            </p>

            <h3 className="stat-value">
              ₹
              {totalCashback.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

          <div className="stat-card">
            <p className="stat-title">
              Net Expense
            </p>

            <h3 className="stat-value">
              ₹
              {netExpense.toLocaleString(
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
            {Object.entries(
              groupedTransactions
            ).map(
              ([
                userName,
                userTransactions,
              ]) => {
                const userExpense =
                  userTransactions.reduce(
                    (
                      sum,
                      transaction
                    ) =>
                      sum +
                      Number(
                        transaction.amount ||
                        0
                      ),
                    0
                  );

                const userCashback =
                  userTransactions.reduce(
                    (
                      sum,
                      transaction
                    ) =>
                      sum +
                      Number(
                        transaction.cashback ||
                        0
                      ),
                    0
                  );

                const userNetExpense =
                  userExpense -
                  userCashback;

                return (
                  <div
                    key={userName}
                    className="user-section"
                  >
                    {(user?.username || "")
                      .toLowerCase() === "ayush" && (
                        <div className="user-section-header">
                          <h2>
                            {userName}
                          </h2>

                          <div className="user-summary">
                            <span>
                              Expense: ₹
                              {userExpense.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span>
                              Cashback: ₹
                              {userCashback.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span>
                              Net: ₹
                              {userNetExpense.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                    <TransactionTable
                      transactions={userTransactions}
                      fetchTransactions={fetchTransactions}
                    />
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;