// Styles
import { IconType } from 'react-icons-ng';
import generalStyles from '../styles/General.module.css'

// Icons
import dynamic from 'next/dynamic';
const IoCloseCircleSharp = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/io5').then(mod => mod.IoCloseCircleSharp), { ssr: false })
const TiWarning = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/ti').then(mod => mod.TiWarning), { ssr: false })


const Warning: React.FC<{}> = () => {
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

export default Warning;
