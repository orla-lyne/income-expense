
import { useState } from 'react';
import { Plus, X, Trash2, Search, Edit2 } from 'lucide-react';
import { useApp } from '../hooks/useApp.jsx';
import { $, fmtDate } from '../utils/helpers.js';
import { TYPES } from '../utils/Constants.js';
import './Transactions.css';

const labelForMonth = (ym) => {
  const [y, m] = ym.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
};

const Form = ({ onClose, onSubmit, edit, categories }) => {
  const [d, setD] = useState({
    type: edit?.type || TYPES.EXPENSE,
    amount: edit?.amount || '',
    category: edit?.category || categories[0]?.id || 'other',
    date: edit?.date || new Date().toISOString().split('T')[0],
    note: edit?.note || '',
  });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const amt = parseFloat(d.amount);
    if (!d.amount || isNaN(amt) || amt <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setError('');
    onSubmit({ ...d, amount: amt });
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{edit ? 'Edit' : 'Add'} Transaction</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={24} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Type</label>
            <div className="type-group">
              {[TYPES.EXPENSE, TYPES.INCOME].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setD({ ...d, type: t })}
                  className={`type-btn ${d.type === t
                      ? t === 'expense' ? 'active-exp' : 'active-inc'
                      : ''
                    }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              required
              value={d.amount}
              onChange={e => {
                setD({ ...d, amount: e.target.value });
                if (error) setError('');
              }}
              className={error ? 'input-error' : ''}
            />
            {error && <div className="error-msg">{error}</div>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={d.category}
              onChange={e => setD({ ...d, category: e.target.value })}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              required
              value={d.date}
              onChange={e => setD({ ...d, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={d.note}
              onChange={e => setD({ ...d, note: e.target.value })}
              placeholder="Optional description"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
            <button type="submit" className="save">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Transactions() {
  const { transactions, categories, add, edit, del } = useApp();
  const [filters, setFilters] = useState({ month: '', type: '', category: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilters(f => ({ ...f, search: val }));
  };

  const monthOptions = [...new Set(
    transactions.map(t => t.date.slice(0, 7))
  )].sort().reverse();

  const filtered = transactions.filter(t => {
    if (filters.month && !t.date.startsWith(filters.month)) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const nameMatch = categories.find(c => c.id === t.category)?.name?.toLowerCase().includes(q);
      const noteMatch = t.note?.toLowerCase().includes(q);
      if (!nameMatch && !noteMatch) return false;
    }
    return true;
  });

  const clearFilters = () => setFilters({ month: '', type: '', category: '', search: '' });
  const hasFilters = filters.month || filters.type || filters.category || filters.search;

  const handleFormSubmit = (data) => {
    if (editData) {
      edit(editData.id, data);
    } else {
      add(data);
    }
    setShowForm(false);
    setEditData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      del(id);
    }
  };

  return (
    <div className="transactions">
      <div className="header">
        <h1>Transactions</h1>
        <button onClick={() => { setEditData(null); setShowForm(true); }} className="add">
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input type="text" value={filters.search} placeholder="Search..." onChange={handleSearchChange} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="filter">
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <select value={filters.month} onChange={e => setFilters({ ...filters, month: e.target.value })}>
            <option value="">All Months</option>
            {monthOptions.map(ym => (
              <option key={ym} value={ym}>{labelForMonth(ym)}</option>
            ))}
          </select>

          <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {hasFilters && <button onClick={clearFilters} className="clear">Clear</button>}
        </div>
      )}

      {!filtered.length ? (
        <div className="empty">
          <h3>No transactions found</h3>
          <p>{hasFilters ? 'Try adjusting your filter options' : 'Add your first transaction entry to start tracking'}</p>
        </div>
      ) : (
        filtered.map(t => {
          const cat = categories.find(c => c.id === t.category);
          return (
            <div key={t.id} className="item">
              <div className="left">
                <div className="icon" style={{ background: cat?.color || 'var(--blue)' }}>
                  {cat?.name?.[0] || '?'}
                </div>
                <div>
                  <div className="name">{cat?.name || 'Other'}</div>
                  {t.note && <div className="note">{t.note}</div>}
                  <div className="date">{fmtDate(t.date)}</div>
                </div>
              </div>
              <div className="right">
                <div className={t.type === 'income' ? 'income' : 'expense'}>
                  {t.type === 'income' ? '+' : '-'}{$(t.amount)}
                </div>

                <button onClick={() => { setEditData(t); setShowForm(true); }} className="edit" aria-label="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })
      )}

      {showForm && (
        <Form
          categories={categories}
          edit={editData}
          onClose={() => { setShowForm(false); setEditData(null); }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
