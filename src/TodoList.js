import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

function TodoList({ onLogout, loggedInUser }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks", {
        params: { username: loggedInUser },
      });
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const capitalizedTask =
      newTask.charAt(0).toUpperCase() + newTask.slice(1);
    try {
      const response = await axios.post("http://localhost:5000/tasks", {
        username: loggedInUser,
        text: capitalizedTask,
      });
      setTasks(response.data);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (index) => {
    try {
      const response = await axios.delete(`http://localhost:5000/tasks/${index}`, {
        data: { username: loggedInUser },
      });
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCompleteTask = async (index) => {
    const updatedTask = { ...tasks[index], isCompleted: !tasks[index].isCompleted };
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${index}`, {
        username: loggedInUser,
        text: updatedTask.text,
        isCompleted: updatedTask.isCompleted,
      });
      setTasks(response.data);
      if (updatedTask.isCompleted) {
        alert(`Good Job! You just completed "${updatedTask.text}" task!`);
      } else {
        alert("Come On! I thought you had it!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditingTask = (index, text) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const saveEditedTask = async () => {
    const updatedTasks = tasks.map((task, i) =>
      i === editingIndex ? { ...task, text: editingText } : task
    );
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${editingIndex}`, {
        username: loggedInUser,
        text: editingText,
        isCompleted: updatedTasks[editingIndex].isCompleted,
      });
      setTasks(response.data);
      setEditingIndex(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteAllTasks = () => {
    setShowModal(true);
    setModalType("deleteAll");
  };

  const deleteAllTasks = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/tasks`, {
        data: { username: loggedInUser },
      });
      setTasks(response.data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => a.isCompleted - b.isCompleted);
  };

  return (
    <div className="page" id="app">
      <h1 className="heading">TODO LIST 👍</h1>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
      <input
        type="text"
        id="new-task"
        placeholder="Add Item..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button className="add-task-btn" onClick={addTask}>
        Add Task
      </button>
      <button className="delete-all-btn" onClick={confirmDeleteAllTasks}>
        Delete All
      </button>
      <div id="tasks">
        {tasks.map((task, index) => (
          <div key={index} className={task.isCompleted ? "completed task" : "task"}>
            {editingIndex === index ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={saveEditedTask}
                onKeyDown={(e) => e.key === "Enter" && saveEditedTask()}
              />
            ) : (
              <span>{task.text}</span>
            )}
            <div className="edcbtn">
              {editingIndex === index ? (
                <button
                  className="save-btn"
                  onClick={saveEditedTask}
                >
                  Save
                </button>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => startEditingTask(index, task.text)}
                >
                  Edit
                </button>
              )}
              <button className="delete-btn" onClick={() => deleteTask(index)}>
                Delete
              </button>
              <button
                className="complete-btn"
                onClick={() => toggleCompleteTask(index)}
              >
                {task.isCompleted ? "Undo" : "Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <Modal
          type={modalType}
          onClose={closeModal}
          onConfirm={deleteAllTasks}
        />
      )}
    </div>
  );
}

export default TodoList;
