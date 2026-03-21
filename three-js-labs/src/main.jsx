import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gallery from './components/Gallery';
import SceneEditor from './components/SceneEditor';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/scene/:id" element={<SceneEditor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
