// Test that animation loop stops after game over
// Run with: node js/test-cancel-raf-runner.js
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { firefox } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 8898;
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, "..", req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, async () => {
  console.log(`Test server on port ${PORT}`);

  try {
    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.waitForSelector("#startGameBtn", { timeout: 10000 });

    // Start game
    await page.fill("#playerNameInput", "TestPlayer");
    await page.click("#startGameBtn");
    await page.waitForTimeout(2000);

    // Verify game is running
    const gameRunningBefore = await page.evaluate(() => typeof gameRunning !== "undefined" ? gameRunning : "not_found");
    console.log(`gameRunning before gameOver: ${gameRunningBefore}`);

    // Take a canvas snapshot while game is running
    const canvasData1 = await page.evaluate(() => {
      const c = document.getElementById("gameCanvas");
      return c.toDataURL();
    });

    // Wait a moment and take another snapshot - should be different (game animating)
    await page.waitForTimeout(200);
    const canvasData2 = await page.evaluate(() => {
      const c = document.getElementById("gameCanvas");
      return c.toDataURL();
    });

    const canvasChanged = canvasData1 !== canvasData2;
    console.log(`Canvas changed while game running: ${canvasChanged}`);

    // Trigger game over
    await page.evaluate(() => {
      if (typeof gameOver === "function") gameOver();
    });

    // Wait for dialog
    await page.waitForSelector("#gameOverDialog", { timeout: 5000, state: "visible" });
    console.log("Game over dialog visible");

    // Check state after game over
    const afterState = await page.evaluate(() => ({
      gameRunning: typeof gameRunning !== "undefined" ? gameRunning : "not_found",
      animationFrameId: typeof animationFrameId !== "undefined" ? animationFrameId : "not_found",
    }));

    console.log(`gameRunning after gameOver: ${afterState.gameRunning}`);
    console.log(`animationFrameId after gameOver: ${afterState.animationFrameId}`);

    // Take two snapshots after game over - should be identical (no animation)
    await page.waitForTimeout(300);
    const canvasData3 = await page.evaluate(() => {
      const c = document.getElementById("gameCanvas");
      return c.toDataURL();
    });

    await page.waitForTimeout(300);
    const canvasData4 = await page.evaluate(() => {
      const c = document.getElementById("gameCanvas");
      return c.toDataURL();
    });

    const canvasStopped = canvasData3 === canvasData4;
    console.log(`Canvas stopped after gameOver: ${canvasStopped}`);

    console.log(`\n=== Results ===`);
    console.log(`animationFrameId is null: ${afterState.animationFrameId === null}`);
    console.log(`gameRunning is false: ${afterState.gameRunning === false}`);
    console.log(`Canvas frozen: ${canvasStopped}`);

    const passed = afterState.animationFrameId === null && afterState.gameRunning === false;

    if (passed) {
      console.log("\nPASSED: Animation loop properly cancelled on game over.");
    } else {
      console.log("\nFAILED: Animation loop not cancelled properly.");
    }

    await browser.close();
    server.close();
    process.exit(passed ? 0 : 1);
  } catch (e) {
    console.error("Test error:", e.message);
    server.close();
    process.exit(1);
  }
});
