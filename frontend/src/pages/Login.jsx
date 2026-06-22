import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data } =
        await API.post(
          "/auth/login",
          formData
        );

      localStorage.setItem(
        "token",
        data.token
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      if (!navigator.onLine) {
        alert(
          "No internet connection. Please check your network and try again."
        );
      } else {
        alert(
          error.response?.data
            ?.message ||
            "Login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
         <div className="auth-overlay">
            <div className="form-container">
      <h1>Login</h1>

      <p className="form-subtitle">
        Login to manage your trips
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      <p className="auth-link">
        New User?
        <Link to="/register">
          {" "}Register
        </Link>
      </p>
    </div>
    </div>
    </div>
    
  );
}

export default Login;