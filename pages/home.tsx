// NextJS stuff
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import generalStyles from '../styles/General.module.css';
import styles from '../styles/Home.module.css';

// Icons
import MetaTags from '../components/Metatags';
import Header from '../components/Header';
import { FaPlus } from 'react-icons-ng/fa';

const Home: NextPage = () => {
    // DARK MODE & LIGHT MODE
    const [theme, setTheme] = useState<'light' | 'dark' | string>();

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'dark');
    }, []);

    return (
        <div className={generalStyles.container}>
            <MetaTags
                title="CodeBoard"
                description="Welcome to codeboard ! Codeboard is an open source bin website thats better in every way."
            />

            <main className={generalStyles.main}>
                <Header theme={theme} setTheme={setTheme} />

                <div className={generalStyles.lander}>
                    <h1 className={styles.headin}>CodeBoard</h1>
                    <p style={{ fontSize: '22px' }}>
                        CodeBoard is an open-source code sharing platform thats better in every way.
                        <br></br>With beautiful syntax highlighting and integrated with
                        Prettier.<br></br>
                        <br></br>
                        <span style={{ fontStyle: 'italic', opacity: 0.8 }}>
                            Supporting 125 languages so far!
                        </span>
                    </p>
                    <a
                        style={{ width: 'fit-content', marginTop: '18px' }}
                        href="/"
                        className={generalStyles.newProject}
                    >
                        <FaPlus style={{ marginRight: '10px' }} /> New board
                    </a>
                </div>
                <footer>
                    Made by <a href='https://rahuletto.thedev.id'>Rahuletto</a>
                </footer>
            </main>
        </div>
    );
};

export default Home;
