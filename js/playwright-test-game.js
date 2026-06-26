// run with `node ./js/test-game.js
// requires npm install playwright ; npx playwright install firefox

const { firefox } = require("playwright");

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  // configurable ranges via env, with sensible defaults
  const MIN_REPEAT_MS = Number(process.env.MIN_REPEAT_MS) || 100; // lower bound for interval
  const MAX_REPEAT_MS = Number(process.env.MAX_REPEAT_MS) || 1000; // upper bound for interval

  const MIN_GAP_MS = Number(process.env.MIN_GAP_MS) || 20; // min gap between the two Space presses when doing a double
  const MAX_GAP_MS = Number(process.env.MAX_GAP_MS) || 300; // max gap for the double press

  // Probability (0..1) of performing a double-press on a given tick
  const DOUBLE_PROB = Number(process.env.DOUBLE_PROB) || 0.7;

  const URL = "https://synapsescribe.github.io/Negruta-Website/#cat-game";

  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(URL);

  await page.fill("#playerNameInput", "NegrutaFan");
  await page.click("#startGameBtn");
  await page.waitForSelector("#gameCanvas");
  await page.bringToFront();

  // make canvas focusable and focus it
  await page.evaluate(() => {
    const c = document.querySelector("#gameCanvas");
    if (c) {
      c.tabIndex = c.tabIndex || 0;
      c.style.outline = c.style.outline || "none";
      c.focus();
    }
    // also ensure window is focused
    try {
      window.focus();
    } catch (e) {
      console.log("e: " + e);
    }
  });

  // small sequential loop to avoid overlapping
  let running = true;
  process.on("SIGINT", async () => {
    running = false;
    console.log("Stopping...");
    try {
      await browser.close();
    } catch (e) {
      console.log("e: " + e);
    }
    process.exit(0);
  });

  console.log("Adaptive runner started. Press Ctrl-C to stop.");

  async function doSinglePress() {
    await page.keyboard.down("Space");
    await page.keyboard.up("Space");
  }

  async function doDoublePress(gapMs) {
    await page.keyboard.down("Space");
    await page.keyboard.up("Space");
    await page.waitForTimeout(gapMs);
    await page.keyboard.down("Space");
    await page.keyboard.up("Space");
  }

  while (running) {
    try {
      const repeat = randInt(MIN_REPEAT_MS, MAX_REPEAT_MS);
      const willDouble = Math.random() < DOUBLE_PROB;
      if (willDouble) {
        const gap = randInt(MIN_GAP_MS, MAX_GAP_MS);
        await doDoublePress(gap);
        console.log(`double (gap ${gap}ms) — next in ${repeat}ms`);
      } else {
        await doSinglePress();
        console.log(`single — next in ${repeat}ms`);
      }
      await page.waitForTimeout(repeat);
    } catch (e) {
      console.error("Error during press loop:", e);
      // small delay before retrying on error
      await page.waitForTimeout(500);
    }
  }
})();
