// Icons
import { FaCaretDown } from 'react-icons-ng/fa';

// Our Imports
import { BoardFile } from '../utils/board';

type FileSelectProps = {
  fileName?: string;
  setFileName?: Function;
  file?: BoardFile;
  edit?: boolean;
}

const FileSelect: React.FC<FileSelectProps> = ({ fileName, setFileName, file, edit }) => {
  function showEdit(file: BoardFile) {
    const div = document.getElementsByClassName(
      `edit-${file.name.replaceAll('.', '-')}`
    )[0];
    const back = document.querySelector<HTMLElement>(`.backdrop`);
    (div as HTMLElement).style['display'] = 'flex';
    back.style['display'] = 'block';
  }

  return (
      <button
        title={file.name}
        onClick={() => setFileName(file.name)}
        className={
            file.name === fileName ? 'fileSelect active-file' : 'fileSelect'
        }>
        <div>{file.name}</div>
        <div>
          {edit ? (
            <button className="file" title="Edit" onClick={() => showEdit(file)}>
              <FaCaretDown title="Edit" />
            </button>
          ) : null}
        </div>
      </button>

  );
};

export default FileSelect;
// Didnt use Million.block as it breaks its block rules