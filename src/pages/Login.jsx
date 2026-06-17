import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] =
    useState("");

  const [response, setResponse] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/${userId}`
      );

      if (res.ok) {
        const user =
          await res.json();

        localStorage.setItem(
          "currentUser",
          JSON.stringify(user)
        );

        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "userId",
          data.user.id
        );

        localStorage.setItem(
          "currentUser",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");
      } else {
        setResponse(data);
      }
    } catch (error) {
      setResponse({
        message:
          "Something went wrong",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">₹</div>

        <h1 className="login-title">
          Expense Tracker
        </h1>

        <p className="login-subtitle">
          Login to continue
        </p>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <button
          className="login-button"
          onClick={handleSubmit}
        >
          Login
        </button>

        <button
          className="create-account-button"
          onClick={() =>
            navigate("/register")
          }
        >
          Create Account
        </button>

        {response && (
          <div className="login-message">
            {response.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;