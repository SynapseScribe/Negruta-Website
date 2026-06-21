// run with `node ./js/test-game.js
	// requires 


const { firefox } = require('playwright');

(async () => {
  const REPEAT_MS = 300; // time between double-jump attempts
  const GAP_MS = 300; // gap between the two Space presses
  const URL = 'https://synapsescribe.github.io/Negruta-Website/#cat-game';

  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(URL);

  await page.fill('#playerNameInput', 'NegrutaFan');
  await page.click('#startGameBtn');
  await page.waitForSelector('#gameCanvas');
  await page.bringToFront();

  // make canvas focusable and focus it
  await page.evaluate(() => {
    const c = document.querySelector('#gameCanvas');
    if (c) {
      c.tabIndex = c.tabIndex || 0;
      c.style.outline = c.style.outline || 'none';
      c.focus();
    }
    // also ensure window is focused
    window.focus();
  });

  // small sequential loop to avoid overlapping
  let running = true;
  process.on('SIGINT', async () => {
    running = false;
    try { await browser.close(); } catch (e) {}
    process.exit(0);
  });

  console.log(`Double-space runner started (repeat ${REPEAT_MS} ms, gap ${GAP_MS} ms). Ctrl-C to stop.`);

  async function doubleSpace() {
    // first press (down/up)
    await page.keyboard.down('Space');
    await page.keyboard.up('Space');

    // tiny gap
    await page.waitForTimeout(GAP_MS);

    // second press
    await page.keyboard.down('Space');
    await page.keyboard.up('Space');
  }

  while (running) {
    try { await doubleSpace(); } catch (e) { console.error(e); }
    await page.waitForTimeout(REPEAT_MS);
  }
})();