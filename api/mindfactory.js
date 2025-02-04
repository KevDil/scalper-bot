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
        value: 'YAAQ1Jr3SCHV/a+UAQAApnZ80QLqVjKrC4UA2SOA7i1zonFEdSNUfDifRKvF/j4/JxWFCqSOHFMam+L11MZH6tNN76Nd7Z7e7yYsMr8a6i4rGj6xatUrOBrJEA8tJ+gUOxNX1uRob2+W9yKrbnXbH+Fr0jeh05WsKOhxF/wst6cmmEhFnxefhLaJ6P0bswqHZxKgXX06HFuyzyce4DVoBf//B86PxBvSe06/XiBT3KsrprAPsvFeZsROf6eMiYiI6b4G1XSLU8ATKoidmM8Xuldvf0OKqgSn1WjSsuk2NPM4Xty/3CgdRkHsBo+aRovXx9JUEygVV+qGTFoeh3wocvDDnNN+jzb3U2J4QkPqpBCGvT0Sws5r/yNYi6MRV+p3VlMjN8xOivdGZU7tqyLYAqz240N9D+yOsy1A9Mptey5FebKTB2dzEszseOekKxtEV5E4v+6sKajXINKaf0Uc', // Ersetze mit deiner echten Session-ID aus Chrome
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: true,
        secure: true
      },
      {
        name: 'bm_lso',
        value: 'EDE85420EA2E1DF70705E4AC89D244E6BEC21E75D9619EA69F360AAA7F444140~YAAQ1Jr3SAvV/a+UAQAAqEB80QLMSsJKaTko6Xo0CquKaBaoFyNZQiIvLTHPfteBmRFl3v7bLDATPPR0ZIdlzwvglh2JmbGyf1i5efDfgQG6/0zL0UCyi82DOyjqx5486zh74JRmuhYkjS0sxGDinkFfqjVdZjFB4peaobODcbz6O/zBqDcjg1t6k6+jS86fu0ddyL0bymwJBzK/yIQOIOkK5dmCgEUstAi70fQAbDwia4x3+InVtUXiMfP0jY6XIlrk+Sf15NOx4crZuX8h+7g4iKH5/s2x4+MfS4QdkVf7eTG2h4GPSgvtK67TyW26Nm9Kcw/ChoCEhpEbORUXXBvcSnLermtAVcnVIzHWQ/dIRKFEJEOtsEqzYHvMkw6qCLSPGAS3Xl0nerOB+mInVXlDxn8u1RT0mItYLk8TQT9Uc+R6g3euLUmFX9mGRm6s93kLjNQvZGwZp/+2OnuC1Fp0JEcj2edSfB+BP6EjNr7VGaeRZwDB3qk=^1738681369160',
        domain: '.mindfactory.de',
        path: '/',
        httpOnly: false,
        secure: false
      },
      {
        name: 'bm_so',
        value: 'EDE85420EA2E1DF70705E4AC89D244E6BEC21E75D9619EA69F360AAA7F444140~YAAQ1Jr3SAvV/a+UAQAAqEB80QLMSsJKaTko6Xo0CquKaBaoFyNZQiIvLTHPfteBmRFl3v7bLDATPPR0ZIdlzwvglh2JmbGyf1i5efDfgQG6/0zL0UCyi82DOyjqx5486zh74JRmuhYkjS0sxGDinkFfqjVdZjFB4peaobODcbz6O/zBqDcjg1t6k6+jS86fu0ddyL0bymwJBzK/yIQOIOkK5dmCgEUstAi70fQAbDwia4x3+InVtUXiMfP0jY6XIlrk+Sf15NOx4crZuX8h+7g4iKH5/s2x4+MfS4QdkVf7eTG2h4GPSgvtK67TyW26Nm9Kcw/ChoCEhpEbORUXXBvcSnLermtAVcnVIzHWQ/dIRKFEJEOtsEqzYHvMkw6qCLSPGAS3Xl0nerOB+mInVXlDxn8u1RT0mItYLk8TQT9Uc+R6g3euLUmFX9mGRm6s93kLjNQvZGwZp/+2OnuC1Fp0JEcj2edSfB+BP6EjNr7VGaeRZwDB3qk=',
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
        value: '10a441d5d9f7eadee01ced3badc00f88', // Falls vorhanden
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
      },
      {
        name: 'cookies_piwik',
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