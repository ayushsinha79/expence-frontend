import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/transactionForm";
import "./Transaction.css";

function Transaction() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [amount, setAmount] =
    useState("");
  const [source, setSource] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(
      localStorage.getItem(
        "currentUser"
      )
    );

    if (!currentUser) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/transaction/create",
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
            belongsTo:
              currentUser._id,
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

        navigate("/dashboard");
      } else {
        alert(data.message);
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
      <div className="transaction-card">
        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back
        </button>

        <div className="transaction-header">
          <h1 className="transaction-title">
            Add Transaction
          </h1>

          <p className="transaction-subtitle">
            Record a new expense in
            your tracker
          </p>
        </div>

        <TransactionForm
          title={title}
          description={description}
          amount={amount}
          source={source}
          setTitle={setTitle}
          setDescription={
            setDescription
          }
          setAmount={setAmount}
          setSource={setSource}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Transaction;