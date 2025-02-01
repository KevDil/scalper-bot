import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.alternate.de/MSI/GeForce-RTX-5080-GAMING-TRIO-OC-WHITE-Grafikkarte/html/product/100107958');
    const htmlData = await response.text();
    const available = htmlData.includes('Auf Lager');
    res.status(200).json({ available: available });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};