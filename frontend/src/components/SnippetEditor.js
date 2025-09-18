import React, { useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SnippetEditor({ token, setSnippets }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('/api/snippets', { title, code, language }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setSnippets(snips => [...snips, res.data]);
        setTitle('');
        setCode('');
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Snippet</h3>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <textarea placeholder="Code" value={code} onChange={e => setCode(e.target.value)} />
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
      <button type="submit">Save Snippet</button>
    </form>
  );
}