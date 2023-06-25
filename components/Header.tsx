import { FaPlus } from 'react-icons-ng/fa';
import styles from './styles/Header.module.css'
import ThemeSwitch from './ThemeSwitch';

interface MetaTagsProps {
    ISE?: boolean; // Expands to Internal Server Error
    theme?: string;
    setTheme?: Function
}

const Header: React.FC<MetaTagsProps> = ({ ISE, theme, setTheme } = { ISE: false }) => {
    return (
        <header>
            <h1 className={styles.title}>{ ISE ? 'C0d3B0a2d': 'CodeBoard'}</h1>
            <div className={styles.buttons}>
                <a href="/" className={[styles.newProject, 'mobile'].join(' ')}>
                    <FaPlus />
                </a>
                <a href="/" className={[styles.newProject, 'pc'].join(' ')}>
                    <FaPlus style={{ marginRight: '10px' }} /> { ISE ? 'N3w B0a2d': 'New Board'}
                </a>
                <ThemeSwitch theme={theme} setTheme={setTheme} />
            </div>
        </header>
    );
};

export default Header;
