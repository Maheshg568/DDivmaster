import fs from 'fs';
import path from 'path';

const src = path.resolve('chrome-extension/manifest.json');
const dest = path.resolve('dist/manifest.json');

fs.copyFileSync(src, dest);
console.log('Manifest copied to dist/manifest.json');
