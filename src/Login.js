import React, { useState, useEffect } from "react";
import axios from 'axios';

function Login({ onLogin, onRegisterClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      onLogin(response.data.username);
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="loginpage" id="login-page">
      <h2>Login</h2>
      <input
        type="text"
        id="login-username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
      />
      <div className="password-container">
        <input
          type="password"
          id="login-password"
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
              const passwordInput = document.getElementById("login-password");
              passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";
            }}
          />
        </span>
      </div>
      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>
      <button className="register-btn" onClick={onRegisterClick}>
        Register
      </button>
      <p id="login-error" className="error">
        {error}
      </p>
    </div>
  );
}

export default Login;
