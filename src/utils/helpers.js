import { format, parseISO } from 'date-fns';

export const $ = (amt) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
export const fmtDate = (date) => format(parseISO(date), 'MMM d');

export const calcTotals = (txs) => {
  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const byCategory = (txs) => {
  return txs.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
};

export const overTime = (txs) => {
  return txs.filter(t => t.type === 'expense')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(t => ({ date: fmtDate(t.date), amount: t.amount }));
};