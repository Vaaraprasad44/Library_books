import { readdir, readFile, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Path to the directory containing the target files
const __dirname = dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = join(__dirname, 'src', 'store', 'api', 'generated');
const ESLINT_DISABLE_COMMENT = '/* eslint-disable -- Auto Generated File */\n';

// Read the target directory
readdir(TARGET_DIR, (err, files) => {
  if (err) {
    return console.error('Error reading the directory:', err);
  }

  // Filter for '.ts' files and prepend the comment to each
  files.filter(file => file.endsWith('.ts')).forEach(file => {
    const filePath = join(TARGET_DIR, file);

    // Read each TypeScript file
    readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        return console.error(`Error reading the file ${file}:`, err);
      }

      // Prepend the eslint disable comment
      const updatedContent = ESLINT_DISABLE_COMMENT + data;

      // Write the updated content back to the file
      writeFile(filePath, updatedContent, (err) => {
        if (err) {
          return console.error(`Error writing the updated file ${file}:`, err);
        }

        console.log(`ESLint disable comment prepended successfully to ${file}.`);
      });
    });
  });
});