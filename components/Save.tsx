// Styles
import styles from '../styles/Index.module.css';

// Icons
import { BiSolidSave } from 'react-icons/bi';

// MillionJS
import { block } from 'million/react';

const UnblockedSave = () => {
  return (
    <div className={[styles.dropzone, styles.backdrop, 'droppy'].join(' ')}>
      <div
        className={['details', 'error', 'droppy'].join(' ')}
        style={{ maxWidth: '400px', justifyContent: 'center' }}>
        <BiSolidSave style={{ fontSize: '64px', color: 'var(--green)' }} />
        <h1 style={{ margin: '6px', textAlign: 'center' }}>Saving</h1>
        <p className="error-text" style={{ fontSize: '18px' }}>
          This might take 5 seconds on average. Sip a cup of coffee while we
          push your board on the cloud.
        </p>
      </div>
    </div>
  );
};

const Save = block(UnblockedSave);
export default Save;
