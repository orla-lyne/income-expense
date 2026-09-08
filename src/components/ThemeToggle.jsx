

import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button onClick={toggle} className="toggle">
     Theme
    </button>
  );
}