import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] =
    useState("");

  const [response, setResponse] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

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
    if (!username.trim()) {
      setResponse({
        message:
          "Please enter username",
      });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/login`,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-blur blur-1" />
      <div className="background-blur blur-2" />

      <div className="login-card">
        <div className="logo">
          ₹
        </div>

        <h1 className="login-title">
          Bryant Tracker
        </h1>

        <p className="login-subtitle">
          Track expenses and cashback
          effortlessly
        </p>
        {loading && (
          <div className="loading-message">
            Waking up server... please wait 5–10 seconds.
          </div>
        )}

        <input
          className="login-input"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <button
          className="login-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
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

        <div className="login-footer">
          Secure • Fast • Simple
        </div>
      </div>
    </div>
  );
}

export default Login;