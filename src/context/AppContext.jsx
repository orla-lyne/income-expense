import React from 'react';
import { AppContext } from './AppContextObject.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { DEFAULT_CATEGORIES } from '../utils/Constants.js';
import { calcTotals } from '../utils/helpers.js';

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [budgets, setBudgets] = useLocalStorage('budgets', {});
  const [customCategories, setCustomCategories] = useLocalStorage('categories', []);

  const categories = [...DEFAULT_CATEGORIES, ...customCategories];

  const add = (t) =>
    setTransactions([{ id: crypto.randomUUID(), ...t }, ...transactions]);

  const edit = (id, data) =>
    setTransactions(
      transactions.map(t => (t.id === id ? { ...t, ...data } : t))
    );

  const del = (id) =>
    setTransactions(transactions.filter(t => t.id !== id));

  const setBudget = (monthKey, cat, amt) => {
    setBudgets({
      ...budgets,
      [monthKey]: { ...(budgets[monthKey] || {}), [cat]: amt },
    });
  };

  const getBudget = (monthKey, cat) => budgets[monthKey]?.[cat] || 0;

  const spent = (cat, monthKey) =>
    transactions
      .filter(t =>
        t.category === cat &&
        t.type === 'expense' &&
        (!monthKey || t.date.startsWith(monthKey))
      )
      .reduce((s, t) => s + t.amount, 0);

  const addCategory = (name, color) => {
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
    const id = `${slug}-${crypto.randomUUID().slice(0, 4)}`;
    setCustomCategories([...customCategories, { id, name, color, custom: true }]);
    return id;
  };

  const deleteCategory = (id) =>
    setCustomCategories(customCategories.filter(c => c.id !== id));

  return (
    <AppContext.Provider
      value={{
        transactions, add, edit, del,
        budgets, setBudget, getBudget,
        categories, addCategory, deleteCategory,
        spent,
        totals: calcTotals(transactions),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}