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
        name: 'bm_lso',
        value: '401FA23C3A95E7F332DB266FA645A93B52E4897B595EB497C40C5CDF1ADB8AAC~YAAQn5r3SL147KmUAQAAk7p10QIedrKVfONLF1hFGbwTRXBmb/DiqxqowbnK3X7i0m9Zza/aQ7Wa6xNRgKH6Zk9xc/gs6hda269EMHCCqCCKzxuA0Dpe1UqsHQ/BzpYmQpw/Wy8YWyzJh4BHEsxRn7bx4ZJ+3ypBsUPLnxd6n6N1mum8ffZEAPC36py+yhIqDeuYl4OheCn7ufSgwh3jLofQxpx5nre2wsDAdp2xzg2q5v3g1fZPOn79cpWv1Gis23cIL833Pdvhfx5XZzztPIkWUfremaZ2yquvSb17V26LKKzVz6cZMfDkJDU3UA9Aaghi6PzeDqAZjY6Uc8nVjZZWKWD+aL3aKnYWhzHldnBBm+CXLzFFWA5BKukR8JKyW5o9fy4tZdpKG3WWl03QfPsMFrFRVisYQH27yEsd1aZuxU2wfZ0wCYa7G1YJ4K8hU4DSvuk4xyOgfUhYD7o6rXQIfcTKROV90uJdKHdr/0XmWILpT5JXN14=^1738680942124',
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: false,
        secure: false
      },
      {
        name: 'bm_so',
        value: '401FA23C3A95E7F332DB266FA645A93B52E4897B595EB497C40C5CDF1ADB8AAC~YAAQn5r3SL147KmUAQAAk7p10QIedrKVfONLF1hFGbwTRXBmb/DiqxqowbnK3X7i0m9Zza/aQ7Wa6xNRgKH6Zk9xc/gs6hda269EMHCCqCCKzxuA0Dpe1UqsHQ/BzpYmQpw/Wy8YWyzJh4BHEsxRn7bx4ZJ+3ypBsUPLnxd6n6N1mum8ffZEAPC36py+yhIqDeuYl4OheCn7ufSgwh3jLofQxpx5nre2wsDAdp2xzg2q5v3g1fZPOn79cpWv1Gis23cIL833Pdvhfx5XZzztPIkWUfremaZ2yquvSb17V26LKKzVz6cZMfDkJDU3UA9Aaghi6PzeDqAZjY6Uc8nVjZZWKWD+aL3aKnYWhzHldnBBm+CXLzFFWA5BKukR8JKyW5o9fy4tZdpKG3WWl03QfPsMFrFRVisYQH27yEsd1aZuxU2wfZ0wCYa7G1YJ4K8hU4DSvuk4xyOgfUhYD7o6rXQIfcTKROV90uJdKHdr/0XmWILpT5JXN14=',
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: false,
        secure: true
      },
      {
        name: 'bm_ss',
        value: 'ab8e18ef4e', // Falls vorhanden
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: true,
        secure: true
      },
      {
        name: 'PSid',
        value: '1738709999_31b97630e7004857742c1302a75fdf4b9f2df188afda0f8c2545d70bbe0a99488cf22579ec7ebd51cc8e7e891f96dd6c3cdfeb65645c8a9a9e748ad594595509f6241d15143644fcf6f3b2cea25f136672',
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: false,
        secure: false
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