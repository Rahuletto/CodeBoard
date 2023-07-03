// Styles
import styles from '../styles/Index.module.css';

// Icons
import { FaCloudUploadAlt, FaWindowClose } from 'react-icons-ng/fa';

// Our Imports
import { BoardFile } from '../utils/board';

type DropZoneProps = {
  files?: BoardFile[];
  drag?: boolean;
};

const DropZone: React.FC<DropZoneProps> = ({ files, drag }) => {

  return (
    <div
      className={[styles.dropzone, styles.backdrop, drag ? 'droppy' : ''].join(
        ' '
      )}>
      <div className={[styles.dropNotif, 'dropNotif'].join(' ')}>
        <h2>{files.length >= 2 ? 'Oh no' : 'Drop it.'}</h2>
        <p>
          {files.length >= 2
            ? "You've reached the file limit."
            : "We'll handle the rest !"}
        </p>
        <div
          className={styles.fileUploadBox}
          style={{
            border: `3px dashed ${
              files.length >= 2 ? 'var(--red)' : 'var(--background-darker)'
            }`,
            color: files.length >= 2 ? 'var(--red)' : 'var(--special-color)',
          }}>
          <span style={{ fontSize: '64px', color: 'var(--special-color)' }}>
            {files.length >= 2 ? (
              <FaWindowClose
                title="Not Allowed"
                style={{ color: 'var(--red)' }}
              />
            ) : (
              <FaCloudUploadAlt />
            )}
          </span>
          <p>
            {files.length >= 2
              ? `There is a limit of 2 files per board at the moment. So we will not process this file. Delete one file and drop again.`
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