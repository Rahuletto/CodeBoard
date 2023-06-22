import Script from "next/script";
import { ChangeEvent } from "react";


interface ThemeSwitchProps {
    theme?: "light" | "dark";
    setTheme?: Function | any;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ theme, setTheme }) => {
    function detectColorScheme() {
        //local storage is used to override OS theme settings
        if (localStorage.getItem('theme')) {
            if (localStorage.getItem('theme') == 'light') {
                setTheme('light');
            }
        } else if (!window.matchMedia) {
            //matchMedia method not supported
            return false;
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            //OS theme setting detected as dark
            setTheme('light');
        }

        //dark theme preferred, set document with a `data-theme` attribute
        if (theme == 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (theme == 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
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

    return (
        <>
            <label id="themeSwitch">
                <input
                    onChange={(event) => switchTheme(event)}
                    type="checkbox"
                    checked={theme=='dark'}
                ></input>
            </label>
            <Script onLoad={() => detectColorScheme()} id="dark-mode">
                {`console.log("Loaded")`}
            </Script>
        </>

    )
}

export default ThemeSwitch;