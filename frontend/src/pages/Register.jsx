import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
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
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/auth/register",
        formData
      );

      alert(
        "Registration Successful"
      );

      navigate("/");
    } catch (error) {
      if (!navigator.onLine) {
        alert(
          "No internet connection. Please check your network and try again."
        );
      } else {
        alert(
          error.response?.data
            ?.message ||
            "Registration failed"
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
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
            ? "Registering..."
            : "Register"}
        </button>
      </form>

      <p className="auth-link">
        Already have an account?
        <Link to="/">
          {" "}Login
        </Link>
      </p>
    </div>
    </div>
    </div>
  );
}

export default Register;