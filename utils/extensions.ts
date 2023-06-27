export type ExtensionType = { name: string; key: string[] };

export type ExtensionTypeArray = ExtensionType[];

export const extensions = [
  {
    name: 'angular',
    key: ['.component.html'],
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
    key: ['.mustache', '.jinja'],
  },
  {
    name: 'json',
    key: ['.json', '.geojson', '.lock', '.topojson'],
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
    key: ['.kt', '.ktm', '.kts'],
  },
  {
    name: 'less',
    key: ['.less'],
  },
  {
    name: 'lezer',
    key: ['.lezer'],
  },
  {
    name: 'livescript',
    key: ['.ls', '._ls'],
  },
  {
    name: 'lua',
    key: ['.lua', '.fcgi', '.nse', '.pd_lua', '.rbxs', '.wlua'],
  },
  {
    name: 'markdown',
    key: ['.md', '.markdown', '.mkd', '.mkdn', '.mkdown', '.ron'],
  },
  {
    name: 'mathematica',
    key: [
      '.mathematica',
      '.cdf',
      '.m',
      '.ma',
      '.mt',
      '.nb',
      '.nbp',
      '.wl',
      '.wlt',
    ],
  },
  {
    name: 'mbox',
    key: ['.mbox'],
  },
  {
    name: 'mirc',
    key: ['.mirc'],
  },
  {
    name: 'modelica',
    key: ['.mo'],
  },
  {
    name: 'mscgen',
    key: ['.msc'],
  },
  {
    name: 'mumps',
    key: ['.mumps'],
  },
  {
    name: 'mysql',
    key: ['.mysql', '.cnf', '.frm', '.mrg', '.myd', '.myi'],
  },
  {
    name: 'nesC',
    key: ['.nc'],
  },
  {
    name: 'nginx',
    key: ['.nginxconf', '.vhost'],
  },
  {
    name: 'nsis',
    key: ['.nsi', '.nsh'],
  },
  {
    name: 'ntriples',
    key: ['.nt'],
  },
  {
    name: 'objectiveC',
    key: ['.m', '.h'],
  },
  {
    name: 'objectiveCpp',
    key: ['.mm'],
  },
  {
    name: 'octave',
    key: ['.oct'],
  },
  {
    name: 'oz',
    key: ['.oz'],
  },
  {
    name: 'pascal',
    key: ['.pas', '.dfm', '.dpr', '.inc', '.lpr', '.pp'],
  },
  {
    name: 'perl',
    key: [
      '.pl',
      '.al',
      '.cgi',
      '.fcgi',
      '.perl',
      '.ph',
      '.plx',
      '.pm',
      '.pod',
      '.psgi',
      '.t',
    ],
  },
  {
    name: 'pgsql',
    key: ['.spsql', '.dbu', '.mkd'],
  },
  {
    name: 'php',
    key: [
      '.php',
      '.aw',
      '.ctp',
      '.fcgi',
      '.inc',
      '.php3',
      '.php4',
      '.php5',
      '.phps',
      '.phpt',
    ],
  },
  {
    name: 'pig',
    key: ['.pig'],
  },
  {
    name: 'powershell',
    key: ['.ps1', '.psd1', '.psm1'],
  },
  {
    name: 'properties',
    key: ['.ini', '.cfg', '.prefs', '.pro', '.properties'],
  },
  {
    name: 'protobuf',
    key: ['.proto'],
  },
  {
    name: 'puppet',
    key: ['.pp'],
  },
  {
    name: 'python',
    key: [
      '.py',
      '.bzl',
      '.cgi',
      '.fcgi',
      '.gyp',
      '.lmi',
      '.pyde',
      '.pyp',
      '.pyt',
      '.pyw',
      '.rpy',
      '.tac',
      '.wsgi',
      '.xpy',
      '.pytb',
    ],
  },
  {
    name: 'r',
    key: ['.r', '.rd', '.rsx'],
  },
  {
    name: 'ruby',
    key: [
      '.rb',
      '.rl',
      '.builder',
      '.fcgi',
      '.gemspec',
      '.god',
      '.irbrc',
      '.jbuilder',
      '.mspec',
      '.pluginspec',
      '.podspec',
      '.rabl',
      '.rake',
      '.rbuild',
      '.rbw',
      '.rbx',
      '.ru',
      '.ruby',
      '.thor',
      '.watchr',
    ],
  },
  {
    name: 'rust',
    key: ['.rs', '.rs.in'],
  },
  {
    name: 'sas',
    key: ['.sas'],
  },
  {
    name: 'sass',
    key: ['.sass'],
  },
  {
    name: 'scala',
    key: ['.scala', '.sbt', '.sc'],
  },
  {
    name: 'scheme',
    key: ['.scm', '.sld', '.sls', '.sps', '.ss'],
  },
  {
    name: 'shader',
    key: [
      '.glsl',
      '.fp',
      '.frag',
      '.frg',
      '.fs',
      '.fsh',
      '.fshader',
      '.geo',
      '.geom',
      '.glslv',
      '.gshader',
      '.shader',
      '.vert',
      '.vrx',
      '.vsh',
      '.vshader',
    ],
  },
  {
    name: 'shell',
    key: [
      '.sh',
      '.bash',
      '.bats',
      '.cgi',
      '.command',
      '.fcgi',
      '.ksh',
      '.sh.in',
      '.tmux',
      '.tool',
      '.zsh',
      '.sh-session',
    ],
  },
  {
    name: 'sieve',
    key: ['.sieve'],
  },
  {
    name: 'smalltalk',
    key: ['.st', '.cs'],
  },
  {
    name: 'solr',
    key: ['.solr'],
  },
  {
    name: 'sparql',
    key: ['.sparql', '.rq'],
  },
  {
    name: 'spreadsheet',
    key: ['.xls', '.xlsx', '.xlsb'],
  },
  {
    name: 'sql',
    key: ['.sql', '.cql', '.ddl', '.inc', '.prc', '.tab', '.udf', '.viw'],
  },
  {
    name: 'squirrel',
    key: ['.nut'],
  },
  {
    name: 'stex',
    key: [
      '.stex',
      '.tex',
      '.aux',
      '.bbx',
      '.bib',
      '.cbx',
      '.cls',
      '.dtx',
      '.ins',
      '.lbx',
      '.ltx',
      '.mkii',
      '.mkiv',
      '.mkvi',
      '.sty',
      '.toc',
    ],
  },
  {
    name: 'stylus',
    key: ['.styl'],
  },
  {
    name: 'swift',
    key: ['.swift'],
  },
  {
    name: 'tcl',
    key: ['.tcl', '.adp', '.tm'],
  },
  {
    name: 'textile',
    key: ['.textile'],
  },
  {
    name: 'tiddlyWiki',
    key: ['.tw', '.tid', '.tiddlywiki'],
  },
  {
    name: 'tiki',
    key: ['.tiki'],
  },
  {
    name: 'toml',
    key: ['.toml'],
  },
  {
    name: 'troff',
    key: ['.troff'],
  },
  {
    name: 'tsx',
    key: ['.tsx'],
  },
  {
    name: 'ttcn',
    key: ['.ttcn'],
  },
  {
    name: 'turtle',
    key: ['.ttl'],
  },
  {
    name: 'typescript',
    key: ['.ts', '.component.ts', '.module.ts'],
  },
  {
    name: 'vb',
    key: ['.vb', '.bas', '.cls', '.frm', '.frx', '.vba', '.vbhtml'],
  },
  {
    name: 'vbscript',
    key: ['.vbs'],
  },
  {
    name: 'velocity',
    key: ['.vm', '.vt', ',vtl'],
  },
  {
    name: 'verilog',
    key: ['.sv', '.svh', '.vh', '.v', '.veo'],
  },
  {
    name: 'vhdl',
    key: ['.vhdl', '.vhd', '.vhf', '.vhi', '.vho', '.vhs', '.vht', '.vhw'],
  },
  {
    name: 'wast',
    key: ['.wast', '.wat'],
  },
  {
    name: 'webIDL',
    key: ['.webidl'],
  },
  {
    name: 'xQuery',
    key: ['.xquery', '.xq', '.xql', '.xqm', '.xqy'],
  },
  {
    name: 'xml',
    key: [
      '.xml',
      '.ant',
      '.axml',
      '.ccxml',
      '.clixml',
      '.cproject',
      '.csl',
      '.csproj',
      '.ct',
      '.dita',
      '.ditamap',
      '.ditaval',
      '.dll.config',
      '.dotsettings',
      '.filters',
      '.fsproj',
      '.fxml',
      '.glade',
      '.gml',
      '.grxml',
      '.iml',
      '.ivy',
      '.jelly',
      '.jsproj',
      '.kml',
      '.launch',
      '.mdpolicy',
      '.mm',
      '.mod',
      '.mxml',
      '.nproj',
      '.nuspec',
      '.odd',
      '.osm',
      '.plist',
      '.pluginspec',
      '.props',
      '.ps1xml',
      '.psc1',
      '.pt',
      '.rdf',
      '.rss',
      '.scxml',
      '.srdf',
      '.storyboard',
      '.stTheme',
      '.sublime-snippet',
      '.targets',
      '.tmCommand',
      '.tml',
      '.tmLanguage',
      '.tmPreferences',
      '.tmSnippet',
      '.tmTheme',
      '.ts',
      '.tsx',
      '.ui',
      '.urdf',
      '.ux',
      '.vbproj',
      '.vcxproj',
      '.vssettings',
      '.vxml',
      '.wsdl',
      '.wsf',
      '.wxi',
      '.wxl',
      '.wxs',
      '.x3d',
      '.xacro',
      '.xaml',
      '.xib',
      '.xlf',
      '.xliff',
      '.xmi',
      '.xml.dist',
      '.xproj',
      '.xsd',
      '.xul',
      '.zcml',
    ],
  },
  {
    name: 'yacas',
    key: ['.y', '.yacc', '.yy'],
  },
  {
    name: 'yaml',
    key: [
      '.yml',
      '.reek',
      '.rviz',
      '.sublime-syntax',
      '.syntax',
      '.yaml',
      '.yaml-tmlanguage',
    ],
  },
  {
    name: 'z80',
    key: ['.z'],
  },
];
