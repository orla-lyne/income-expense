import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { ThemeToggle } from './components/common/ThemeToggle';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="app">
            <aside className="sidebar">
              <div className="logo">Tracker</div>
              <nav>
                <Link to="/" className="link"> Dashboard</Link>
                <Link to="/transactions" className="link">Transactions</Link>
                <Link to="/budgets" className="link"> Budgets</Link>
              </nav>
              <ThemeToggle />
            </aside>
            <main className="main">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;