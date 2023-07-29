// NextJS stuff
import { ChangeEvent, useLayoutEffect } from 'react';

// Styles
import styles from './styles/ThemeSwitcher.module.css';

// React
import React from 'react';


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

  // To let window to load
  useLayoutEffect(() => {
      if (!window || !window.matchMedia) return;
      else if (
        window &&
        window.matchMedia('(prefers-color-scheme: light)').matches
      ) {
        setTheme('light');
      } else {
        setTheme('dark')
      };

      if (theme == 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else if (theme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
  }, []);

  return (
    <>
      <label className={styles.themeSwitch}>
        <input
          title="Switch theme"
          onChange={(event) => switchTheme(event)}
          type="checkbox"
          checked={theme == 'dark'}></input>
      </label>
    </>
  );
};

export default ThemeSwitch;
