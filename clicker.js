const { firefox } = require('playwright');

(async () => {
  const REPEAT_MS = Number(process.env.REPEAT_MS) || 20; // how often to attempt double-jump
  const GAP_MS = Number(process.env.GAP_MS) || 8; // gap between two space presses
  const URL = 'https://synapsescribe.github.io/Negruta-Website/#cat-game';

  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(URL);
  await page.fill('#playerNameInput', 'NegrutaFan');
  await page.click('#startGameBtn');
  await page.waitForSelector('#gameCanvas');
  await page.bringToFront();

  // sequential loop (avoids piling up async setInterval calls)
  let running = true;
  process.on('SIGINT', async () => {
    running = false;
    console.log('Stopping...');
    try { await browser.close(); } catch (e) {}
    process.exit(0);
  });

  console.log(`Starting double-space loop (repeat ${REPEAT_MS} ms, gap ${GAP_MS} ms). Ctrl-C to stop.`);

  async function doubleSpace() {
    // first press
    await page.keyboard.press('Space');
    // tiny gap
    await page.waitForTimeout(GAP_MS);
    // second press
    await page.keyboard.press('Space');
  }

  while (running) {
    try {
      await doubleSpace();
    } catch (e) {
      console.error('Error sending keys:', e);
    }
    await page.waitForTimeout(REPEAT_MS);
  }
})();
