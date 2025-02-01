import puppeteer from 'puppeteer';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
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
    res.json({ available });

  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});