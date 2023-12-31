// Icons
import dynamic from 'next/dynamic';
const SiPrettier = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/si').then((mod) => mod.SiPrettier),
  { ssr: false }
);

const PrettierMenu = dynamic(() => import('./menus/PrettierMenu'), {
  ssr: false,
});

// Styles
import styles from '../styles/Index.module.css';
import { formatCode } from '../utils/prettier';

// Our Imports
import { IconType } from 'react-icons-ng';
import { BoardFile } from '../utils/types/board';
import { useContextMenu } from 'react-contexify';

import Skeleton from "react-loading-skeleton";
import { Suspense } from 'react';

type PrettierButtonProps = {
  code: string;
  file: BoardFile;
  setCode: Function;
};

const PrettierButton: React.FC<PrettierButtonProps> = ({
  code,
  file,
  setCode,
}) => {
  const { show } = useContextMenu({
    id: 'prettier',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  return (
    <Suspense fallback={<Skeleton />}>
      <PrettierMenu />
      <div className={styles.prettier} onContextMenu={displayMenu}>
        <button
          title="Format the code"
          id="pretty"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '20px',
          }}
          onClick={(event) => {
            const colors = ['#f8bc45', '#c596c7', '#56b3b4'];

            (event.target as HTMLElement).style.color =
              colors[Math.floor(Math.random() * colors.length)];

            formatCode(code, file.language)
              .then((formatted) => {
                file.value = formatted;
                setCode(formatted);

                (event.target as HTMLElement).style.color = 'var(--green)';

                setInterval(() => {
                  (event.target as HTMLElement).style.color =
                    'var(--special-color)';
                }, 5000);
              })
              .catch((err) => {
                (event.target as HTMLElement).style.color = '#ea5e5e';
                console.warn(err);
              });
          }}>
          <SiPrettier title="Format with Prettier" />
        </button>
      </div>
    </Suspense>
  );
};

export default PrettierButton;
