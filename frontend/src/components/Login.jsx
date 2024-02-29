import React, { useState } from 'react';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    if (username === 'username' && password === 'password') {
      setIsLoggedIn(true); // Set isLoggedIn to true upon successful login
    } else {
      setLoginError(true); // Set loginError to true if login fails
    }
  };

  return (
    <div className="container">
      <h2 style={{ color: '#007bff' }}>Welcome!</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="button">Login</button>
        {loginError && <p style={{ color: 'red' }}>Invalid username or password</p>}
      </form>
    </div>
  );
}

export default Login;
