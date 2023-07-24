// Styles
import dynamic from 'next/dynamic';
import styles from '../styles/Index.module.css';

// Icons
const FaCloudUploadAlt = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaCloudUploadAlt), { ssr: false })
const FaWindowClose = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaWindowClose), { ssr: false })

// Our Imports
import { IconType } from 'react-icons-ng';
import { BoardFile } from '../utils/types/board';

type DropZoneProps = {
  files?: BoardFile[];
  drag?: boolean;
  limit?: number;
};

const DropZone: React.FC<DropZoneProps> = ({ files, drag, limit = 2 }) => {
  return (
    <div
      className={[styles.dropzone, styles.backdrop, drag ? 'droppy' : ''].join(
        ' '
      )}>
      <div className={[styles.dropNotif, 'dropNotif'].join(' ')}>
        <h2>{files.length >= limit ? 'Oh no' : 'Drop it.'}</h2>
        <p>
          {files.length >= limit
            ? "You've reached the file limit."
            : "We'll handle the rest !"}
        </p>
        <div
          className={styles.fileUploadBox}
          style={{
            border: `3px dashed ${
              files.length >= limit ? 'var(--red)' : 'var(--background-darker)'
            }`,
            color:
              files.length >= limit ? 'var(--red)' : 'var(--special-color)',
          }}>
          <span style={{ fontSize: '64px', color: 'var(--special-color)' }}>
            {files.length >= limit ? (
              <FaWindowClose
                title="Not Allowed"
                style={{ color: 'var(--red)' }}
              />
            ) : (
              <FaCloudUploadAlt />
            )}
          </span>
          <p>
            {files.length >= limit
              ? `There is a limit of ${limit} files per board. If you have a CodeBoard account, You can upload up to 3 files. So we will not process this file. Delete one file and drop again.`
              : ` We only accept program files and not images/audio/video. Just
                drop it we will handle the rest.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
// Didnt use Million.block as it breaks its block rules
