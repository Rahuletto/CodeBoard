// React
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import Skeleton from 'react-loading-skeleton';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  loading: () => <BoardLoader />,
  ssr: false,
});
const atomoneInit = await (
  await import('@uiw/codemirror-theme-atomone')
).atomoneInit;
const githubLightInit = await (
  await import('@uiw/codemirror-theme-github')
).githubLightInit;
const hyperLink = await (
  await import('@uiw/codemirror-extensions-hyper-link')
).hyperLink;
const t = await (await import('@lezer/highlight')).tags;
const vscodeKeymap = await (
  await import('@replit/codemirror-vscode-keymap')
).vscodeKeymap;
const indentationMarkers = await (
  await import('@replit/codemirror-indentation-markers')
).indentationMarkers;
const keymap = await (await import('@codemirror/view')).keymap;
const openSearchPanel = await (
  await import('@codemirror/search')
).openSearchPanel;
const colorPicker = await (
  await import('@replit/codemirror-css-color-picker')
).colorPicker;

import {
  Menu,
  Item,
  Separator,
  useContextMenu,
  RightSlot,
} from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';

import { BiSearch, BiSolidCopy } from 'react-icons-ng/bi';
import { FlFillIcFluentCut24Filled } from 'react-icons-ng/fl';
import { LuClipboardPaste } from 'react-icons-ng/lu';
import { CoExpand } from 'react-icons-ng/co';
import { SiPrettier } from 'react-icons-ng/si';
import { formatCode } from '../utils/prettier';
import { BoardFile } from '../utils/types/board';

// Props
type CodeBoardProps = {
  language?: any;
  code?: string;
  theme?: 'light' | 'dark' | string;
  onChange?: Function | any;
  readOnly?: boolean;
  height?: string;
  width?: string;
  styleProp?: any;
  placeHolder?: string;
  output?: boolean;
  file?: BoardFile;
};

const CodeBoard: React.FC<CodeBoardProps> = ({
  language,
  code,
  theme,
  onChange,
  readOnly,
  height,
  width,
  styleProp,
  placeHolder,
  output,
  file,
}) => {
  const { show } = useContextMenu({
    id: 'codeboard',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  return (
    <Suspense fallback={<BoardLoader />}>
      <CodeMirror
        id="code"
        onContextMenu={displayMenu}
        placeholder={placeHolder || 'Paste your code here.'}
        theme={
          theme == 'light'
            ? githubLightInit({
                settings: {
                  background: '#F6F6F6',
                  gutterBackground: '#F1F1F1',
                },
              })
            : atomoneInit({
                settings: {
                  foreground: '#ABB2BF',
                  selection: '#646464',
                  selectionMatch: '#646464',
                  caret: '#C6C6C6',
                  fontFamily: 'JetBrains Mono',
                },
                styles: [
                  { tag: t.content, color: '#7D8799' },
                  { tag: t.processingInstruction, color: '#98C379' },
                  { tag: t.name, color: '#61AFEF' },
                  { tag: t.variableName, color: '#D19A66' },
                  { tag: t.definitionOperator, color: '#56B6C2' },
                  { tag: t.propertyName, color: '#E06C75' },
                  { tag: t.punctuation, color: '#C678DD' },
                  { tag: t.brace, color: '#ABB2BF' },
                  { tag: t.paren, color: '#ABB2BF' },
                  { tag: t.angleBracket, color: '#ABB2BF' },
                  { tag: t.variableName, color: '#E06C75' },
                  { tag: t.definition(t.variableName), color: '#D19A66' },
                  { tag: t.color, color: '#D19A66' },
                  { tag: t.bool, color: '#D19A66' },
                ],
              })
        }
        style={styleProp || { pointerEvents: 'auto' }}
        value={code}
        width={width || 'auto'}
        height={height || '200px'}
        readOnly={readOnly}
        extensions={[
          keymap.of([...vscodeKeymap, { key: 'Ctrl-Shift-f', run: openSearchPanel }]),
          language,
          hyperLink,

          indentationMarkers(),
          colorPicker,
        ]}
        onChange={onChange}
        draggable={false}
        aria-label="code"
        basicSetup={{
          defaultKeymap: false,
          foldGutter: true,
          closeBrackets: true,
          bracketMatching: true,
          autocompletion: true,
          highlightActiveLine: true,
          highlightSpecialChars: true,
          syntaxHighlighting: true,
          searchKeymap: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          lintKeymap: false,
          drawSelection: true,
          completionKeymap: false,
          history: true,
          historyKeymap: false,
          lineNumbers: !output,
        }}
      />

      <Menu id={'codeboard'}>
        <Item
          onClick={() =>
            document
              .getElementById('code')
              .dispatchEvent(
                new KeyboardEvent('keydown', { ctrlKey: true, key: 'f' })
              )
          }>
          <BiSearch style={{ marginRight: '8px' }} /> Find
        </Item>

        <Item
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent('keydown', {
                shiftKey: true,
                altKey: true,
                key: 'f',
              })
            )
          }>
          <SiPrettier style={{ marginRight: '8px' }} /> Format code
        </Item>

        <Item onClick={() => document.documentElement.requestFullscreen()}>
          <CoExpand style={{ marginRight: '8px' }} /> Toggle fullscreen
        </Item>

        <Separator />
        <Item onClick={() => document.execCommand('cut')}>
          <FlFillIcFluentCut24Filled style={{ marginRight: '8px' }} /> Cut{' '}
          <RightSlot className="key">
            <span>Ctrl</span> <span>X</span>
          </RightSlot>
        </Item>
        <Item onClick={() => document.execCommand('copy')}>
          <BiSolidCopy style={{ marginRight: '8px' }} /> Copy{' '}
          <RightSlot className="key">
            <span>Ctrl</span> <span>C</span>
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
            <span>Ctrl</span> <span>V</span>
          </RightSlot>
        </Item>
      </Menu>
    </Suspense>
  );
};

export default CodeBoard;

export function BoardLoader() {
  return (
    <div style={{ padding: '8px 20px' }}>
      <Skeleton style={{ width: '400px' }} />
      <br></br>
      <Skeleton style={{ width: '200px' }} />
      <Skeleton style={{ width: '300px' }} />
      <br></br>
      <Skeleton style={{ width: '600px' }} />
      <Skeleton style={{ width: '160px' }} />
      <Skeleton style={{ width: '60px' }} />
    </div>
  );
}
