import React, { useState, useEffect } from "react";
import axios from 'axios';

function Register({ onLoginPageClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError("All fields are required.");
    } else if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long and contain at least one number and one uppercase letter."
      );
    } else {
      try {
        await axios.post('http://localhost:5000/register', { username, password });
        setError("");
        alert("Registration successful!");
        onLoginPageClick();
      } catch (err) {
        setError("Username already exists.");
      }
    }
  };

  return (
    <div className="loginpage" id="register-page">
      <h2>Register</h2>
      <input
        type="text"
        id="register-username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
      />
      <div className="password-container">
        <input
          type="password"
          id="register-password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="checkbox-span">
          <input
            type="checkbox"
            id="showPassword"
            onClick={() => {
              const passwordInput = document.getElementById("register-password");
              passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";
            }}
          />
        </span>
      </div>
      <button className="register-btn" onClick={handleRegister}>
        Register
      </button>
      <button className="login-btn" onClick={onLoginPageClick}>
        Back to Login
      </button>
      <p id="register-error" className="error">
        {error}
      </p>
    </div>
  );
}

export default Register;
