// Icons
import { FaCaretDown } from 'react-icons-ng/fa';

// Our Imports
import { BoardFile } from '../utils/types/board';

type FileSelectProps = {
  fileName?: string;
  setFileName?: Function;
  file?: BoardFile;
  edit?: boolean;
};

const FileSelect: React.FC<FileSelectProps> = ({
  fileName,
  setFileName,
  file,
  edit,
}) => {
  function showEdit(file: BoardFile) {
    const div = document.getElementsByClassName(
      `edit-${file.name.replaceAll('.', '-')}`
    )[0];
    const back = document.querySelector<HTMLElement>(`.backdrop`);
    (div as HTMLElement).style['display'] = 'flex';
    back.style['display'] = 'block';
  }

  return (
    <div
      onClick={() => setFileName(file.name)}
      className={
        file.name === fileName ? 'fileSelect active-file' : 'fileSelect'
      }>
      <button
        title={file.name}
        
        >
        <div>{file.name}</div>
      </button>

      <div>
          {edit ? (
            <button
              className="file"
              title="Edit"
              onClick={() => showEdit(file)}>
              <FaCaretDown title="Edit" />
            </button>
          ) : null}
        </div>
    </div>
  );
};

export default FileSelect;
// Didnt use Million.block as it breaks its block rules
