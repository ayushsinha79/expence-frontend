import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] =
    useState("");
  const [message, setMessage] =
    useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            username,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(
          "Account created successfully"
        );
        navigate("/");
      } else {
        setMessage(
          data.message ||
            "Failed to create account"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Something went wrong"
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo">₹</div>

        <h1 className="register-title">
          Create Account
        </h1>

        <p className="register-subtitle">
          Create your expense tracker
          account
        </p>

        <input
          className="register-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="register-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <button
          className="register-button"
          onClick={handleRegister}
        >
          Create Account
        </button>

        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          Back to Login
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;