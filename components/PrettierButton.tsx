// MillionJS
import { block } from 'million/react';

// Icons
import { SiPrettier } from 'react-icons-ng/si';

// Styles
import styles from '../styles/Index.module.css';

// Our Imports
import { BoardFile } from '../utils/board';

type PrettierButtonProps = {
  code: string;
  file: BoardFile;
  setCode: Function;
};

const UnblockedPrettierButton: React.FC<PrettierButtonProps> = ({
  code,
  file,
  setCode,
}) => {
  return (
    <div className={styles.prettier}>
      <button
        title="Format the code"
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
              console.log(err);
            });
        }}>
        <SiPrettier title="Format with Prettier" />
      </button>
    </div>
  );
};

const PrettierButton = block(UnblockedPrettierButton, { ssr: false });
export default PrettierButton;

// Formatting code with Prettier
const formatCode = async (code: string, language: string) => {
  const prettier = await import('prettier/standalone');
  const babylonParser = await import('prettier/parser-babel');
  const css = await import('prettier/parser-postcss');
  const html = await import('prettier/parser-html');
  const angular = await import('prettier/parser-angular');
  const markdown = await import('prettier/parser-markdown');
  const typescript = await import('prettier/parser-typescript');
  const yaml = await import('prettier/parser-yaml');

  let parser = 'babel';

  switch (language) {
    case 'angular':
      parser = 'angular';
      break;
    case 'css':
      parser = 'css';
      break;
    case 'markdown':
    case 'mdx':
      parser = 'markdown';
      break;
    case 'html':
      parser = 'html';
      break;
    case 'typescript':
    case 'tsx':
      parser = 'typescript';
      break;
    case 'yaml':
      parser = 'yaml';
      break;
    default:
      parser = 'babel';
      break;
  }

  return prettier.format(code, {
    parser: parser,
    plugins: [babylonParser, css, html, markdown, typescript, yaml, angular],
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
    bracketSameLine: true,
    endOfLine: 'auto',
  });
};
