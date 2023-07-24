const githubLightInit = await (
    await import('@uiw/codemirror-theme-github')
).githubLightInit;

const LightTheme = githubLightInit({
    settings: {
        background: '#F6F6F6',
        gutterBackground: '#F1F1F1',
    },
})

export default LightTheme;