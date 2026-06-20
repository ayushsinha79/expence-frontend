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
  const [titleFilter, setTitleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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

  const totalTransactions =
    transactions.length;

  const totalCashback =
    transactions.reduce(
      (sum, transaction) =>
        sum +
        Number(
          transaction.cashback || 0
        ),
      0
    );

  const totalDebit =
    transactions
      .filter(
        (transaction) =>
          transaction.transactionType ===
          "DEBIT"
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.amount || 0
          ),
        0
      );

  const totalCredit =
    transactions
      .filter(
        (transaction) =>
          transaction.transactionType ===
          "CREDIT"
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.amount || 0
          ),
        0
      );

  const netBalance =
    totalCredit -
    totalDebit +
    totalCashback;

  const sources = [
    ...new Set(
      transactions.map(
        (transaction) =>
          transaction.source
      )
    ),
  ];

  const titles = [
    ...new Set(
      transactions.map(
        (transaction) =>
          transaction.title
      )
    ),
  ];

  const filteredTransactions =
    transactions
      .filter((transaction) => {
        const transactionDate =
          new Date(
            transaction.date
          );

        const matchesSource =
          sourceFilter === "all" ||
          transaction.source ===
          sourceFilter;

        const matchesTitle =
          titleFilter === "all" ||
          transaction.title ===
          titleFilter;

        const matchesType =
          typeFilter === "all" ||
          transaction.transactionType ===
          typeFilter;

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
          matchesTitle &&
          matchesFromDate &&
          matchesToDate &&
          matchesType
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.date
        );

        const dateB = new Date(
          b.date
        );

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
            Net Balance
          </p>

          <h1 className="hero-amount">
            ₹
            {netBalance.toLocaleString(
              "en-IN"
            )}
          </h1>
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
              Total Debit
            </p>

            <h3 className="stat-value">
              ₹
              {totalDebit.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

          <div className="stat-card">
            <p className="stat-title">
              Total Credit
            </p>

            <h3 className="stat-value">
              ₹
              {totalCredit.toLocaleString(
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
                <label className="filter-label">
                  From Date
                </label>
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
                <label className="filter-label">
                  To Date
                </label>
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

              <select
                value={titleFilter}
                onChange={(e) =>
                  setTitleFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  Filter by Title
                </option>

                {titles.map((title) => (
                  <option
                    key={title}
                    value={title}
                  >
                    {title}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Types
                </option>

                <option value="DEBIT">
                  Debit
                </option>

                <option value="CREDIT">
                  Credit
                </option>
              </select>

              <button
                className="clear-filter-btn"
                onClick={() => {
                  setSourceFilter("all");
                  setFromDate("");
                  setToDate("");
                  setSortOrder("desc");
                  setTitleFilter("all");
                  setTypeFilter("all");
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
                  const userDebit =
                    userTransactions
                      .filter(
                        (transaction) =>
                          transaction.transactionType ===
                          "DEBIT"
                      )
                      .reduce(
                        (sum, transaction) =>
                          sum +
                          Number(
                            transaction.amount || 0
                          ),
                        0
                      );

                  const userCredit =
                    userTransactions
                      .filter(
                        (transaction) =>
                          transaction.transactionType ===
                          "CREDIT"
                      )
                      .reduce(
                        (sum, transaction) =>
                          sum +
                          Number(
                            transaction.amount || 0
                          ),
                        0
                      );

                  const userCashback =
                    userTransactions.reduce(
                      (sum, transaction) =>
                        sum +
                        Number(
                          transaction.cashback || 0
                        ),
                      0
                    );

                  const userNetBalance =
                    userCredit -
                    userDebit +
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
                                Debit: ₹
                                {userDebit.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              <span>
                                Credit: ₹
                                {userCredit.toLocaleString(
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
                                Balance: ₹
                                {userNetBalance.toLocaleString(
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