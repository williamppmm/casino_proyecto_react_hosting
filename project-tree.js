const fs = require('fs');
const path = require('path');

function printDirectoryStructure(dir, depth = 0, maxDepth = Infinity, ignore = [], extensions = [], specialFiles = []) {
  if (depth > maxDepth) return;

  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (ignore.includes(file)) return;

      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      
      if (stats.isDirectory()) {
        console.log('  '.repeat(depth) + '|-- ' + file);
        printDirectoryStructure(filePath, depth + 1, maxDepth, ignore, extensions, specialFiles);
      } else if (
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
const maxDepth = 3; // Ajustar profundidad del árbol
const ignoreList = ['node_modules', '.git', 'build', 'dist']; // Directorios a ignorar
const extensions = ['.js', '.css', '.json', '.md']; // Extensiones a mostrar
const specialFiles = [
  '.gitignore',
  '.env',
  '.env.development',
  'README.md'
]; // Archivos especiales a mostrar

console.log('\nEstructura del proyecto:');
console.log('|-- FRONTEND');
printDirectoryStructure('./frontend', 1, maxDepth, ignoreList, extensions, specialFiles);
console.log('\n|-- BACKEND');
printDirectoryStructure('./backend', 1, maxDepth, ignoreList, extensions, specialFiles);

// Ejecutar con: node project-tree.js