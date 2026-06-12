export const TOKEN_RE = /(?<comment>#[^\n]*)|(?<string>f?"""[\s\S]*?"""|f?'''[\s\S]*?'''|f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*')|(?<number>\b\d+(?:\.\d+)?\b)|(?<kw>\b(?:def|class|return|if|elif|else|for|while|in|import|from|as|with|pass|break|continue|lambda|and|or|not|is|None|True|False|yield|raise|try|except|finally|global|nonlocal|del|assert)\b)|(?<builtin>\b(?:print|range|len|sorted|list|dict|set|tuple|str|int|float|bool|type|zip|map|filter|enumerate|sum|min|max|abs|round|open|input|repr)\b)|(?<plain>[\s\S])/g

export function tokenize(code) {
  const tokens = []
  let last = null
  for (const m of code.matchAll(TOKEN_RE)) {
    const type = Object.keys(m.groups).find(k => m.groups[k] !== undefined)
    if (last && last.type === type) {
      last.text += m[0]
    } else {
      last = { type, text: m[0] }
      tokens.push(last)
    }
  }
  return tokens
}
