import { useState } from 'react';
import { Plus, X, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { $, fmtDate } from '../utils/helpers';
import { CATEGORIES, TYPES, MONTHS } from '../utils/constants';
import './Transactions.css';

const Form = ({ onClose, onSubmit, edit }) => {
  const [d, setD] = useState({
    type: edit?.type || TYPES.EXPENSE,
    amount: edit?.amount || '',
    category: edit?.category || CATEGORIES[0].id,
    date: edit?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    note: edit?.note || '',
  });

  const submit = (e) => {
    e.preventDefault();
    if (!d.amount || parseFloat(d.amount) <= 0) return alert('Amount must be > 0');
    onSubmit({ ...d, amount: parseFloat(d.amount) });
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{edit ? 'Edit' : 'Add'} Transaction</h2>
          <button
            onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Type</label>
            <div className="type-group">
              {[TYPES.EXPENSE, TYPES.INCOME].map(t => (
                <button key={t}
                  type="button"
                  onClick={() => setD({ ...d, type: t })}
                  className={`type-btn ${d.type === t ? t === 'expense' ? 'active-exp' : 'active-inc' : ''}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input type="number" step="0.01"
              required value={d.amount}
              onChange={e => setD({ ...d, amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={d.category}
              onChange={e => setD({ ...d, category: e.target.value })}>
              {CATEGORIES.map(c =>
                <option key={c.id}
                  value={c.id}>{c.name}
                </option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date"
              required value={d.date}
              onChange={e => setD({ ...d, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Note</label>
            <input type="text" value={d.note}
              onChange={e => setD({ ...d, note: e.target.value })}
              placeholder="Optional" />
          </div>
          <div className="form-actions">
            <button type="button"
              onClick={onClose}
              className="cancel">Cancel</button>
            <button type="submit"
              className="save">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Transactions() {
  const { transactions, add, edit, del } = useApp();
  const [filters, setFilters] = useState({ month: '', type: '', category: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [timeout, setTimeoutState] = useState(null);

  const search = (v) => {
    if (timeout) clearTimeout(timeout);
    setTimeoutState(setTimeout(() => setFilters({ ...filters, search: v }), 300));
  };

  const filtered = transactions.filter(t => {
    if (filters.month && !t.date.startsWith(filters.month)) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.search && !t.note?.toLowerCase().includes(filters.search.toLowerCase()) && !t.category?.includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const clear = () => setFilters({ month: '', type: '', category: '', search: '' });

  return (
    <div className="transactions">
      <div className="header">
        <h1>Transactions</h1>
        <button onClick={() => {
          setEditData(null);
          setShowForm(true);
        }}
          className="add">
          <Plus size={18} /> Add</button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input type="text"
            placeholder="Search..."
            onChange={e => search(e.target.value)} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter">
           Filters</button>
      </div>

      {showFilters && (
        <div className="filters">
          <select value={filters.month}
            onChange={e => setFilters({ ...filters, month: e.target.value })}>
            <option value="">All Months</option>
            {MONTHS.map((m, i) =>
              <option key={m} value={`2024-${String(i + 1).padStart(2, '0')}`}>{m}
              </option>)}
          </select>
          <select value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c =>
              <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {(filters.month || filters.type || filters.category || filters.search) &&
            <button
              onClick={clear}
              className="clear">Clear</button>}
        </div>
      )}

      {!filtered.length ? (
        <div className="empty">
          <h3>No transactions</h3>
          <p>{filters.search || filters.month || filters.type || filters.category ? 'Adjust filters' : 'Add your first'}</p>
        </div>
      ) : (
        filtered.map(t => {
          const cat = CATEGORIES.find(c => c.id === t.category);
          return (
            <div key={t.id} className="item">
              <div className="left">
                <div className="icon" style={{ background: cat?.color || 'var(--blue)' }}>{cat?.name?.[0] || '?'}</div>
                <div>
                  <div className="name">{cat?.name || 'Other'}</div>
                  {t.note && <div className="note">{t.note}</div>}
                  <div className="date">{fmtDate(t.date)}</div>
                </div>
              </div>
              <div className="right">
                <div className={t.type === 'income' ? 'income' : 'expense'}>{t.type === 'income' ? '+' : '-'}{$(t.amount)}</div>
                <button
                  onClick={() => { setEditData(t); setShowForm(true); }}
                  className="edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => { if (confirm('Delete?')) del(t.id); }}
                  className="delete"><Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })
      )}

      {showForm && <Form edit={editData}
        onClose={() => { setShowForm(false); setEditData(null); }}
        onSubmit={(data) => { if (editData) edit(editData.id, data); else add(data); setShowForm(false); setEditData(null); }} />}
    </div>
  );
}