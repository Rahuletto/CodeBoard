const FaHeartBroken = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaHeartBroken), { ssr: false })

import dynamic from 'next/dynamic';
import { IconType } from 'react-icons-ng';
import styles from '../styles/Index.module.css';

function Error({ statusCode }) {
  return (
    <div
      style={{ zIndex: '5000' }}
      className={[styles.dropzone, styles.backdrop, 'droppy'].join(' ')}>
      <div
        className={['details', 'error', 'droppy'].join(' ')}
        style={{ maxWidth: '400px', justifyContent: 'center' }}>
        <FaHeartBroken style={{ color: 'var(--red)', fontSize: '64px' }} />
        {statusCode ? (
          <>
            <h1 style={{ margin: '6px', textAlign: 'center' }}>
              ServerSideError
            </h1>
            <p className="error-text" style={{ fontSize: '18px' }}>
              This error occured from cloud, server or from our database. Please
              contact the owner | Status Code: {statusCode}
            </p>
          </>
        ) : (
          <>
            <h1 style={{ margin: '6px', textAlign: 'center' }}>
              ClientSideError
            </h1>
            <p className="error-text" style={{ fontSize: '18px' }}>
              This error didnt occur from cloud, server nor our database. Rather
              its from the Client {'(your browser)'} side. Please contact the
              owner.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default Error;
