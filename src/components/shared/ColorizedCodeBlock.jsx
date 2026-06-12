import { useMonacoColorize } from '../../hooks/useMonacoColorize.js'

export default function ColorizedCodeBlock({ code, monacoTheme, className }) {
  const colorizedHtml = useMonacoColorize(code, monacoTheme)
  return colorizedHtml ? (
    <pre
      className={className}
      dangerouslySetInnerHTML={{ __html: colorizedHtml }}
    />
  ) : (
    <pre className={className}>{code}</pre>
  )
}
