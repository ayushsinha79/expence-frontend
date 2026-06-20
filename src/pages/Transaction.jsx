import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/transactionForm";
import API_BASE_URL from "../config";
import "./Transaction.css";

function Transaction() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [amount, setAmount] =
    useState("");
  const [source, setSource] =
    useState("");

  const [users, setUsers] = useState([]);

  const [belongsTo, setBelongsTo] =
    useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/get`
      );

      const data =
        await response.json();

      setUsers(data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );
    }
  };

  const availableUsers =
    currentUser?.username?.toLowerCase() ===
      "ayush"
      ? users
      : users.filter(
        (user) =>
          user.username.toLowerCase() ===
          "ayush" ||
          user._id === currentUser?._id
      );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login first");
      return;
    }

    if (!belongsTo) {
      alert(
        "Please select who the transaction belongs to"
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/create`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            amount: Number(amount),
            source,
            createdBy:
              currentUser._id,
            belongsTo,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert("Transaction Added");

        setTitle("");
        setDescription("");
        setAmount("");
        setSource("");
        setBelongsTo("");

        navigate("/dashboard");
      } else {
        alert(
          data.message ||
          "Failed to create transaction"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong"
      );
    }
  };

  return (
    <div className="transaction-page">
      <div className="background-blur blur-1" />
      <div className="background-blur blur-2" />

      <div className="transaction-card">
        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <div className="transaction-icon">
          ₹
        </div>

        <div className="transaction-header">
          <h1 className="transaction-title">
            Add Transaction
          </h1>

          <p className="transaction-subtitle">
            Record expenses and cashback
            details in your tracker.
          </p>
        </div>

        <TransactionForm
          title={title}
          description={description}
          amount={amount}
          source={source}
          belongsTo={belongsTo}
          availableUsers={availableUsers}
          setTitle={setTitle}
          setDescription={setDescription}
          setAmount={setAmount}
          setSource={setSource}
          setBelongsTo={setBelongsTo}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Transaction;