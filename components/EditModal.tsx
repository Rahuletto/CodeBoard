// ReactJS stuff
import { ChangeEvent, FormEvent } from 'react';

// Our Imports
import { BoardFile } from '../utils/types/board';
import { extensions } from '../utils/extensions';

type FileSelectProps = {
  fileName?: string;
  setFileName?: Function;
  currentFile?: BoardFile;
  files?: BoardFile[];
  setFiles?: Function;
};

const EditModal: React.FC<FileSelectProps> = ({
  fileName,
  setFileName,
  currentFile,
  files,
  setFiles,
}) => {
  function closeEdit() {
    const div = document.querySelectorAll(`div.edit`);
    const back = document.querySelector<HTMLElement>(`.backdrop`);

    div.forEach((cls) => {
      (cls as HTMLElement).style['display'] = 'none';
    });
    back.style['display'] = 'none';
  }

  function edit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    closeEdit();

    const input = document.querySelector<HTMLInputElement>(
      `.edit-${fileName.replaceAll('.', '-')}.edit form input`
    );
    if (!input) return;
    const name = input.value;

    const file = files.find((a) => a.name == fileName);

    const box = document.getElementsByClassName(`${fileName}-language`)[0];

    if (!name) return;
    if (files.find((a) => a.name === name))
      return alert('Name already taken !');
    else {
      file.name = name;
      file.language = (
        (box as HTMLElement).innerText || box.textContent
      ).toLowerCase();

      setFileName(name);
    }
  }

  function updateEditLanguage(e: ChangeEvent<HTMLInputElement>, old) {
    const value = e.target.value;
    const box = document.getElementsByClassName(`${old}-language`)[0];

    if (!box) return;

    const language =
      extensions.find((x) =>
        x.key.includes('.' + value.replace('.', '^').split('^')[1])
      )?.name ||
      extensions.find((x) =>
        x.key.includes('.' + value.split('.')[value.split('.').length - 1])
      )?.name ||
      'none';

    box.innerHTML = language.charAt(0).toUpperCase() + language.slice(1);
  }

  function deleteFile(name: string) {
    const removed = files.filter(function (item) {
      return item.name !== name;
    });

    setFileName(removed[0].name);

    setFiles(removed);
  }

  return (
    <div className={`edit-${currentFile.name.replaceAll('.', '-')} edit`}>
      {' '}
      <form className="editForm" onSubmit={(event) => edit(event)}>
        <input
          onChange={(event) => updateEditLanguage(event, currentFile.name)}
          className="file-name"
          name="filename"
          type="text"
          placeholder={currentFile.name}
          autoComplete="off"></input>
        <div style={{padding: 0}} className="tooltip">
          <p>
            <span
              className={[
                'language-show-edit',
                currentFile.name + '-language',
              ].join(' ')}>
              {currentFile.language.charAt(0).toUpperCase() +
                currentFile.language.slice(1)}
            </span>
          </p>
          <span style={{maxWidth: 'auto', left: '28%'}} className="tooltiptext">To change language, just have file extension with file name. Just like you do with normal code editor</span>
        </div>

        <button
          title="Delete the file"
          disabled={files.length == 1}
          onClick={() => setTimeout(() => deleteFile(currentFile.name), 400)}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditModal;
// Didnt use Million.block as it completely breaks apart
