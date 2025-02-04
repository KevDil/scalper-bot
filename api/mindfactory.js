import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // JSON-Datei mit den URLs einlesen
    const filePath = path.join(process.cwd(), 'api', 'urls', 'mindfactory-urls.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const urls = JSON.parse(fileContent);

    // Alle URLs parallel abrufen
    const results = await Promise.all(
      urls.map(async ({ name, url }) => {
        try {
          const response = await fetchWithBrowser(url);
          console.log('response: ', response)
          //const htmlData = await response.text();
          //const available = htmlData.includes('Lagernd') || htmlData.includes('Bestellt') || htmlData.includes('Verfügbar'); // Verfügbarkeitsprüfung
          const available = response.includes('Lagernd') || response.includes('Bestellt') || response.includes('Verfügbar'); // Verfügbarkeitsprüfung
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

  async function fetchWithBrowser(url) {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    // Setze echten User-Agent, um als normaler Browser erkannt zu werden
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0) Gecko/20100101 Firefox/110.0'
    );

    // HTTP-Header setzen, um die Anfrage echter wirken zu lassen
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'de-DE,de;q=0.9',
      'Referer': 'https://www.mindfactory.de/',
    });

    // ✅ Cookies setzen (VOR dem Seitenaufruf!)
    const cookies = [
      {
        name: 'bm_s',
        value: 'YAAQ1Jr3SL27/a+UAQAAxYkp0QJ6rH/KuAie/9amDKTmQfijMJfd29coQFWGXll5Gc1e5cSdPJqEVll+QAiy0JKyTXsh3wQs/RdGNtcMUUPmrMxPnc5WtfdL8/n1moGy7Z3ZOEY5+SCopidvcoILHVC7a3ZhZk6lufPmdqPW4Ox3hf8y+75zq8ScDx937L6/ZKoD/8gnMtEwpscHStMbMHPgGIQSNqtkmc7w7ae0lNhqgXb+SdtGY3K7tIlkmxqFWczueC7yEwiOSF9g0AMik+vuP9fI6MudGlfrmBSgmYJc7ZbOzjjkJxHv09xwqy2KHfg6USrtooq7RK2rOXCdJ3exjkvjxV9tfe9ANWD6JdI42WfIy3Iqs5wrpqmA8AMsYiLdXaghVd6ZA4mfOF8zYH1yzKrjhmv8NOBRA41NhdkpWpOUodr2IcJUNNZeUlMgwTfdlg75IX1RZKIiAyoR', // Ersetze mit deiner echten Session-ID aus Chrome
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: true,
        secure: true
      },
      {
        name: 'NSid',
        value: 'e46934bca3bfe1a820f3a661c2c0942f', // Falls vorhanden
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: true,
        secure: true
      },
      {
        name: 'cookies_accepted',
        value: 'true', // Falls vorhanden
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: false,
        secure: false
      }
    ];
    await page.setCookie(...cookies);

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const html = await page.content();  // HTML abrufen
    await browser.close();

    return html;
  }
}