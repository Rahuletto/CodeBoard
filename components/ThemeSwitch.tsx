import { ChangeEvent, useEffect } from 'react';

interface ThemeSwitchProps {
  theme?: 'light' | 'dark' | string;
  setTheme?: Function | any;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ theme, setTheme }) => {
  // Theme switcher
  function switchTheme(e: ChangeEvent<HTMLInputElement>) {
    const toggleSwitch = e.target;
    if (e.target.checked) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
      setTheme('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      toggleSwitch.checked = false;
      setTheme('light');
    }
  }

  useEffect(() => {
    function detectColorScheme() {
      if (!window || !window.matchMedia) return false;

      else if (window && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
      }

      if (theme == 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else if (theme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    detectColorScheme()
  }, [])

  return (
    <>
      <label id="themeSwitch">
        <input
          onChange={(event) => switchTheme(event)}
          type="checkbox"
          checked={theme == 'dark'}
        ></input>
      </label>

    </>
  );
};

export default ThemeSwitch;
