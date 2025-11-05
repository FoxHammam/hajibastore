import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Get the dist directory path
const distPath = join(__dirname, 'dist');
const indexPath = join(distPath, 'index.html');

// Check if dist directory exists
if (!existsSync(distPath)) {
  console.error('ERROR: dist directory not found!');
  console.error('Make sure you run "npm run build" before starting the server.');
  process.exit(1);
}

// Serve static files from the dist directory
app.use(express.static(distPath, {
  // Don't send index.html for root requests - let the catch-all handle it
  index: false,
  // Set proper cache headers
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Handle SPA routing - all non-API routes should return index.html
app.get('*', (req, res, next) => {
  // Skip API routes (if any are proxied)
  if (req.path.startsWith('/api')) {
    return next();
  }

  // Skip static asset requests (they should be handled by express.static)
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  // For all other routes, serve index.html
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found. Please run "npm run build" first.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📁 Serving files from: ${distPath}`);
  console.log(`🌐 Open http://localhost:${PORT} to view your app`);
});

