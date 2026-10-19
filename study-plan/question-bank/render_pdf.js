// Prints question-bank.html to staff-de-interview-question-bank.pdf, with page numbers in the footer.
// Usage: node render_pdf.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'question-bank.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(__dirname, 'staff-de-interview-question-bank.pdf'),
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font-size:7.5pt;color:#5A5F6E;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif">
      <span>Senior → Staff Data Engineer · Interview Question Bank</span>
      <span>joinstackle.com · <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
  });
  await browser.close();
  console.log('wrote staff-de-interview-question-bank.pdf');
})();
