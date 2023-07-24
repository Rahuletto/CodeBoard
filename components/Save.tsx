// Styles
import styles from '../styles/Index.module.css';

// Icons
import dynamic from 'next/dynamic';
const BiSolidSave = dynamic(() => import('react-icons-ng/bi').then(mod => mod.BiSolidSave), { ssr: false })

const Save: React.FC = () => {
  return (
    <div className={[styles.dropzone, styles.backdrop, 'droppy'].join(' ')}>
      <div
        className={['details', 'error', 'droppy'].join(' ')}
        style={{ maxWidth: '400px', justifyContent: 'center' }}>
        <BiSolidSave style={{ fontSize: '64px', color: 'var(--green)' }} />
        <h1 style={{ margin: '6px', textAlign: 'center' }}>Saving</h1>
        <p className="error-text" style={{ fontSize: '18px' }}>
          This might take 3 seconds on average. We also copied the url to your clipboard too. So sip a cup of coffee while we
          push your board on the cloud.
        </p>
      </div>
    </div>
  );
};

export default Save;
