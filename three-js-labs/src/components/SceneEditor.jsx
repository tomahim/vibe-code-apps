import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import SceneRenderer from './SceneRenderer';
import './SceneEditor.css';

export default function SceneEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    fetchScene();
  }, [id]);

  const fetchScene = async () => {
    try {
      const response = await fetch(`/api/scenes/${id}`);
      const data = await response.json();
      setCode(data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scene:', error);
      setLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
    
    // Auto-save after 1 second of no typing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveScene(value);
    }, 1000);
  };

  const saveScene = async (content) => {
    try {
      await fetch(`/api/scenes/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      console.log('Scene saved');
    } catch (error) {
      console.error('Error saving scene:', error);
    }
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleExport = async () => {
    // Trigger export from renderer
    const event = new CustomEvent('export-gltf', { detail: { sceneId: id } });
    window.dispatchEvent(event);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gltf,.glb';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const customEvent = new CustomEvent('import-gltf', { 
            detail: { data: event.target.result, filename: file.name } 
          });
          window.dispatchEvent(customEvent);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="scene-editor">
      <header className="editor-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Gallery
        </button>
        <h1>{id}</h1>
        <div className="editor-actions">
          <button className="btn-action" onClick={handleImport}>
            Import GLTF
          </button>
          <button className="btn-action" onClick={handleExport}>
            Export GLTF
          </button>
        </div>
      </header>
      
      <div className="editor-content">
        <div className="editor-pane">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
        
        <div className="preview-pane">
          <SceneRenderer code={code} sceneId={id} captureThumbnail={true} />
        </div>
      </div>
    </div>
  );
}
