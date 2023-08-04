// Icons
import dynamic from 'next/dynamic';
import { IconType } from 'react-icons-ng';

const FaPlus = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/fa').then((mod) => mod.FaPlus),
  { ssr: false }
);

const AddMenu = dynamic(() => import('./menus/AddMenu'), {
  ssr: false,
});

import Skeleton from 'react-loading-skeleton';
import { Suspense } from 'react';
import { useContextMenu } from 'react-contexify';

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

  const { show } = useContextMenu({
    id: 'newfile',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  return (
    <Suspense fallback={<Skeleton />}>
      <AddMenu limit={limit} />
      <div onContextMenu={displayMenu} className="fileSelect plus active-file">
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
    </Suspense>
  );
};

export default AddFile;
