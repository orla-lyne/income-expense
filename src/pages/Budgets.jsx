import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { CATEGORIES } from '../utils/Constants';
import { $ } from '../utils/helpers';
import './Budgets.css';

export default function Budgets() {
    const { budgets, setBudget, spent } = useApp();
    const [editing, setEditing] = useState(null);
    const [amount, setAmount] = useState('');

    const total = Object.values(budgets).reduce((s, b) => s + b, 0);
    const totalSpent = CATEGORIES.reduce((s, c) => s + spent(c.id), 0);

    return (
        <div className="budgets">
            <h1> Budgets</h1>
            <p className="sub">Set monthly limits</p>

            <div className="summary">
                {[
                    { label: 'Total Budget', value: total },
                    { label: 'Total Spent', value: totalSpent },
                    { label: 'Remaining', value: total - totalSpent, color: total - totalSpent >= 0 ? '#10b981' : '#ef4444' },
                ].map((item, i) => (
                    <div key={i} className="summary-item">
                        <div className="label">{item.label}</div>
                        <div className="value" style={{ color: item.color || 'var(--text)' }}>{$(item.value)}</div>
                    </div>
                ))}
            </div>

            <div className="list">
                {CATEGORIES.map(cat => {
                    const budget = budgets[cat.id] || 0;
                    const spentAmt = spent(cat.id);
                    const pct = budget > 0 ? Math.min((spentAmt / budget) * 100, 100) : 0;
                    const over = spentAmt > budget;
                    const isEditing = editing === cat.id;

                    return (
                        <div key={cat.id} className="item">
                            <div className="item-header">
                                <div className="left">
                                    <div className="color" style={{ background: cat.color }} />
                                    <div>
                                        <div className="name">{cat.name}</div>
                                        <div className="spent">Spent: {$(spentAmt)}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    {isEditing ? (
                                        <div className="edit-group">
                                            <input type="number"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                placeholder="0" autoFocus />
                                            <button
                                                onClick={() => {
                                                    setBudget(cat.id, parseFloat(amount) || 0);
                                                    setEditing(null);
                                                }}
                                                className="save">Save</button>
                                            <button
                                                onClick={() => setEditing(null)}
                                                className="cancel">Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="budget">Budget: {$(budget)}</span>
                                            <button
                                                onClick={() => { setEditing(cat.id); setAmount(budget.toString()); }}
                                                className="edit-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {budget > 0 && (
                                <div className="progress">
                                    <div className="bar">
                                        <div className="fill"
                                            style={{ width: `${pct}%`, background: pct < 70 ? '#10b981' : pct < 90 ? '#f59e0b' : '#ef4444' }} />
                                    </div>
                                    <div className="info">
                                        <span>{$(spentAmt)} spent</span>
                                        <span>{$(Math.max(budget - spentAmt, 0))} remaining</span>
                                    </div>
                                    {over &&
                                        <div className="over"> Over by {$(spentAmt - budget)}
                                        </div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}