// Styles
import dynamic from 'next/dynamic';
import { IconType } from 'react-icons-ng';
import styles from '../styles/Index.module.css';
import feature from './styles/Feature.module.css';
import { User } from '../utils/types/user';
import { Session } from '@supabase/supabase-js';

const McCheckCircleFill = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/mc').then(mod => mod.McCheckCircleFill), { ssr: false })
const McForbidCircleLine = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/mc').then(mod => mod.McForbidCircleLine), { ssr: false })

const Features = ({ session, user } : {session: Session, user: User | null }) => {
  return (
    <div
      onClick={() => {
        const elem = document.getElementById(`feature`);
        elem.style.display = 'none';
      }}
      id="feature"
      className={[styles.backdrop, 'backdrop'].join(' ')}
      onContextMenu={(e) => {e.preventDefault()}} >
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
                2 files per board
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
                Can{"'"}t manage boards
              </div>
            </div>
          </div>

          <div
            title={
              session ? 'You are in this tier' : 'This is a higher tier than yours'
            }
            className={[feature.card, !user?.verified && session ? feature.active : null].join(
              ' '
            )}>
            <h2>User</h2>
            <h4>Users with account can manage their boards</h4>

            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              5 files per board
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
            title="Verified | DM me with the reason to verify and get verified!"
            className={[feature.card, user?.verified ? feature.active : null].join(
              ' '
            )} >
            <h2>Pro</h2>
            <h4>Verified Users get the perks of pro. No subscription.</h4>
            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              10 files per board
            </div>
            <div className={feature.list}>
              <span style={{ color: 'var(--purple)' }}>
                <McCheckCircleFill />
              </span>{' '}
              Nearly No API ratelimits
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
