// Styles
import generalStyles from '../styles/General.module.css'

// Icons
import { IoCloseCircleSharp } from 'react-icons-ng/io5';
import { TiWarning } from 'react-icons-ng/ti';
import { block } from 'million/react';

const UnblockedWarning: React.FC<{}> = () => {
  return (
    <div className={[generalStyles.warning, 'warning'].join(' ')}>
      <TiWarning
        title="Warning"
        style={{
          fontSize: '64px',
          minWidth: '34px',
          height: '34px',
          color: 'var(--orange)',
        }}
      />{' '}
      <div className={generalStyles.warnText}>
        <div>
          <h3>Warning</h3>
          <IoCloseCircleSharp
            title="Close Warning"
            style={{ cursor: 'pointer', color: 'var(--red)' }}
            onClick={() =>
              ((
                document.getElementsByClassName('warning')[0] as HTMLElement
              ).style.visibility = 'hidden')
            }
          />
        </div>
        <p>
          These code snippets are made by other users. So we do{' '}
          <b>
            <strong style={{ color: 'var(--orange)' }}>not</strong>
          </b>{' '}
          take responsibilities for any damages. Use it at your own risk
        </p>
      </div>
    </div>
  );
};

const Warning = block(UnblockedWarning, { ssr: false });
export default Warning;
