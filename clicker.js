const { firefox } = require('playwright');

(async () => {
  const REPEAT_MS = Number(process.env.REPEAT_MS) || 10; // how often to attempt double-jump (tune lower/higher)
  const URL = 'https://synapsescribe.github.io/Negruta-Website/#cat-game';

  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(URL);
  await page.fill('#playerNameInput', 'NegrutaFan');
  await page.click('#startGameBtn');
  await page.waitForSelector('#gameCanvas');
  await page.bringToFront();

  // Run double-space inside the page (microtask gap between the two key events)
  await page.evaluate(({ repeatMs }) => {
    function sendSpace() {
      // keydown + keyup pair (matches window handler checking e.code === "Space")
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keyup',   { code: 'Space', key: ' ', bubbles: true }));
    }

    setInterval(() => {
      // first press
      sendSpace();
      // second press in a microtask — tiny non-zero gap but before next rAF/frame
      Promise.resolve().then(() => sendSpace());
    }, repeatMs);
  }, { repeatMs: REPEAT_MS });

  console.log(`Double-space runner started (repeat ${REPEAT_MS} ms). Ctrl-C to stop.`);
  await new Promise(() => {}); // run forever
})();