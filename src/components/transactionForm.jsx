import "./transactionForm.css";

function TransactionForm({
  title,
  description,
  amount,
  source,
  setTitle,
  setDescription,
  setAmount,
  setSource,
  onSubmit,
}) {
  const paymentSources = [
    "AXIS Flipkart CC",
    "HDFC Swiggy CC",
    "ICICI Amazon CC",
    "One Card Metal CC",
    "Kiwi CC",
    "Gpay-HDFC",
    "Gpay-Axis",
    "Gpay-SBI",
  ];

  return (
    <form
      className="transaction-form"
      onSubmit={onSubmit}
    >
      <div className="form-group">
        <label>
          Transaction Title
        </label>

        <input
          className="form-input"
          type="text"
          placeholder="Netflix Subscription"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          className="form-textarea"
          placeholder="Monthly subscription payment..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹)</label>

          <input
            className="form-input amount-input"
            type="number"
            placeholder="500"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Source</label>

          <select
            className="form-input"
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
            required
          >
            <option value="">
              Select Source
            </option>

            {paymentSources.map(
              (paymentSource) => (
                <option
                  key={paymentSource}
                  value={paymentSource}
                >
                  {paymentSource}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="submit-btn"
      >
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;