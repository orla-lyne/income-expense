

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, Settings as SettingsIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { ThemeToggle } from './components/common/ThemeToggle.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Settings from './pages/Settings.jsx';
import './App.css';

function NavigationLinks() {
  const location = useLocation();
  
  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/transactions', label: 'Transactions', icon: <Receipt size={18} /> },
    { to: '/budgets', label: 'Budgets', icon: <Target size={18} /> },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon size={18} /> }
  ];

  return (
    <nav>
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link 
            key={link.to} 
            to={link.to} 
            className={`link ${isActive ? 'active-link' : ''}`}
          >
            {link.icon}
            <span className="link-label">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="app">
            <aside className="sidebar">
              <div className="logo">Tracker</div>
              <NavigationLinks />
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
