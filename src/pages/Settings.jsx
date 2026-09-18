import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../hooks/useApp.jsx';
import './Settings.css';

export default function Settings() {
  const { categories, addCategory, deleteCategory } = useApp();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A category with that name already exists');
      return;
    }
    setError('');
    addCategory(trimmed, color);
    setName('');
    setColor('#3b82f6');
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <h2>Categories</h2>

      <form onSubmit={submit} className="cat-form">
        <input
          value={name}
          onChange={e => { setName(e.target.value); if (error) setError(''); }}
          placeholder="Category name"
          className={error ? 'input-error' : ''}
        />
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          aria-label="Category colour"
        />
        <button type="submit">Add</button>
      </form>
      {error && <div className="error-msg">{error}</div>}

      <ul className="cat-list">
        {categories.map(c => (
          <li key={c.id}>
            <span className="dot" style={{ background: c.color }} />
            <span className="cat-name">{c.name}</span>
            {c.custom && (
              <button
                onClick={() => deleteCategory(c.id)}
                className="del"
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}