import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { bracketMatching, indentOnInput, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { closeBrackets, closeBracketsKeymap, autocompletion } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#c49aff' },
  { tag: [tags.string, tags.special(tags.string)], color: '#c8e997' },
  { tag: tags.number, color: '#efa584' },
  { tag: tags.comment, color: '#7d899d', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#9cbffb' },
  { tag: [tags.typeName, tags.className], color: '#e4cc8a' },
  { tag: tags.operator, color: '#a1b3d0' },
]);
const theme = EditorView.theme({
  '&': { height: '100%', fontSize: '12px', background: '#11141c', color: '#d4dbe9' },
  '.cm-content': { fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace', padding: '18px 0', caretColor: '#c5b0ff' },
  '.cm-line': { padding: '0 20px 0 12px', lineHeight: '1.85' },
  '.cm-scroller': { overflow: 'auto' },
  '.cm-gutters': { background: '#11141c', color: '#596479', border: 'none', paddingLeft: '12px' },
  '.cm-activeLine, .cm-activeLineGutter': { background: '#ffffff04' },
  '.cm-cursor': { borderLeftColor: '#c5b0ff' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { background: '#8061c845 !important' },
  '&.cm-focused': { outline: 'none' },
  '.cm-panels, .cm-tooltip': { background: '#202531', color: '#d4dbe9', border: '1px solid #343c4e' },
  '.cm-search input': { background: '#11141c', color: '#fff', border: '1px solid #343c4e' },
}, { dark: true });

export default function CodeEditor({ value, onChange, onRun }) {
  const element = useRef(null), editor = useRef(null), callbacks = useRef({ onChange, onRun });
  callbacks.current = { onChange, onRun };
  useEffect(() => {
    const view = new EditorView({
      parent: element.current,
      state: EditorState.create({ doc: value, extensions: [
        lineNumbers(), highlightActiveLineGutter(), history(), drawSelection(), indentOnInput(), bracketMatching(), closeBrackets(),
        autocompletion(), highlightActiveLine(), highlightSelectionMatches(), javascript(), syntaxHighlighting(highlight), theme,
        EditorView.contentAttributes.of({ 'aria-label': 'Lesson JavaScript editor', 'data-testid': 'lesson-editor', spellcheck: 'false' }),
        keymap.of([{ key: 'Mod-Enter', run: () => { callbacks.current.onRun(); return true; } }, ...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
        EditorView.updateListener.of((update) => { if (update.docChanged) callbacks.current.onChange(update.state.doc.toString()); }),
      ] }),
    });
    editor.current = view;
    return () => { view.destroy(); editor.current = null; };
  }, []);
  useEffect(() => {
    const view = editor.current;
    if (view && view.state.doc.toString() !== value) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  }, [value]);
  return <div className="tl-code-editor" ref={element} />;
}
