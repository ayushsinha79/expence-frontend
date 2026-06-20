import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./Dashboard.css";
import { FiCalendar } from "react-icons/fi"

import TransactionTable from "../components/transactionTable";

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

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

  const sources = [
    ...new Set(
      transactions.map(
        (transaction) =>
          transaction.source
      )
    ),
  ];

  const filteredTransactions =
    transactions
      .filter((transaction) => {
        const transactionDate =
          new Date(transaction.date);

        const matchesSource =
          sourceFilter === "all" ||
          transaction.source ===
          sourceFilter;

        const matchesFromDate =
          !fromDate ||
          transactionDate >=
          new Date(fromDate);

        const matchesToDate =
          !toDate ||
          transactionDate <=
          new Date(
            `${toDate}T23:59:59`
          );

        return (
          matchesSource &&
          matchesFromDate &&
          matchesToDate
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return sortOrder === "desc"
          ? dateB - dateA
          : dateA - dateB;
      });

  const groupedTransactions =
    filteredTransactions.reduce(
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
          <>
            <div className="filter-bar">
              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(e.target.value)
                }
              >
                <option value="all">
                  Filter by Source
                </option>

                {sources.map((source) => (
                  <option
                    key={source}
                    value={source}
                  >
                    {source}
                  </option>
                ))}
              </select>

              <div className="date-input-wrapper">
                <input
                  ref={fromDateRef}
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  onClick={() =>
                    fromDateRef.current?.showPicker()
                  }
                />

                <FiCalendar className="date-icon" />
              </div>

              <div className="date-input-wrapper">
                <input
                  ref={toDateRef}
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  onClick={() =>
                    toDateRef.current?.showPicker()
                  }
                />

                <FiCalendar className="date-icon" />
              </div>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value)
                }
              >
                <option value="desc">
                  Newest First
                </option>

                <option value="asc">
                  Oldest First
                </option>
              </select>

              <button
                className="clear-filter-btn"
                onClick={() => {
                  setSourceFilter("all");
                  setFromDate("");
                  setToDate("");
                  setSortOrder("desc");
                }}
              >
                Clear Filters
              </button>
            </div>
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
          </>
        )}
      </div>

    </div>
  );
}

export default Dashboard;