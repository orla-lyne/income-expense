import  { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calcTotals } from '../utils/helpers';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [budgets, setBudgets] = useLocalStorage('budgets', {});

  const add = (t) => setTransactions([{ id: Date.now(), ...t }, ...transactions]);
  const edit = (id, data) => setTransactions(transactions.map(t => t.id === id ? { ...t, ...data } : t));
  const del = (id) => setTransactions(transactions.filter(t => t.id !== id));
  const setBudget = (cat, amt) => setBudgets({ ...budgets, [cat]: amt });

  const spent = (cat) => transactions.filter(t => t.category === cat && t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <AppContext.Provider value={{ transactions, add, edit, del, budgets, setBudget, spent, totals: calcTotals(transactions) }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);