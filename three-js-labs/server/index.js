import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 1002;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for thumbnails
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SCENES_DIR = join(__dirname, '../scenes');

// Ensure scenes directory exists and create default scenes
if (!existsSync(SCENES_DIR)) {
  await fs.mkdir(SCENES_DIR, { recursive: true });
}

// Create default example scenes if they don't exist
async function createDefaultScenes() {
  const defaultScenes = {
    'rotating-cube.js': `import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

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
`,
    'bouncing-sphere.js': `import { SphereGeometry, MeshStandardMaterial, Mesh } from 'three';

export function createScene(scene) {
  // Create a sphere
  const geometry = new SphereGeometry(1, 32, 32);
  const material = new MeshStandardMaterial({ 
    color: 0xff6b6b,
    metalness: 0.5,
    roughness: 0.5
  });
  const sphere = new Mesh(geometry, material);
  scene.add(sphere);
  
  let direction = 1;
  
  // Animation function
  return (delta) => {
    sphere.position.y += delta * direction * 2;
    
    if (sphere.position.y > 3) direction = -1;
    if (sphere.position.y < -1) direction = 1;
    
    sphere.rotation.x += delta;
  };
}
`,
    'colorful-shapes.js': `import { BoxGeometry, SphereGeometry, TorusGeometry, MeshStandardMaterial, Mesh, Group } from 'three';

export function createScene(scene) {
  // Create a group
  const group = new Group();
  scene.add(group);
  
  // Create different shapes
  const box = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshStandardMaterial({ color: 0xff6b6b })
  );
  box.position.x = -2;
  
  const sphere = new Mesh(
    new SphereGeometry(0.7, 32, 32),
    new MeshStandardMaterial({ color: 0x4ecdc4 })
  );
  sphere.position.x = 0;
  
  const torus = new Mesh(
    new TorusGeometry(0.6, 0.3, 16, 100),
    new MeshStandardMaterial({ color: 0xffe66d })
  );
  torus.position.x = 2;
  
  group.add(box, sphere, torus);
  
  // Animation function
  return (delta) => {
    box.rotation.x += delta;
    box.rotation.y += delta;
    
    sphere.rotation.y += delta;
    
    torus.rotation.x += delta;
    torus.rotation.y += delta * 0.5;
    
    group.rotation.y += delta * 0.3;
  };
}
`
  };

  for (const [filename, content] of Object.entries(defaultScenes)) {
    const filePath = join(SCENES_DIR, filename);
    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, content);
      console.log(`Created default scene: ${filename}`);
    }
  }
}

await createDefaultScenes();

// Helper function to get scene metadata
async function getSceneMetadata(sceneId) {
  const metaPath = join(SCENES_DIR, `${sceneId}.meta.json`);
  if (existsSync(metaPath)) {
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    return JSON.parse(metaContent);
  }
  return { tags: [], description: '' };
}

// Get all scenes
app.get('/api/scenes', async (req, res) => {
  try {
    const files = await fs.readdir(SCENES_DIR);
    const sceneFiles = files.filter(file => file.endsWith('.js'));
    
    const scenes = await Promise.all(
      sceneFiles.map(async (file) => {
        const id = file.replace('.js', '');
        const metadata = await getSceneMetadata(id);
        return {
          id,
          name: id,
          file,
          tags: metadata.tags || [],
          description: metadata.description || ''
        };
      })
    );
    
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

// Update scene metadata (tags, description)
app.post('/api/scenes/:id/metadata', async (req, res) => {
  try {
    const { tags, description } = req.body;
    const metaPath = join(SCENES_DIR, `${req.params.id}.meta.json`);
    await fs.writeFile(metaPath, JSON.stringify({ tags, description }, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a scene
app.delete('/api/scenes/:id', async (req, res) => {
  try {
    const filePath = join(SCENES_DIR, `${req.params.id}.js`);
    const metaPath = join(SCENES_DIR, `${req.params.id}.meta.json`);
    const thumbPath = join(SCENES_DIR, `${req.params.id}.png`);
    
    await fs.unlink(filePath);
    if (existsSync(metaPath)) await fs.unlink(metaPath);
    if (existsSync(thumbPath)) await fs.unlink(thumbPath);
    
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

// Save thumbnail for a scene
app.post('/api/thumbnails/:id', async (req, res) => {
  try {
    const { imageData } = req.body;
    // Remove data:image/png;base64, prefix
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = join(SCENES_DIR, `${req.params.id}.png`);
    await fs.writeFile(filePath, buffer);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get thumbnail for a scene
app.get('/api/thumbnails/:id', async (req, res) => {
  try {
    const filePath = join(SCENES_DIR, `${req.params.id}.png`);
    if (existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Thumbnail not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Commit a scene to git
app.post('/api/scenes/:id/git-commit', async (req, res) => {
  const { id } = req.params;
  const repoRoot = join(__dirname, '..');
  const jsFile = `scenes/${id}.js`;
  const metaFile = `scenes/${id}.meta.json`;

  const filesToAdd = [jsFile];
  if (existsSync(join(repoRoot, metaFile))) filesToAdd.push(metaFile);

  const addCmd = `git add ${filesToAdd.map(f => `"${f}"`).join(' ')}`;
  const commitCmd = `git commit -m "Save scene: ${id}"`;

  exec(`${addCmd} && ${commitCmd}`, { cwd: repoRoot }, (err, stdout, stderr) => {
    if (err) {
      // Check if it's just "nothing to commit"
      if (stderr.includes('nothing to commit') || stdout.includes('nothing to commit')) {
        return res.json({ success: true, message: 'Nothing new to commit' });
      }
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ success: true, message: stdout.trim() });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
