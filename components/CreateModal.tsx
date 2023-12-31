// NextJS Stuff
import { ChangeEvent, FormEvent } from 'react';

// Styles
import styles from '../styles/Index.module.css';

// Icons
const FaBackward = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaBackward), { ssr: false })
const FaCloudUploadAlt = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaCloudUploadAlt), { ssr: false })

// Our Imports
import dynamic from 'next/dynamic';
import { IconType } from 'react-icons-ng';
import { extensions } from '../utils/extensions';
import { BoardFile } from '../utils/types/board';
import { useContextMenu } from 'react-contexify';

type CreateModalProps = {
  files: BoardFile[];
  setFiles: Function;
  uploadFile: Function;
};

const CreateModal: React.FC<CreateModalProps> = ({
  files,
  setFiles,
  uploadFile,
}) => {
  function updateLanguage(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const box = document.getElementsByClassName(
      'language-show'
    )[0] as HTMLElement;

    const l =
      extensions.find((x) =>
        x.key.includes('.' + value.replace('.', '^').split('^')[1])
      )?.name || 'none';

    box.innerHTML = l.charAt(0).toUpperCase() + l.slice(1);
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target;

    const fls = (target as EventTarget & HTMLInputElement).files;
    uploadFile(fls);
  }

  // Add File ---------------------------------
  function newFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dialog = document.querySelector<HTMLDialogElement>('dialog#newFile');
    const box = document.getElementsByClassName(
      'language-show'
    )[0] as HTMLElement;

    if (event.target[0].value == '') return dialog.close();
    const name = event.target[0].value;

    dialog.close(name);

    if (!name) return alert('Provide a valid name !');
    if (files.find((a) => a.name === name))
      return alert('Name already taken !');
    else {
      setFiles((f) => [
        ...f,
        {
          name: name,
          language: (box.innerText || box.textContent).toLowerCase(),
          value: '',
        },
      ]);
    }
  }

  const { show } = useContextMenu({
    id: 'input',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  return (
    <dialog id="newFile" open={false}>
      <div>
        <button
          title="Back"
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={() => {
            document.querySelector<HTMLDialogElement>('#newFile').close();
          }}
          className={styles.denyCreate}>
          <FaBackward title="Back" />
        </button>
        <h2>Add new file</h2>
        <label
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
          className={styles.upload}>
          <input
            onContextMenu={displayMenu}
            type="file"
            id="file-upload"
            title="Upload"
            multiple={false}
            onChange={(event) => {
              handleUpload(event);
              document.querySelector<HTMLDialogElement>('#newFile').close();
            }}
          />
          <FaCloudUploadAlt title="Upload" />
        </label>
      </div>

      <form method="dialog" onSubmit={(event) => newFile(event)}>
        <input
          onContextMenu={displayMenu}
          autoComplete="off"
          onChange={(event) => updateLanguage(event)}
          className="file-name"
          pattern='^[\w,\s-]+\.[A-Za-z]{3}$'
          id="new-file"
          name="filename"
          type="text"
          placeholder="untitled.js"></input>
        <div style={{padding: 0}} className="tooltip">
          <p>
            <span className="language-show">Javascript</span>
          </p>
          <span
            style={{ maxWidth: 'auto', left: '28%' }}
            className="tooltiptext">
            To change language, just have file extension with file name. Just
            like you do with normal code editor
          </span>
        </div>

        <button title="Create new file" className={styles.create}>
          Create
        </button>
      </form>
    </dialog>
  );
};

export default CreateModal;
// Didnt use Million.block as it breaks its not updating the elements at onChange
