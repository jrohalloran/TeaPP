import fs from 'fs/promises';  // Promise-based fs API
import path from 'path';

export async function saveJsonToFile(data, filename = 'graphData.json') {
  try {
    const filePath = path.resolve('./saved_json', filename);

    // Ensure the folder exists or create it (optional)
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write JSON data as pretty-printed string
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`JSON saved to ${filePath}`);
    return filePath;
  } catch (err) {
    console.error('Error writing JSON file:', err);
    throw err;
  }
}


