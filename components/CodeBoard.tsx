// React
import dynamic from 'next/dynamic';
import React, { Suspense, memo, useEffect } from 'react';

// Lazy import
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  loading: () => <BoardLoader />,
  ssr: false,
});
const CodeMenu = dynamic(() => import('./CodeMenu'), {
  ssr: false,
});

// Themes
const dark = await (
  await import('./utils/DarkTheme')
).default;
const light = await (
  await import('./utils/LightTheme')
).default;

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


import { BoardFile } from '../utils/types/board';
import { useContextMenu } from 'react-contexify';
import BoardLoader from './BoardLoader';


const ext = [
  keymap.of([
    { key: 'Ctrl-Shift-f', run: openSearchPanel },
    ...vscodeKeymap,
  ]),
  indentationMarkers(),
  colorPicker,
]

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

const UnmemoCodeBoard: React.FC<CodeBoardProps> = ({
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
}) => {
  const setup = {
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
  }

  const { show } = useContextMenu({
    id: 'codeboard',
  });

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  function fsc() {
    if (!document.fullscreenElement)
      document
        .getElementsByClassName('codeWrapper')[0]
        .classList.remove('zen');
  }

  function kdc(event) {
    if (
      (event.altKey && event.key.toLowerCase() == 'z') ||
      event.key == 'F8'
    ) {
      if (window.innerHeight == screen.height) {
        document
          .getElementsByClassName('codeWrapper')[0]
          .classList.remove('zen');
        document.exitFullscreen();
      } else {
        document
          .getElementsByClassName('codeWrapper')[0]
          .classList.add('zen');
        document.documentElement.requestFullscreen();
      }
    } else if (event.key == 'Escape') {
      document
        .getElementsByClassName('codeWrapper')[0]
        .classList.remove('zen');
    }
  }

  useEffect(() => {
    window.addEventListener('fullscreenchange', fsc);
    window.addEventListener('keydown', kdc);
  }, []);

  return (
    <Suspense fallback={<BoardLoader />}>
      <CodeMirror
        id="code-board"
        onContextMenu={displayMenu}
        placeholder={placeHolder || 'Paste your code here.'}
        theme={
          theme == 'light'
            ? light
            : dark
        }
        style={styleProp || { pointerEvents: 'auto' }}
        value={code}
        width={width || 'auto'}
        height={height || '200px'}
        readOnly={readOnly}
        extensions={language ? [...ext, language] : ext}
        onChange={onChange}
        draggable={false}
        aria-label="codeboard"
        basicSetup={setup}
      />

      <CodeMenu readOnly={readOnly} />
    </Suspense>
  );
};

export default memo(function CodeBoard(props: CodeBoardProps) {
  return <UnmemoCodeBoard {...props} />;
});
