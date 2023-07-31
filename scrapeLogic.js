
const puppeteer = require('puppeteer-extra')
require("dotenv").config();

// Add stealth plugin and use defaults 
const pluginStealth = require('puppeteer-extra-plugin-stealth')
const { executablePath } = require('puppeteer');

// Use stealth 
puppeteer.use(pluginStealth())

const scrapeLogic = (res) => {
  puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : executablePath(),
  }).then(async browser => {
    // Create a new page 
    const page = await browser.newPage();
    try {
      // Setting page view 
      await page.setViewport({ width: 1280, height: 720 });

      // Go to the website 
      await page.goto('https://otv.verwalt-berlin.de/ams/TerminBuchen?lang=en');

      const nxtButton = '.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.button.arrow-right'

      // Wait for security check 
      // await page.waitForTimeout(4000);
      await page.click('.link > .button');
      await page.waitForNavigation()
      await page.click('.XItem.XCheckbox.left-right')
      await page.click(nxtButton)
      await page.waitForNavigation()
      await page.waitForTimeout(3000);
      await page.select('#xi-sel-400', '327')
      await page.select('#xi-sel-422', '2')
      await page.select('#xi-sel-427', '1')
      await page.select('#xi-sel-428', '327-0')
      await page.waitForTimeout(3000);
      await page.click('.ozg-kachel.kachel-327-0-2.level1')
      await page.waitForTimeout(3000);
      await page.click('.ozg-accordion.accordion-327-0-2-1.level2')
      await page.waitForTimeout(3000);
      await page.click('#SERVICEWAHL_EN327-0-2-1-324659')
      await page.waitForTimeout(3000);
      await page.click(nxtButton)
      await page.waitForNavigation()
      await page.waitForTimeout(3000);

      const image = await page.screenshot();

      res.set('Content-Type', 'image/png');
      res.send(image);
    } catch (e) {
      console.error(e);
      res.send(`Something went wrong while running Puppeteer: ${e}`);
    }
    finally {
      await browser.close();
    }
  })
};

module.exports = { scrapeLogic };
