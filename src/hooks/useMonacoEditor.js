import { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { BASE_EDITOR_CONFIG, editorHeight } from '../editor.js'

/**
 * Mounts a Monaco editor into containerRef, saves/restores code across slide
 * toggles, and resets to initialCode when stepKey changes (new lesson step).
 *
 * @param {object} opts
 * @param {boolean}          opts.active        – whether this editor's slide is visible
 * @param {React.RefObject}  opts.containerRef  – DOM ref for the editor mount point
 * @param {React.RefObject}  opts.editorRef     – ref to populate with the editor instance
 * @param {string}           opts.initialCode   – starter code (changes with stepKey)
 * @param {string}           opts.stepKey       – unique key per lesson step (triggers reset)
 * @param {string}           opts.theme         – Monaco theme ID at mount time
 * @param {function}         opts.onRun         – called when Ctrl/Cmd+Enter is pressed
 * @param {object}           [opts.extraOptions] – extra Monaco options merged last
 */
export function useMonacoEditor({
  active,
  containerRef,
  editorRef,
  initialCode,
  stepKey,
  theme,
  onRun,
  extraOptions = {},
  autoGrow = false,
}) {
  const savedCodeRef = useRef(null)
  const runRef = useRef(onRun)
  useEffect(() => {
    runRef.current = onRun
  })
  const themeRef = useRef(theme)
  useEffect(() => {
    themeRef.current = theme
  })

  // Reset saved code when the step changes so the new step uses initialCode.
  // prevStepKeyRef/.savedCodeRef are cache values not needed for rendering;
  // reading/writing them here is safe even though the rule flags it.
  const prevStepKeyRef = useRef(stepKey)
  // eslint-disable-next-line react-hooks/refs
  if (prevStepKeyRef.current !== stepKey) {
    // eslint-disable-next-line react-hooks/refs
    prevStepKeyRef.current = stepKey
    // eslint-disable-next-line react-hooks/refs
    savedCodeRef.current = null
  }

  useEffect(() => {
    if (!active || !containerRef.current) return
    const code = savedCodeRef.current ?? initialCode
    const updateHeight = (currentCode) => {
      if (!containerRef.current) return
      const h = autoGrow
        ? editorHeight(currentCode, { min: 200, max: 800 })
        : editorHeight(currentCode)
      containerRef.current.style.height = `${h}px`
    }
    updateHeight(code)
    const editor = monaco.editor.create(containerRef.current, {
      ...BASE_EDITOR_CONFIG,
      ...extraOptions,
      value: code,
      theme: themeRef.current,
    })
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () =>
      runRef.current?.()
    )
    const contentListener = autoGrow
      ? editor.onDidChangeModelContent(() => updateHeight(editor.getValue()))
      : null
    return () => {
      contentListener?.dispose()
      // Only save when toggling visibility on the same step, not when switching steps.
      // prevStepKeyRef was already updated to the new key during render, so if it
      // differs from the closure's stepKey, the step changed and we should discard.
      if (prevStepKeyRef.current === stepKey) {
        savedCodeRef.current = editor.getValue()
      }
      editor.dispose()
      editorRef.current = null
    }
    // active and stepKey are the only meaningful triggers; initialCode/theme/
    // extraOptions change in lockstep with these and don't need separate deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepKey])
}
