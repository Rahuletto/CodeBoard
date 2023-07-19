// Icons
import { FaPlus } from 'react-icons-ng/fa';

const AddFile = ({ files, limit = 2 }) => {
  function showDialog() {
    const dialog = document.getElementById('newFile');
    const input = document.getElementById('new-file');
    (input as HTMLInputElement).focus();
    (dialog as HTMLDialogElement).showModal();
  }

  function showAd() {
    const box = document.getElementById('feature');

    (box as HTMLElement).style.display = 'flex';
  }

  return (
    <div className="fileSelect plus active-file">
      <button
      id="add-file"
        title="New file"
        onClick={() => {
          if (files.length >= limit) showAd();
          else if (files.length < limit) showDialog();
        }}>
        <FaPlus title="New File" style={{ fontSize: '22px' }} />
      </button>
    </div>
  );
};

export default AddFile;
