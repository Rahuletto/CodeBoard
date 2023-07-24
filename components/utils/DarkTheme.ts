const t = await (await import('@lezer/highlight')).tags;
const atomoneInit = await (
    await import('@uiw/codemirror-theme-atomone')
).atomoneInit;

const DarkTheme = atomoneInit({
    settings: {
        foreground: '#ABB2BF',
        selection: '#646464',
        selectionMatch: '#646464',
        caret: '#C6C6C6',
        fontFamily: "var(--mono-font)",
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

export default DarkTheme