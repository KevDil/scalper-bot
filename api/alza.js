import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    try {
        // JSON-Datei mit den URLs einlesen
        const filePath = path.join(process.cwd(), 'api', 'urls', 'alza-urls.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const urls = JSON.parse(fileContent);

        // Alle URLs parallel abrufen
        const results = await Promise.all(
            urls.map(async ({ name, url }) => {
                try {
                    // Starte Puppeteer im Headless-Modus
                    const browser = await puppeteer.launch({ headless: 'new' });
                    const page = await browser.newPage();

                    // Fake einen echten Browser
                    await page.setUserAgent(
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    );

                    const url = 'https://www.alza.de/gigabyte-geforce-rtx-4070-super-windforce-oc-12g-d9358232.htm';
                    await page.goto(url, { waitUntil: 'networkidle2' });

                    // Warte einige Sekunden, um sicherzustellen, dass die Seite vollständig geladen ist
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Extrahiere den HTML-Quellcode
                    const htmlData = await page.content();
                    const available = !(htmlData.includes('Momentan nicht verfügbar')) && !(htmlData.includes('Vorbestellen'));

                    await browser.close();
                    return { name, available };

                } catch (error) {
                    return res.status(500).json({ error: error.message });
                }
            })
        );

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}