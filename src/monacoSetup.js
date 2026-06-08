import * as monaco from 'monaco-editor'

monaco.editor.defineTheme('monokai', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment',              foreground: '676f7d', fontStyle: 'italic' },
    { token: 'keyword',              foreground: 'e06c75' },
    { token: 'entity.name.function', foreground: '98c379' },
    { token: 'entity.name.class',    foreground: '61afef' },
    { token: 'support.function',     foreground: '56b6c2' },
    { token: 'constant.language',    foreground: '56b6c2' },
    { token: 'string',               foreground: 'e5c07b' },
    { token: 'string.escape',        foreground: 'e5c07b' },
    { token: 'number',               foreground: 'c678dd' },
    { token: 'number.hex',           foreground: 'c678dd' },
    { token: 'tag',                  foreground: 'e06c75' },
    { token: 'identifier',           foreground: 'abb2bf' },
    { token: 'delimiter',            foreground: 'abb2bf' },
    { token: 'delimiter.curly',      foreground: 'abb2bf' },
    { token: 'delimiter.bracket',    foreground: 'abb2bf' },
    { token: 'delimiter.parenthesis',foreground: 'abb2bf' },
  ],
  colors: {
    'editor.background':            '#282c34',
    'editor.foreground':            '#abb2bf',
    'editor.lineHighlightBackground':'#383E4A',
    'editor.selectionBackground':   '#3E4451',
    'editorCursor.foreground':      '#f8f8f0',
    'editorLineNumber.foreground':  '#495162',
  },
})

// Custom Python tokenizer that tracks state after `def`/`class` so function
// and class names get distinct token types (Monaco's built-in doesn't do this).
monaco.languages.setMonarchTokensProvider('python', {
  defaultToken: '',
  tokenPostfix: '.python',

  keywords: [
    'and', 'as', 'assert', 'async', 'await', 'break', 'continue',
    'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
    'global', 'if', 'import', 'in', 'is', 'lambda', 'match', 'case',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
    'type', 'while', 'with', 'yield',
  ],

  constants: ['True', 'False', 'None'],

  builtins: [
    'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'callable', 'chr',
    'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod',
    'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset',
    'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input',
    'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals',
    'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open',
    'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round',
    'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum',
    'super', 'tuple', 'vars', 'zip',
  ],

  brackets: [
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.bracket' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
  ],

  tokenizer: {
    root: [
      [/def\b/,   { token: 'keyword', next: '@funcName' }],
      [/class\b/, { token: 'keyword', next: '@className' }],
      { include: '@whitespace' },
      { include: '@numbers' },
      { include: '@strings' },
      [/[,:;]/, 'delimiter'],
      [/[{}\[\]()]/, '@brackets'],
      [/@[a-zA-Z_]\w*/, 'tag'],
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords':  'keyword',
          '@constants': 'constant.language',
          '@builtins':  'support.function',
          '@default':   'identifier',
        },
      }],
    ],

    funcName: [
      [/\s+/, 'white'],
      [/[a-zA-Z_]\w*/, { token: 'entity.name.function', next: '@pop' }],
      ['', '', '@pop'],
    ],

    className: [
      [/\s+/, 'white'],
      [/[a-zA-Z_]\w*/, { token: 'entity.name.class', next: '@pop' }],
      ['', '', '@pop'],
    ],

    whitespace: [
      [/\s+/, 'white'],
      [/(^#.*$)/, 'comment'],
      [/'''/, 'string', '@endDocString'],
      [/"""/, 'string', '@endDblDocString'],
    ],

    endDocString: [
      [/[^']+/, 'string'],
      [/\\'/, 'string'],
      [/'''/, 'string', '@popall'],
      [/'/, 'string'],
    ],

    endDblDocString: [
      [/[^"]+/, 'string'],
      [/\\"/, 'string'],
      [/"""/, 'string', '@popall'],
      [/"/, 'string'],
    ],

    numbers: [
      [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
      [/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?/, 'number'],
    ],

    strings: [
      [/'$/, 'string.escape', '@popall'],
      [/f'{1,3}/, 'string.escape', '@fStringBody'],
      [/'/, 'string.escape', '@stringBody'],
      [/"$/, 'string.escape', '@popall'],
      [/f"{1,3}/, 'string.escape', '@fDblStringBody'],
      [/"/, 'string.escape', '@dblStringBody'],
    ],

    fStringBody: [
      [/[^\\'\{\}]+$/, 'string', '@popall'],
      [/[^\\'\{\}]+/, 'string'],
      [/\{[^\}':!=]+/, 'identifier', '@fStringDetail'],
      [/\\./, 'string'],
      [/'/, 'string.escape', '@popall'],
      [/\\$/, 'string'],
    ],

    stringBody: [
      [/[^\\']+$/, 'string', '@popall'],
      [/[^\\']+/, 'string'],
      [/\\./, 'string'],
      [/'/, 'string.escape', '@popall'],
      [/\\$/, 'string'],
    ],

    fDblStringBody: [
      [/[^\\"\{\}]+$/, 'string', '@popall'],
      [/[^\\"\{\}]+/, 'string'],
      [/\{[^\}':!=]+/, 'identifier', '@fStringDetail'],
      [/\\./, 'string'],
      [/"/, 'string.escape', '@popall'],
      [/\\$/, 'string'],
    ],

    dblStringBody: [
      [/[^\\"]+$/, 'string', '@popall'],
      [/[^\\"]+/, 'string'],
      [/\\./, 'string'],
      [/"/, 'string.escape', '@popall'],
      [/\\$/, 'string'],
    ],

    fStringDetail: [
      [/[:][^}]+/, 'string'],
      [/[!][ars]/, 'string'],
      [/=/, 'string'],
      [/\}/, 'identifier', '@pop'],
    ],
  },
})
