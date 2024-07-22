import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import TodoList from "./TodoList";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    setCurrentPage("todoList");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage("login");
  };

  const showRegisterPage = () => setCurrentPage("register");
  const showLoginPage = () => setCurrentPage("login");

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : "light-mode"}`}>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      {currentPage === "login" && (
        <Login onLogin={handleLogin} onRegisterClick={showRegisterPage} />
      )}
      {currentPage === "register" && (
        <Register onLoginPageClick={showLoginPage} />
      )}
      {currentPage === "todoList" && (
        <TodoList onLogout={handleLogout} loggedInUser={loggedInUser} />
      )}
    </div>
  );
}

export default App;
