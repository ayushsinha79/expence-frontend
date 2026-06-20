import "./transactionForm.css";
import {
  FiFileText,
  FiAlignLeft,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiCalendar
} from "react-icons/fi";

function TransactionForm({
  title,
  description,
  amount,
  source,
  belongsTo,
  availableUsers,
  setTitle,
  setDescription,
  setAmount,
  setSource,
  setBelongsTo,
  onSubmit,
  date,
  setDate,
}) {
  const paymentSources = [
    "AXIS Flipkart",
    "HDFC Swiggy",
    "ICICI Amazon",
    "One Card",
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
        <label className="label-with-icon">
          <FiFileText />
          <span>Title</span>
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
        <label className="label-with-icon">
          <FiAlignLeft />
          <span>Description</span>
        </label>

        <textarea
          className="form-textarea"
          placeholder="Monthly subscription payment, grocery purchase, travel expense..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="label-with-icon">
            <FiDollarSign />
            <span>Amount (₹)</span>
          </label>

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
          <label className="label-with-icon">
            <FiCreditCard />
            <span>Payment Source</span>
          </label>

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

          <small className="helper-text">
            Choose the card or payment method
          </small>
        </div>
      </div>

      <div className="form-group">
        <label className="label-with-icon">
          <FiCalendar />
          <span>Transaction Date</span>
        </label>

        <input
          className="form-input"
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label className="label-with-icon">
          <FiUser />
          <span>Belongs To</span>
        </label>

        <select
          className="form-input"
          value={belongsTo}
          onChange={(e) =>
            setBelongsTo(e.target.value)
          }
          required
        >
          <option value="">
            Select User
          </option>

          {availableUsers?.map(
            (user) => (
              <option
                key={user._id}
                value={user._id}
              >
                {user.name}
              </option>
            )
          )}
        </select>
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