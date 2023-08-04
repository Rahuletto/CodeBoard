import dynamic from 'next/dynamic';
import { Item, Menu, RightSlot, Separator } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import { IconType } from 'react-icons-ng';

const BiCommand = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/bi').then((mod) => mod.BiCommand),
  { ssr: true }
);
const BiSolidCopy = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/bi').then((mod) => mod.BiSolidCopy),
  { ssr: true }
);

const FlFillIcFluentCut24Filled = dynamic<React.ComponentProps<IconType>>(
  () =>
    import('react-icons-ng/fl').then((mod) => mod.FlFillIcFluentCut24Filled),
  { ssr: true }
);

const LuClipboardPaste = dynamic<React.ComponentProps<IconType>>(
  () => import('react-icons-ng/lu').then((mod) => mod.LuClipboardPaste),
  { ssr: true }
);

const InputMenu = () => {
  return (
    <Menu id={'input'}>
      <Item onClick={() => document.execCommand('cut')}>
        <FlFillIcFluentCut24Filled style={{ marginRight: '8px' }} /> Cut{' '}
        <RightSlot className="key">
          <span className="ctrl">Ctrl</span> <span className="x">X</span>
        </RightSlot>
      </Item>
      <Item onClick={() => document.execCommand('copy')}>
        <BiSolidCopy style={{ marginRight: '8px' }} /> Copy{' '}
        <RightSlot className="key">
          <span className="ctrl">Ctrl</span> <span className="c">C</span>
        </RightSlot>
      </Item>
      <Item
        onClick={async () => {
          document.execCommand(
            'insertText',
            true /*no UI*/,
            await navigator.clipboard.readText()
          );
        }}>
        <LuClipboardPaste style={{ marginRight: '8px' }} /> Paste
        <RightSlot className="key">
          <span className="ctrl">Ctrl</span> <span className="v">V</span>
        </RightSlot>
      </Item>

      <Separator />

      <Item
        onClick={() => {
          document.dispatchEvent(
            new KeyboardEvent('keydown', {
              ctrlKey: true,
              key: 'k',
            })
          );
        }}>
        <BiCommand style={{ marginRight: '8px' }} /> Cmd Pallete{' '}
        <RightSlot className="key">
          <span className="ctrl">Ctrl</span> <span className="k">K</span>
        </RightSlot>
      </Item>
    </Menu>
  );
};

export default InputMenu;
