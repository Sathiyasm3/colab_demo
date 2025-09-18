import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  function handleRegister(e) {
    e.preventDefault();
    axios.post('/api/auth/register', { username, password })
      .then(() => setMsg('Registered! Please log in.'))
      .catch(() => setMsg('Registration failed'));
  }

  return (
    <form onSubmit={handleRegister}>
      <h3>Register</h3>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
      <div>{msg}</div>
    </form>
  );
}