// Saves a launch video exactly as the browser receives it on its launch page,
// for hosts that refuse plain downloads (x.ai):
// the request goes through without its Range header, and the whole
// response body is written out. Usage: node grab-media.js <page> <url-part> <out>
const { chromium } = require('playwright');
const fs = require('fs');
const [page, match, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  let done;
  const finished = new Promise(r => (done = r));
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: `*${match}*`, requestStage: 'Request' }, { urlPattern: `*${match}*`, requestStage: 'Response' }] });
  cdp.on('Fetch.requestPaused', async e => {
    try {
      if (e.responseStatusCode === undefined) {
        const headers = Object.entries(e.request.headers).filter(([k]) => k.toLowerCase() !== 'range').map(([name, value]) => ({ name, value }));
        await cdp.send('Fetch.continueRequest', { requestId: e.requestId, headers });
      } else {
        console.log('response', e.responseStatusCode, e.request.url.slice(0, 120));
        if (e.responseStatusCode === 200) {
          const { body, base64Encoded } = await cdp.send('Fetch.getResponseBody', { requestId: e.requestId });
          fs.writeFileSync(out, Buffer.from(body, base64Encoded ? 'base64' : 'utf8'));
          console.log('saved', fs.statSync(out).size);
          done();
        }
        await cdp.send('Fetch.continueRequest', { requestId: e.requestId }).catch(() => {});
      }
    } catch (err) { console.log('err', err.message.slice(0, 120)); }
  });
  await p.goto(page, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await p.evaluate(() => { const v = document.querySelector('video'); if (v) { v.preload = 'auto'; v.load(); } });
  await Promise.race([finished, p.waitForTimeout(150000)]);
  await b.close();
})();
