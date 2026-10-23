import { javascript } from '@codemirror/lang-javascript';
import CodeEditor from '../../components/CodeEditor.jsx';
const language = javascript();
export default function JavaScriptEditor(props) {
  return <CodeEditor {...props} language={language} label="Lesson JavaScript editor" className="tl-code-editor" />;
}
