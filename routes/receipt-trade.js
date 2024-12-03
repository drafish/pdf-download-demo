var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();
const stream = require('stream');

router.post('/download-receipt-trade', async function (req, res, next) {
  const { tradeId, username, useremail, buyCurrency, sellCurrency, createDate, rate, buyAmount, sellAmount } = req.body;
  if (!tradeId || !username || !useremail || !buyCurrency || !sellCurrency || !createDate || !rate || !buyAmount || !sellAmount) {
    return res.status(400).send('missing parameters');
  }

  try {
    const htmlContent = await new Promise((resolve, reject) => {
      res.render('receipt-trade', req.body, (err, html) => {
        if (err) {
          return reject(err);
        }
        resolve(html);
      });
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      footerTemplate: `
          <div style="font-size:12px; width:100%; text-align:right; padding-right:10pt;">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
      `,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${createDate}_${tradeId}_${username}_OTC Trade Receipt.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    const readStream = new stream.PassThrough();
    readStream.end(pdfBuffer);

    readStream.pipe(res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;
