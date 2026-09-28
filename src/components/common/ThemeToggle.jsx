
import { useTheme } from '../../hooks/UseTheme.js';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      Theme
    </button>
  );
}