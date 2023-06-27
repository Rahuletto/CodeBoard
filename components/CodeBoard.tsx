// CodeMirror
import { atomoneInit } from '@uiw/codemirror-theme-atomone';
import { githubLightInit } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';
import { tags as t } from '@lezer/highlight';

// React
import React from 'react';

// Props
interface CodeBoardProps {
  language?: Function | any;
  code?: string;
  theme?: 'light' | 'dark' | string;
  onChange?: Function | any;
  readOnly?: boolean;
  height?: string;
  width?: string;
}

const CodeBoard: React.FC<CodeBoardProps> = ({
  language,
  code,
  theme,
  onChange,
  readOnly,
  height,
  width,
}) => {
  
  return (
    <>
      <CodeMirror
        placeholder="Paste your code here."
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
                ],
              })
        }
        value={code}
        width={width || 'auto'}
        height={height || '200px'}
        readOnly={readOnly}
        extensions={[language, hyperLink]}
        onChange={onChange}
        aria-label="code"
        basicSetup={{
          foldGutter: true,
          closeBrackets: true,
          bracketMatching: true,
          autocompletion: true,
          highlightActiveLine: true,
          highlightSpecialChars: true,
          syntaxHighlighting: true,
          searchKeymap: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          lintKeymap: true,
          drawSelection: true,
        }}
      />
    </>
  );
};

export default CodeBoard;
