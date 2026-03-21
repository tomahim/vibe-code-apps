import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';

export default function Gallery() {
  const [scenes, setScenes] = useState([]);
  const [newSceneName, setNewSceneName] = useState('');
  const [showNewSceneDialog, setShowNewSceneDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenes();
  }, []);

  const fetchScenes = async () => {
    try {
      const response = await fetch('/api/scenes');
      const data = await response.json();
      setScenes(data);
    } catch (error) {
      console.error('Error fetching scenes:', error);
    }
  };

  const createNewScene = async () => {
    if (!newSceneName.trim()) return;
    
    try {
      const response = await fetch('/api/scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSceneName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setNewSceneName('');
        setShowNewSceneDialog(false);
        navigate(`/scene/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error creating scene:', error);
    }
  };

  const deleteScene = async (id, e) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${id}?`)) return;
    
    try {
      await fetch(`/api/scenes/${id}`, { method: 'DELETE' });
      fetchScenes();
    } catch (error) {
      console.error('Error deleting scene:', error);
    }
  };

  return (
    <div className="gallery">
      <header className="gallery-header">
        <h1>Three.js Scene Gallery</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowNewSceneDialog(true)}
        >
          + New Scene
        </button>
      </header>

      <div className="scenes-grid">
        {scenes.map(scene => (
          <div 
            key={scene.id} 
            className="scene-card"
            onClick={() => navigate(`/scene/${scene.id}`)}
          >
            <div className="scene-preview">
              <div className="scene-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.2c0 4.47-2.94 8.63-7.5 9.91-.45-.13-.9-.28-1.34-.46C7.34 23.91 4 19.86 4 15.3V7.78l8-3.6z"/>
                </svg>
              </div>
            </div>
            <div className="scene-info">
              <h3>{scene.name}</h3>
              <div className="scene-actions">
                <button 
                  className="btn-delete"
                  onClick={(e) => deleteScene(scene.id, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewSceneDialog && (
        <div className="modal-overlay" onClick={() => setShowNewSceneDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Scene</h2>
            <input
              type="text"
              placeholder="Scene name"
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewScene()}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => setShowNewSceneDialog(false)}>Cancel</button>
              <button className="btn-primary" onClick={createNewScene}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
