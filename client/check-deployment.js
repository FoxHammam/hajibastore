// Quick diagnostic script to check deployment setup
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking deployment setup...\n');

// Check 1: server.js exists
const serverJs = join(__dirname, 'server.js');
console.log(`1. server.js: ${existsSync(serverJs) ? '✅ EXISTS' : '❌ MISSING'}`);

// Check 2: dist folder exists
const distFolder = join(__dirname, 'dist');
console.log(`2. dist folder: ${existsSync(distFolder) ? '✅ EXISTS' : '❌ MISSING'}`);

// Check 3: index.html in dist
const indexHtml = join(distFolder, 'index.html');
console.log(`3. dist/index.html: ${existsSync(indexHtml) ? '✅ EXISTS' : '❌ MISSING'}`);

// Check 4: _redirects in public
const redirects = join(__dirname, 'public', '_redirects');
console.log(`4. public/_redirects: ${existsSync(redirects) ? '✅ EXISTS' : '❌ MISSING'}`);

// Check 5: package.json has start script
try {
  const pkg = await import('./package.json', { assert: { type: 'json' } });
  const hasStart = pkg.default?.scripts?.start;
  console.log(`5. package.json start script: ${hasStart ? `✅ EXISTS (${hasStart})` : '❌ MISSING'}`);
  console.log(`6. express in dependencies: ${pkg.default?.dependencies?.express ? '✅ YES' : '❌ NO'}`);
} catch (e) {
  console.log(`5. package.json: ❌ ERROR reading - ${e.message}`);
}

console.log('\n📋 Summary:');
console.log('If all checks pass, your files are correct.');
console.log('If deployment fails, check Render dashboard settings.');

