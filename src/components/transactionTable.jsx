import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import "./TransactionTable.css";

function TransactionTable({
  transactions,
  setTransactions,
  fetchTransactions,
}) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(transactions);
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
        `http://localhost:3000/transaction/update/${transaction._id}`,
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
    try {
      const response = await fetch(
        `http://localhost:3000/transaction/delete/${transactionId}`,
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
      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Cashback</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Belongs To</th>
              <th>Transaction ID</th>
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
                    <input
                      className="table-input"
                      value={
                        transaction.title
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                    />
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
                    <input
                      className="table-input"
                      value={
                        transaction.description
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "description",
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
                    <span className="user-badge">
                      {transaction
                        .belongsTo?.name ??
                        "-"}
                    </span>
                  </td>

                  <td>
                    <div className="id-wrapper">
                      <span className="id-cell">
                        {
                          transaction._id
                        }
                      </span>

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
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons">
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
    </div>
  );
}

export default TransactionTable;