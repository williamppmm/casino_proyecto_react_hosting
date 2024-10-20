const fs = require('fs');
const path = require('path');

function printDirectoryStructure(dir, depth = 0, maxDepth = Infinity, ignore = []) {
  if (depth > maxDepth) return;

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (ignore.includes(file)) return;

    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      console.log('  '.repeat(depth) + '|-- ' + file);
      printDirectoryStructure(filePath, depth + 1, maxDepth, ignore);
    }
  });
}

// Configuración
const maxDepth = 3; // Ajustar este valor para controlar la profundidad del árbol
const ignoreList = ['node_modules', '.git', 'build', 'dist']; // Añade aquí los directorios que quieras ignorar

console.log('Estructura del proyecto:');
console.log('|-- frontend');
printDirectoryStructure('./frontend', 1, maxDepth, ignoreList);
console.log('|-- backend');
printDirectoryStructure('./backend', 1, maxDepth, ignoreList);

// se ejecuta en la terminal con: node project-tree.js