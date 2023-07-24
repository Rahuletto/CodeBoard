// Styles
import dynamic from 'next/dynamic';
import styles from '../styles/Index.module.css';
import feature from './styles/Feature.module.css';

const McCheckCircleFill = dynamic(() => import('react-icons-ng/mc').then(mod => mod.McCheckCircleFill), { ssr: false })
const McForbidCircleLine = dynamic(() => import('react-icons-ng/mc').then(mod => mod.McForbidCircleLine), { ssr: false })

const Features = ({ session }) => {
  return (
    <div
      onClick={() => {
        const elem = document.getElementById(`feature`);
        elem.style.display = 'none';
      }}
      id="feature"
      className={[styles.backdrop, 'backdrop'].join(' ')}>
      <div
        className={['details', 'error', 'droppy', feature.feature].join(' ')}>
        <h1 style={{ margin: '6px', textAlign: 'center' }}>Limit exceeded</h1>
        <p className="error-text" style={{ fontSize: '18px' }}>
          We have limited some features to avoid misuse of this platform as
          being an anonymous.
        </p>
        <div className={feature.cardholder}>
          <div
            title={
              session
                ? 'This is a lower tier than yours'
                : 'You are in this tier'
            }
            className={[feature.card, !session ? feature.active : null].join(
              ' '
            )}>
            <h2>Anonymous</h2>
            <h4>Users without account fall under here</h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: '8px',
                gap: '8px',
              }}>
              <div className={feature.list}>
                <span style={{ color: 'var(--purple)' }}>
                  <McCheckCircleFill />
                </span>{' '}
                1 file per board
              </div>

              <div className={feature.list}>
                <span style={{ color: 'var(--purple)' }}>
                  <McCheckCircleFill />
                </span>{' '}
                No Ads
              </div>

              <div className={feature.list}>
                <span style={{ color: 'var(--red)' }}>
                  <McForbidCircleLine />
                </span>{' '}
                No API access
              </div>

              <div className={feature.list}>
                <span style={{ color: 'var(--red)' }}>
                  <McForbidCircleLine />
                </span>{' '}
                Cant manage boards
              </div>
            </div>
          </div>

          <div
            title={
              session ? 'You are in this tier' : 'This is a higher tier than yours'
            }
            className={[feature.card, session ? feature.active : null].join(
              ' '
            )}>
            <h2>Hobby</h2>
            <h4>Users with account with encryption and more files</h4>

            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              2 files per board
            </div>

            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              API access
            </div>

            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              Can manage boards
            </div>

            <div className={feature.list}>
              <span style={{ color: 'var(--red)' }}>
                <McForbidCircleLine />
              </span>{' '}
              Strict API Ratelimit
            </div>
          </div>

          <div
            title="Coming soon"
            className={feature.card}
            style={{ opacity: 0.6, cursor: 'not-allowed' }}>
            <h2>Pro</h2>
            <h4>
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  color: 'var(--purple-dark)',
                  fontSize: '22px',
                }}>
                $5
              </span>
              /month
            </h4>
            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              4 files per board
            </div>
            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              Lower API ratelimits
            </div>
            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              Password protection
            </div>
            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              Execute code {'[BETA]'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
