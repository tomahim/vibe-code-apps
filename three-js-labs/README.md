# Three.js Scene Gallery

A modern web application for creating, editing, and managing Three.js 3D scenes with live preview and code editing.

## Features

### Gallery & Organization
- **Modern Gallery UI**: Beautiful sidebar layout with scene thumbnails
- **Search**: Quickly find scenes by name or description
- **Tag System**: Organize scenes with custom tags
- **Tag Filtering**: Filter scenes by one or multiple tags
- **Auto Thumbnails**: Scene screenshots are automatically captured and displayed

### Code Editor
- **Live Code Editor**: Edit scene code with Monaco Editor (VS Code editor)
- **Real-time Preview**: See changes instantly as you type
- **Auto-save**: Changes are automatically saved after 1 second
- **Undo/Redo**: Built-in support via Monaco Editor (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z)
- **Split Screen**: Code on left, 3D preview on right

### 3D Features
- **GLTF Export/Import**: Export scenes to GLTF format and import existing models
- **Easy Scene Creation**: Create new scenes with a pre-filled template
- **React Three Fiber**: Modern React-based Three.js rendering
- **OrbitControls**: Navigate the 3D scene with mouse

## Tech Stack

- **Frontend**: React, Vite, React Three Fiber, Monaco Editor
- **Backend**: Express.js (Node.js)
- **3D Library**: Three.js
- **Deployment**: Docker & Docker Compose

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:1002

### Docker Deployment

Run with Docker Compose from the apps directory:
```bash
cd /home/tom/apps
docker compose up -d three-js-labs
```

The app will be deployed on:
- **Frontend**: Port 5173 (accessible at http://10.0.0.1:5173)
- **Backend API**: Port 1002

**Note**: Three example scenes (rotating-cube, bouncing-sphere, colorful-shapes) are automatically created when the server starts for the first time.

To rebuild after code changes:
```bash
docker compose up -d --build three-js-labs
```

## Scene Structure

Each scene is a JavaScript file that exports a `createScene` function:

```javascript
import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

export function createScene(scene) {
  // Create your 3D objects
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  // Return an animation function (optional)
  return (delta, elapsedTime) => {
    cube.rotation.x += delta;
    cube.rotation.y += delta;
  };
}
```

## Available Three.js Classes

The following Three.js classes are automatically imported and available:

- Geometries: `BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `PlaneGeometry`, `TorusGeometry`
- Materials: `MeshStandardMaterial`, `MeshBasicMaterial`
- Core: `Mesh`, `Group`, `Vector3`, `Color`
- Full THREE namespace: `THREE`

## Editor Shortcuts

- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + S**: Save (auto-save already enabled)
- **Ctrl/Cmd + F**: Find
- **Ctrl/Cmd + H**: Replace

## API Endpoints

- `GET /api/scenes` - Get all scenes
- `GET /api/scenes/:id` - Get a specific scene
- `POST /api/scenes` - Create a new scene
- `POST /api/scenes/:id` - Save a scene
- `DELETE /api/scenes/:id` - Delete a scene
- `POST /api/export/:id` - Export scene to GLTF
- `GET /api/import/:filename` - Import GLTF file

## Folder Structure

```
three-js-labs/
├── server/          # Express backend
├── src/             # React frontend
│   └── components/  # React components
├── scenes/          # 3D scene files
├── public/          # Static assets
└── Dockerfile       # Docker configuration
```
