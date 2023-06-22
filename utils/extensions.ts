export type ExtensionType = { name: string; key: string[] };

export type ExtensionTypeArray = ExtensionType[];

export const extensions = [
    {
      name: 'angular',
      key: ['.component.ts', '.module.ts'],
    },
    {
      name: 'apl',
      key: ['.apl', '.dyalog'],
    },
    {
      name: 'asciiArmor',
      key: ['.asciidoc', '.adoc', '.asc'],
    },
    {
      name: 'asterisk',
      key: ['.conf'],
    },
    {
      name: 'brainfuck',
      key: ['.b', '.bf'],
    },
    {
      name: 'ceylon',
      key: ['.ceylon'],
    },
    {
      name: 'clojure',
      key: [
        '.clj',
        '.boot',
        '.cl2',
        '.cljc',
        '.cljs',
        '.cljs.hl',
        '.cljscm',
        '.cljx',
        '.hic',
      ],
    },
    {
      name: 'cmake',
      key: ['.cmake', '.cmake.in'],
    },
    {
      name: 'cobol',
      key: ['.cob', '.cbl', '.ccp', '.cobol', '.cpy'],
    },
    {
      name: 'coffeescript',
      key: ['.coffee', '._coffee', '.cake', '.cjsx', '.cson', '.iced'],
    },
    {
      name: 'commonLisp',
      key: ['.lisp', '.asd', '.cl', '.l', '.lsp', '.ny', '.podsl', '.sexp'],
    },
    {
      name: 'cpp',
      key: [
        '.cpp',
        '.c++',
        '.cc',
        '.cp',
        '.cxx',
        '.h',
        '.h++',
        '.hh',
        '.hpp',
        '.hxx',
        '.inc',
        '.inl',
        '.ipp',
        '.tcc',
        '.tpp',
      ],
    },
    {
      name: 'crystal',
      key: ['.cr'],
    },
    {
      name: 'csharp',
      key: ['.cs', '.cake', '.cshtml', '.csx'],
    },
    {
      name: 'css',
      key: ['.css', '.module.css', '.css'],
    },
    {
      name: 'cypher',
      key: ['.cypher', '.cql'],
    },
    {
      name: 'c',
      key: ['.c', '.cats', '.h', '.idc', '.w'],
    },
    {
      name: 'dart',
      key: ['.dart'],
    },
    {
      name: 'diff',
      key: ['.diff', '.patch'],
    },
    {
      name: 'dockerfile',
      key: ['.dockerfile'],
    },
    {
      name: 'dtd',
      key: ['.dtd'],
    },
    {
      name: 'dylan',
      key: ['.dylan', '.dyl', '.intr', '.lid'],
    },
    {
      name: 'd',
      key: ['.d', '.di'],
    },
    {
      name: 'ebnf',
      key: ['.ebnf'],
    },
    {
      name: 'ecl',
      key: ['.ecl', '.eclxml'],
    },
    {
      name: 'eiffel',
      key: ['.e'],
    },
    {
      name: 'elm',
      key: ['.elm'],
    },
    {
      name: 'erlang',
      key: ['.erl', '.es', '.escript', '.hrl', '.xrl', '.yrl'],
    },
    {
      name: 'factor',
      key: ['.factor'],
    },
    {
      name: 'fcl',
      key: ['.fcl'],
    },
    {
      name: 'forth',
      key: ['.fth', '.4th', '.f', '.for', '.forth', '.fr', '.frt', '.fs'],
    },
    {
      name: 'fortran',
      key: ['.f90', '.f', '.f03', '.f08', '.f77', '.f95', '.for', '.fpp'],
    },
    {
      name: 'gas',
      key: ['.s', '.ms'],
    },
    {
      name: 'gherkin',
      key: ['.gherkin'],
    },
    {
      name: 'go',
      key: ['.go'],
    },
    {
      name: 'groovy',
      key: ['.groovy', '.grt', '.gtpl', '.gvy'],
    },
    {
      name: 'haskell',
      key: ['.hs', '.hsc'],
    },
    {
      name: 'haxe',
      key: ['.hx', '.hxsl'],
    },
    {
      name: 'html',
      key: ['.html', '.htm', '.html.hl', '.inc', '.st', '.xht', '.xhtml'],
    },
    {
      name: 'http',
      key: ['.http'],
    },
    {
      name: 'idl',
      key: ['.pro', '.dlm'],
    },
    {
      name: 'java',
      key: ['.java', '.jsp'],
    },
    {
      name: 'javascript',
      key: [
        '.js',
        '.esm.js',
        '.component.js',
        '._js',
        '.bones',
        '.es',
        '.es6',
        '.frag',
        '.gs',
        '.jake',
        '.jsb',
        '.jscad',
        '.jsfl',
        '.jsm',
        '.jss',
        '.njs',
        '.pac',
        '.sjs',
        '.ssjs',
        '.sublime-build',
        '.sublime-commands',
        '.sublime-completions',
        '.sublime-keymap',
        '.sublime-macro',
        '.sublime-menu',
        '.sublime-mousemap',
        '.sublime-project',
        '.sublime-settings',
        '.sublime-theme',
        '.sublime-workspace',
        '.sublime_metrics',
        '.sublime_session',
        '.xsjs',
        '.xsjslib',
      ],
    },
    {
      name: 'jinja2',
      key: [
           ".mustache",
           ".jinja"
        ],
    },
    {
      name: 'json',
      key: [
           ".json",
           ".geojson",
           ".lock",
           ".topojson"
        ],
    },
    {
      name: 'jsx',
      key: ['.jsx'],
    },
    {
      name: 'julia',
      key: ['.jl'],
    },
    {
      name: 'kotlin',
      key: '.kt',
    },
    {
      name: 'less',
      key: '.less',
    },
    {
      name: 'lezer',
      key: '.lezer',
    },
    {
      name: 'livescript',
      key: '.ls',
    },
    {
      name: 'lua',
      key: '.lua',
    },
    {
      name: 'markdown',
      key: '.md',
    },
    {
      name: 'mathematica',
      key: '.m',
    },
    {
      name: 'mbox',
      key: '.mbox',
    },
    {
      name: 'mirc',
      key: '.mirc',
    },
    {
      name: 'modelica',
      key: '.mo',
    },
    {
      name: 'mscgen',
      key: '.msc',
    },
    {
      name: 'mumps',
      key: '.mumps',
    },
    {
      name: 'mysql',
      key: '.mysql',
    },
    {
      name: 'nesC',
      key: '.nc',
    },
    {
      name: 'nginx',
      key: '.nginxconf',
    },
    {
      name: 'nsis',
      key: '.nsi',
    },
    {
      name: 'ntriples',
      key: '.nt',
    },
    {
      name: 'objectiveC',
      key: '.h',
    },
    {
      name: 'objectiveCpp',
      key: '.mm',
    },
    {
      name: 'octave',
      key: '.oct',
    },
    {
      name: 'oz',
      key: '.oz',
    },
    {
      name: 'pascal',
      key: '.pas',
    },
    {
      name: 'perl',
      key: '.al',
    },
    {
      name: 'pgsql',
      key: '.sql',
    },
    {
      name: 'php',
      key: '.php',
    },
    {
      name: 'pig',
      key: '.pig',
    },
    {
      name: 'powershell',
      key: '.ps1',
    },
    {
      name: 'properties',
      key: '.properties',
    },
    {
      name: 'protobuf',
      key: '.proto',
    },
    {
      name: 'puppet',
      key: '.pp',
    },
    {
      name: 'python',
      key: '.py',
    },
    {
      name: 'q',
      key: '.q',
    },
    {
      name: 'r',
      key: '.r',
    },
    {
      name: 'ruby',
      key: '.rb',
    },
    {
      name: 'rust',
      key: '.rs',
    },
    {
      name: 'sas',
      key: '.sas',
    },
    {
      name: 'sass',
      key: '.sass',
    },
    {
      name: 'scala',
      key: '.sc',
    },
    {
      name: 'scheme',
      key: '.scm',
    },
    {
      name: 'shader',
      key: '.shader',
    },
    {
      name: 'shell',
      key: '.sh',
    },
    {
      name: 'sieve',
      key: '.sieve',
    },
    {
      name: 'smalltalk',
      key: '.st',
    },
    {
      name: 'solr',
      key: '.solr',
    },
    {
      name: 'sparql',
      key: '.sparql',
    },
    {
      name: 'spreadsheet',
      key: '.xls',
    },
    {
      name: 'sql',
      key: '.sql',
    },
    {
      name: 'squirrel',
      key: '.nut',
    },
    {
      name: 'stex',
      key: '.stex',
    },
    {
      name: 'stylus',
      key: '.stylus',
    },
    {
      name: 'swift',
      key: '.swift',
    },
    {
      name: 'tcl',
      key: '.tcl',
    },
    {
      name: 'textile',
      key: '.textile',
    },
    {
      name: 'tiddlyWiki',
      key: '.tw',
    },
    {
      name: 'tiki',
      key: '.tiki',
    },
    {
      name: 'toml',
      key: '.toml',
    },
    {
      name: 'troff',
      key: '.troff',
    },
    {
      name: 'tsx',
      key: '.tsx',
    },
    {
      name: 'ttcn',
      key: '.ttcn',
    },
    {
      name: 'turtle',
      key: '.ttl',
    },
    {
      name: 'typescript',
      key: '.ts',
    },
    {
      name: 'vb',
      key: '.vb',
    },
    {
      name: 'vbscript',
      key: '.vbs',
    },
    {
      name: 'velocity',
      key: '.v',
    },
    {
      name: 'verilog',
      key: '.svh',
    },
    {
      name: 'vhdl',
      key: '.vhdl',
    },
    {
      name: 'wast',
      key: '.wast',
    },
    {
      name: 'webIDL',
      key: '.webidl',
    },
    {
      name: 'xQuery',
      key: '.xq',
    },
    {
      name: 'xml',
      key: '.xml',
    },
    {
      name: 'yacas',
      key: '.y',
    },
    {
      name: 'yaml',
      key: '.yaml',
    },
    {
      name: 'z80',
      key: '.z',
    },
  ];