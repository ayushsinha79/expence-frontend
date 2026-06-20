import { useEffect, useState } from "react";
import { FiCopy, FiEye, FiX } from "react-icons/fi";
import API_BASE_URL from "../config";
import "./transactionTable.css";

function TransactionTable({
  transactions,
  fetchTransactions,
}) {
  const [rows, setRows] = useState([]);
  const [selectedDescription, setSelectedDescription] =
    useState(null);

  useEffect(() => {
    setRows(transactions || []);
  }, [transactions]);

  const handleChange = (
    index,
    field,
    value
  ) => {
    const updatedRows = [...rows];

    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    };

    setRows(updatedRows);
  };

  const updateTransaction = async (
    transaction
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/update/${transaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: transaction.title,
            source: transaction.source,
            amount: Number(
              transaction.amount
            ),
            cashback: Number(
              transaction.cashback
            ),
            description:
              transaction.description,
          }),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await fetchTransactions();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to update transaction"
      );
    }
  };

  const deleteTransaction = async (
    transactionId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this transaction?"
      );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/delete/${transactionId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await fetchTransactions();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to delete transaction"
      );
    }
  };

  const copyTransactionId = async (
    id
  ) => {
    try {
      await navigator.clipboard.writeText(
        id
      );
    } catch (error) {
      console.error(error);
      alert("Failed to copy ID");
    }
  };

  if (!rows.length) {
    return (
      <div className="empty-state">
        <h3>
          No Transactions Found
        </h3>
        <p>
          Add your first transaction
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      <div className="mobile-transactions">
        {rows.map((transaction) => (
          <div
            key={transaction._id}
            className="transaction-card-mobile"
          >
            <div className="mobile-header">
              <h3>{transaction.title}</h3>

              <button
                className="info-btn"
                onClick={() =>
                  setSelectedDescription(
                    transaction.description ||
                    "No description available"
                  )
                }
              >
                <FiEye />
              </button>
            </div>

            <div className="mobile-item">
              <span>Source</span>
              <strong>
                {transaction.source}
              </strong>
            </div>

            <div className="mobile-item">
              <span>Amount</span>
              <strong>
                ₹{transaction.amount}
              </strong>
            </div>

            <div className="mobile-item">
              <span>Cashback</span>
              <strong>
                ₹{transaction.cashback}
              </strong>
            </div>

            <div className="mobile-item">
              <span>Created By</span>
              <strong>
                {transaction.createdBy
                  ?.name || "-"}
              </strong>
            </div>

            <div className="mobile-actions">
              <button
                className="copy-btn"
                onClick={() =>
                  copyTransactionId(transaction._id)
                }
              >
                <FiCopy />
              </button>

              <button
                className="update-btn"
                onClick={() =>
                  updateTransaction(transaction)
                }
              >
                Update
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteTransaction(transaction._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Cashback</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(
              (transaction, index) => (
                <tr
                  key={transaction._id}
                >
                  <td className="serial-number">
                    {index + 1}
                  </td>

                  <td>
                    <div className="title-cell">
                      <input
                        className="table-input"
                        value={transaction.title}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="info-btn"
                        onClick={() =>
                          setSelectedDescription(
                            transaction.description ||
                            "No description available"
                          )
                        }
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>

                  <td>
                    <input
                      className="table-input"
                      value={
                        transaction.source
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "source",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="table-input"
                      type="number"
                      value={
                        transaction.amount
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="table-input"
                      type="number"
                      value={
                        transaction.cashback
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "cashback",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <span className="user-badge">
                      {transaction
                        .createdBy?.name ??
                        "-"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="copy-btn"
                        onClick={() =>
                          copyTransactionId(
                            transaction._id
                          )
                        }
                      >
                        <FiCopy />
                      </button>

                      <button
                        className="update-btn"
                        onClick={() =>
                          updateTransaction(
                            transaction
                          )
                        }
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTransaction(
                            transaction._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {selectedDescription && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedDescription(null)
          }
        >
          <div
            className="description-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <h3>Description</h3>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedDescription(
                    null
                  )
                }
              >
                <FiX />
              </button>
            </div>

            <p>
              {selectedDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;