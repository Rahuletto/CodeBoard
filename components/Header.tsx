// NextJS stuff
import styles from './styles/Header.module.css'

// Component
import ThemeSwitch from './ThemeSwitch';

// Icons
import { FaPlus } from 'react-icons-ng/fa';
import { VscGithubInverted } from 'react-icons-ng/vsc'

interface MetaTagsProps {
    ISE?: boolean; // Expands to Internal Server Error
    theme?: string;
    setTheme?: Function
}

const Header: React.FC<MetaTagsProps> = ({ ISE, theme, setTheme } = { ISE: false }) => {
    return (
        <header>
            <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <a href="/home" className={styles.title} >{ISE ? 'C0d3B0a2d' : 'CodeBoard'}</a>
            <a  target="_blank" style={{height: '42px'}} rel="noreferrer" href="https://github.com/Rahuletto/CodeBoard" className={[styles.newProject, 'pc'].join(' ')}>
                <VscGithubInverted style={{ marginRight: '10px' }} /> Github
            </a>
            </div>
            <div className={styles.buttons}>
                <a href="/" className={[styles.newProject, 'mobile'].join(' ')}>
                    <FaPlus />
                </a>
                <a href="/" className={[styles.newProject, 'pc'].join(' ')}>
                    <FaPlus style={{ marginRight: '10px' }} /> {ISE ? 'N3w B0a2d' : 'New Board'}
                </a>
                <ThemeSwitch theme={theme} setTheme={setTheme} />
            </div>
        </header>
    );
};

export default Header;
