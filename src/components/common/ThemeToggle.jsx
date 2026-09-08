

import { useTheme } from '../../hooks/useTheme.jsx';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button onClick={toggle} className="toggle">
     Theme
    </button>
  );
}