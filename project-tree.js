const fs = require('fs');
const path = require('path');

function printDirectoryStructure(dir, depth = 0, maxDepth = Infinity, ignore = [], extensions = [], specialFiles = [], specialDirs = []) {
  if (depth > maxDepth && !specialDirs.includes(path.basename(dir))) return;

  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (ignore.includes(file)) return;

      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const currentDir = path.basename(dir);
      
      if (stats.isDirectory()) {
        console.log('  '.repeat(depth) + '|-- ' + file);
        const nextDepth = specialDirs.includes(currentDir) ? Infinity : depth + 1;
        printDirectoryStructure(filePath, depth + 1, nextDepth, ignore, extensions, specialFiles, specialDirs);
      } else if (
        (specialDirs.includes(currentDir) && extensions.includes(ext)) ||
        extensions.includes(ext) || 
        specialFiles.includes(file) || 
        file.startsWith('.env')
      ) {
        console.log('  '.repeat(depth) + '|   ' + file);
      }
    });
  } catch (error) {
    console.log(`Error al leer el directorio ${dir}:`, error);
  }
}

// Configuración
const maxDepth = 3; // Profundidad general del árbol
const ignoreList = ['node_modules', '.git', 'build', 'dist']; // Directorios a ignorar
const extensions = ['.js', '.css', '.json', '.md', '.svg', '.png', '.jpg', '.jpeg']; // Extensiones a mostrar
const specialFiles = [
  '.gitignore',
  '.env',
  '.env.development',
  'README.md'
]; // Archivos especiales a mostrar
const specialDirs = [
  'icons',
  'images',
  'logos',
  'common',
  'forms',
  'layout',
  'profile',
  'dashboard',
  'home',
  'login',
  'register'
]; // Directorios que quieres explorar completamente

console.log('\nEstructura del proyecto:');
console.log('|-- FRONTEND');
printDirectoryStructure('./frontend', 1, maxDepth, ignoreList, extensions, specialFiles, specialDirs);
console.log('\n|-- BACKEND');
printDirectoryStructure('./backend', 1, maxDepth, ignoreList, extensions, specialFiles, specialDirs);

// Ejecutar con: node project-tree.js