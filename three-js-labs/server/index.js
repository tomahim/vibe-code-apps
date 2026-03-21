import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 1002;

app.use(cors());
app.use(express.json());

const SCENES_DIR = join(__dirname, '../scenes');

// Ensure scenes directory exists
if (!existsSync(SCENES_DIR)) {
  await fs.mkdir(SCENES_DIR, { recursive: true });
}

// Get all scenes
app.get('/api/scenes', async (req, res) => {
  try {
    const files = await fs.readdir(SCENES_DIR);
    const scenes = files
      .filter(file => file.endsWith('.js'))
      .map(file => ({
        id: file.replace('.js', ''),
        name: file.replace('.js', ''),
        file: file
      }));
    res.json(scenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific scene
app.get('/api/scenes/:id', async (req, res) => {
  try {
    const filePath = join(SCENES_DIR, `${req.params.id}.js`);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a scene
app.post('/api/scenes/:id', async (req, res) => {
  try {
    const filePath = join(SCENES_DIR, `${req.params.id}.js`);
    await fs.writeFile(filePath, req.body.content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new scene
app.post('/api/scenes', async (req, res) => {
  try {
    const { name } = req.body;
    const fileName = `${name}.js`;
    const filePath = join(SCENES_DIR, fileName);
    
    // Check if file already exists
    if (existsSync(filePath)) {
      return res.status(400).json({ error: 'Scene already exists' });
    }
    
    // Default scene template
    const template = `import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

export function createScene(scene) {
  // Create a cube
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  // Animation function
  return (delta) => {
    cube.rotation.x += delta;
    cube.rotation.y += delta;
  };
}
`;
    
    await fs.writeFile(filePath, template);
    res.json({ success: true, id: name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a scene
app.delete('/api/scenes/:id', async (req, res) => {
  try {
    const filePath = join(SCENES_DIR, `${req.params.id}.js`);
    await fs.unlink(filePath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GLTF export endpoint
app.post('/api/export/:id', async (req, res) => {
  try {
    const { gltfData } = req.body;
    const filePath = join(SCENES_DIR, `${req.params.id}.gltf`);
    await fs.writeFile(filePath, JSON.stringify(gltfData, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GLTF import endpoint
app.get('/api/import/:filename', async (req, res) => {
  try {
    const filePath = join(SCENES_DIR, req.params.filename);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content: JSON.parse(content) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
