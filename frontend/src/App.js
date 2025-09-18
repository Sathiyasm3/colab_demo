import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import SnippetEditor from './components/SnippetEditor';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    if (token) {
      axios.get('/api/snippets', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setSnippets(res.data));
    }
  }, [token]);

  if (!token) {
    return (
      <div>
        <h2>SnipSave Clone</h2>
        <Login setToken={setToken} setUsername={setUsername} />
        <Register />
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <button onClick={() => { setToken(''); setUsername(''); localStorage.clear(); }}>Logout</button>
      <SnippetEditor token={token} setSnippets={setSnippets} />
      <ul>
        {snippets.map(snippet => (
          <li key={snippet._id}>
            <strong>{snippet.title}</strong> ({snippet.language})
            <pre>{snippet.code}</pre>
            <button onClick={async () => {
              await axios.delete(`/api/snippets/${snippet._id}`, { headers: { Authorization: `Bearer ${token}` } });
              setSnippets(snippets.filter(s => s._id !== snippet._id));
            }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;