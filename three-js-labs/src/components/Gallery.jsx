import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';

export default function Gallery() {
  const [scenes, setScenes] = useState([]);
  const [filteredScenes, setFilteredScenes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [newSceneName, setNewSceneName] = useState('');
  const [showNewSceneDialog, setShowNewSceneDialog] = useState(false);
  const [editingTags, setEditingTags] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenes();
  }, []);

  useEffect(() => {
    filterScenes();
  }, [scenes, searchQuery, selectedTags]);

  const fetchScenes = async () => {
    try {
      const response = await fetch('/api/scenes');
      const data = await response.json();
      setScenes(data);
      
      // Extract all unique tags
      const tags = new Set();
      data.forEach(scene => {
        if (scene.tags) {
          scene.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error('Error fetching scenes:', error);
    }
  };

  const filterScenes = () => {
    let filtered = scenes;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(scene =>
        scene.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scene.description && scene.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(scene =>
        selectedTags.every(tag => scene.tags && scene.tags.includes(tag))
      );
    }

    setFilteredScenes(filtered);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
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

  const startEditingTags = (scene, e) => {
    e.stopPropagation();
    setEditingTags(scene.id);
    setTagInput(scene.tags ? scene.tags.join(', ') : '');
  };

  const saveTags = async (sceneId, e) => {
    e.stopPropagation();
    
    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    try {
      await fetch(`/api/scenes/${sceneId}/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags, description: '' }),
      });
      setEditingTags(null);
      setTagInput('');
      fetchScenes();
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const cancelEditingTags = (e) => {
    e.stopPropagation();
    setEditingTags(null);
    setTagInput('');
  };

  return (
    <div className="gallery-container">
      {/* Sidebar */}
      <aside className="gallery-sidebar">
        <div className="sidebar-section">
          <h2>Three.js Labs</h2>
          <p className="sidebar-subtitle">Scene Gallery</p>
        </div>

        <div className="sidebar-section">
          <button 
            className="btn-primary btn-full"
            onClick={() => setShowNewSceneDialog(true)}
          >
            + New Scene
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Filter by Tags</h3>
          {selectedTags.length > 0 && (
            <button 
              className="btn-clear-filters"
              onClick={() => setSelectedTags([])}
            >
              Clear Filters
            </button>
          )}
          <div className="tag-filter-list">
            {allTags.length === 0 ? (
              <p className="no-tags">No tags yet. Add tags to scenes to filter them.</p>
            ) : (
              allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  <span className="tag-count">
                    {scenes.filter(s => s.tags && s.tags.includes(tag)).length}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-stats">
          <div className="stat">
            <span className="stat-value">{scenes.length}</span>
            <span className="stat-label">Total Scenes</span>
          </div>
          <div className="stat">
            <span className="stat-value">{allTags.length}</span>
            <span className="stat-label">Tags</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="gallery-main">
        <div className="gallery-header">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search scenes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>

          <div className="results-info">
            {filteredScenes.length} {filteredScenes.length === 1 ? 'scene' : 'scenes'}
            {(searchQuery || selectedTags.length > 0) && ` found`}
          </div>
        </div>

        <div className="scenes-grid">
          {filteredScenes.map(scene => (
            <div 
              key={scene.id} 
              className="scene-card"
              onClick={() => navigate(`/scene/${scene.id}`)}
            >
              <div className="scene-preview">
                <img 
                  src={`/api/thumbnails/${scene.id}`}
                  alt={scene.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="scene-icon" style={{ display: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.2c0 4.47-2.94 8.63-7.5 9.91-.45-.13-.9-.28-1.34-.46C7.34 23.91 4 19.86 4 15.3V7.78l8-3.6z"/>
                  </svg>
                </div>
              </div>
              
              <div className="scene-info">
                <h3>{scene.name}</h3>
                
                {editingTags === scene.id ? (
                  <div className="tag-edit" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      className="tag-input"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveTags(scene.id, e);
                        if (e.key === 'Escape') cancelEditingTags(e);
                      }}
                    />
                    <div className="tag-edit-actions">
                      <button className="btn-tag-save" onClick={(e) => saveTags(scene.id, e)}>
                        Save
                      </button>
                      <button className="btn-tag-cancel" onClick={cancelEditingTags}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="scene-tags">
                    {scene.tags && scene.tags.length > 0 ? (
                      scene.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))
                    ) : (
                      <span className="no-tags-hint">No tags</span>
                    )}
                    <button 
                      className="btn-edit-tags"
                      onClick={(e) => startEditingTags(scene, e)}
                      title="Edit tags"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                
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

        {filteredScenes.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor" className="empty-icon">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.2c0 4.47-2.94 8.63-7.5 9.91-.45-.13-.9-.28-1.34-.46C7.34 23.91 4 19.86 4 15.3V7.78l8-3.6z"/>
            </svg>
            <h3>No scenes found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* New Scene Dialog */}
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
