import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setToken, setUsername }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    axios.post('/api/auth/login', { username, password })
      .then(res => {
        setToken(res.data.token);
        setUsername(res.data.username);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
      })
      .catch(() => alert('Invalid credentials'));
  }

  return (
    <form onSubmit={handleLogin}>
      <h3>Login</h3>
      <input placeholder="Username" value={username} onChange={e => setLocalUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}