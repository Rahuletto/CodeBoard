import { block } from 'million/react';
import { FaPlus } from 'react-icons-ng/fa';

const UnblockedAddFile = ({ files }) => {
  function showDialog() {
    const dialog = document.querySelector<HTMLDialogElement>('dialog#newFile');

    dialog.showModal();
  }

  return (
    <div className="fileSelect plus active-file">
      <button
        title="New file"
        disabled={files.length >= 2}
        onClick={() => showDialog()}>
        <FaPlus title="New File" style={{ fontSize: '22px' }} />
      </button>
    </div>
  );
};

const AddFile = block(UnblockedAddFile, { ssr: false });

export default AddFile;
