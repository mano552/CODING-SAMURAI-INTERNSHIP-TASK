import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('currentUser'));
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('All');
  const [editIndex, setEditIndex] = useState(-1);
  const [editInput, setEditInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (input.trim() && isAuthenticated) {
      setTasks([...tasks, { text: input, category, completed: false }]);
      setInput('');
    } else {
      alert('Please log in to add tasks.');
    }
  };

  const handleToggleComplete = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleDeleteTask = (index) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditInput(tasks[index].text);
  };

  const handleSaveEdit = (index) => {
    if (editInput.trim()) {
      const newTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editInput } : task
      );
      setTasks(newTasks);
    }
    setEditIndex(-1);
    setEditInput('');
  };

  const handleClearCompleted = () => {
    if (window.confirm('Clear all completed tasks?')) {
      const newTasks = tasks.filter((task) => !task.completed);
      setTasks(newTasks);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      alert('User already exists. Please log in.');
      return;
    }
    users[email] = { password: password };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please log in.');
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleSignin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email].password === password) {
      localStorage.setItem('currentUser', email);
      setIsAuthenticated(true);
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } else {
      alert('Invalid email or password.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[forgotEmail]) {
      alert(`Password reset link sent to ${forgotEmail}. Check your email to reset your password. (Simulated)`);
      setShowForgotPassword(false);
      setForgotEmail('');
    } else {
      alert('No account found with this email.');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (showLogin) {
    return (
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSignin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <button onClick={() => { setShowSignup(true); setShowLogin(false); }}>Signup</button>
          </p>
          <p>
            <button onClick={() => { setShowForgotPassword(true); setShowLogin(false); }}>Forgot Password?</button>
          </p>
        </form>
      </div>
    );
  }

  if (showSignup) {
    return (
      <div className="auth-container">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Signup</button>
          <p>
            Already have an account? <button onClick={() => { setShowSignup(false); setShowLogin(true); }}>Login</button>
          </p>
        </form>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Reset Password</button>
          <p>
            <button onClick={() => { setShowForgotPassword(false); setShowLogin(true); }}>Back to Login</button>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>To-Do List</h1>
        <button onClick={handleSignout}>Sign Out</button>
      </nav>
      <div className="task-form">
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <optgroup label="Work">
              <option value="Office">Office</option>
              <option value="Remote">Remote</option>
            </optgroup>
            <optgroup label="Personal">
              <option value="Health">Health</option>
              <option value="Hobbies">Hobbies</option>
            </optgroup>
            <optgroup label="Shopping">
              <option value="Shopping">Shopping</option>
            </optgroup>
          </select>
          <button type="submit" disabled={!input.trim() || !isAuthenticated}>Add</button>
        </form>
      </div>
      <div className="task-counter">
        <span>Total: {tasks.length}</span>
        <span>Completed: {tasks.filter((task) => task.completed).length}</span>
      </div>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet. Add one above!</p>
      ) : (
        <ul className="task-list">
          {tasks
            .filter((task) => category === 'All' || task.category === category)
            .map((task, index) => (
              <li key={index} className={task.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(index)}
                />
                {editIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(index)} disabled={!editInput.trim()}>
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{task.text} <small>({task.category})</small></span>
                    <button className="edit" onClick={() => handleEditTask(index)}>
                      Edit
                    </button>
                    <button className="delete" onClick={() => handleDeleteTask(index)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
      {tasks.filter((task) => task.completed).length > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear Completed
        </button>
      )}
    </div>
  );
}

export default App;