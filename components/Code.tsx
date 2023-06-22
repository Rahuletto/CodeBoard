import { atomone, atomoneInit } from "@uiw/codemirror-theme-atomone";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { langs, loadLanguage } from "@uiw/codemirror-extensions-langs";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";


export default function CodeBoard({language, code, theme, onChange, readOnly, height, width }) {
  return (
    <>
    <CodeMirror
              placeholder="Paste your code here."
              theme={
                theme == "light"
                  ? githubLight
                  : atomoneInit({
                      settings: {
                        caret: "#c6c6c6",
                        fontFamily: "JetBrains Mono",
                      },
                      styles: [],
                    })
              }
              value={code}
              width={width || "auto"}
              height={height || "200px"}
              readOnly={readOnly}
              extensions={[language, hyperLink]}
              onChange={onChange}
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
                search: true,
                lintKeymap: true,
                drawSelection: true,
              }}
            />
    </>
  )
}