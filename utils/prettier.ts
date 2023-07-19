export const formatCode = async (code: string, language: string) => {
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
