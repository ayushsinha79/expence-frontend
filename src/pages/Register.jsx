import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUser,
  FiAtSign,
} from "react-icons/fi";
import API_BASE_URL from "../config";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !username.trim()
    ) {
      toast.warning(
        "Please fill all fields"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/user/create`,
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
        toast.success(
          "Created User"
        );

        navigate("/");
      } else {
        toast.error(
          "Failed to create account"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="background-blur blur-1" />
      <div className="background-blur blur-2" />

      <div className="register-card">
        <div className="logo">
          ₹
        </div>

        <h1 className="register-title">
          Create Account
        </h1>

        <p className="register-subtitle">
          Create your expense tracker
          account
        </p>

        <div className="input-wrapper">
          <FiUser className="input-icon" />

          <input
            className="register-input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleRegister()
            }
          />
        </div>

        <div className="input-wrapper">
          <FiAtSign className="input-icon" />

          <input
            className="register-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleRegister()
            }
          />
        </div>

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default Register;