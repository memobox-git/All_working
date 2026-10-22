// Saves the body of a media response that the page's own <video> requests.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [page_url, pattern, out] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: pattern, requestStage: 'Response' }] });
  let saved = false;
  cdp.on('Fetch.requestPaused', async e => {
    const range = (e.responseHeaders || []).find(h => h.name.toLowerCase() === 'content-range');
    console.log('paused', e.responseStatusCode, range && range.value);
    if (!saved && (e.responseStatusCode === 200 || e.responseStatusCode === 206)) {
      try {
        const r = await cdp.send('Fetch.getResponseBody', { requestId: e.requestId });
        const buf = Buffer.from(r.body, r.base64Encoded ? 'base64' : 'utf8');
        fs.writeFileSync(out, buf); saved = true; console.log('saved', buf.length);
      } catch (err) { console.log('body error', err.message); }
    }
    await cdp.send('Fetch.continueRequest', { requestId: e.requestId }).catch(() => {});
  });
  await p.goto(page_url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('goto', e.message.slice(0, 80)));
  for (let k = 0; k < 40 && !saved; k++) await p.waitForTimeout(3000);
  await b.close();
})();
