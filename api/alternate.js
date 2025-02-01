import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    // JSON-Datei mit den URLs einlesen
    const filePath = path.join(process.cwd(), 'api', 'urls', 'alternate-urls.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const urls = JSON.parse(fileContent);

    // Alle URLs parallel abrufen
    const results = await Promise.all(
      urls.map(async ({ name, url }) => {
        try {
          const response = await fetch(url);
          const htmlData = await response.text();
          const available = htmlData.includes('Auf Lager'); // Verfügbarkeitsprüfung
          return { name, available };
        } catch (error) {
          return { name, error: error.message };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}