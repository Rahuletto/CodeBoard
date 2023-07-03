'use client';
// MillionJS
import { block } from 'million/react';

// Icons
import { FaPlus } from 'react-icons-ng/fa';

const UnblockedAddFile = ({ files }) => {
  function showDialog() {
    const dialog = document.getElementById('newFile');

    (dialog as HTMLDialogElement).showModal();
  }

  return (
    <div className="fileSelect plus active-file">
      <button
        title="New file"
        disabled={files.length >= 2}
        onClick={() => {
          if (files.length < 2) showDialog();
        }}>
        <FaPlus title="New File" style={{ fontSize: '22px' }} />
      </button>
    </div>
  );
};

const AddFile = block(UnblockedAddFile, { ssr: false });

export default AddFile;
