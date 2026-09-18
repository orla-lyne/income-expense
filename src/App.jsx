import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, Settings as SettingsIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { ThemeToggle } from './components/common/ThemeToggle.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Settings from './pages/Settings.jsx';
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
                <Link to="/" className="link">
                  <LayoutDashboard size={18} />
                  <span className="link-label">Dashboard</span>
                </Link>
                <Link to="/transactions" className="link">
                  <Receipt size={18} />
                  <span className="link-label">Transactions</span>
                </Link>
                <Link to="/budgets" className="link">
                  <Target size={18} />
                  <span className="link-label">Budgets</span>
                </Link>
                <Link to="/settings" className="link">
                  <SettingsIcon size={18} />
                  <span className="link-label">Settings</span>
                </Link>
              </nav>
              <ThemeToggle />
            </aside>
            <main className="main">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;