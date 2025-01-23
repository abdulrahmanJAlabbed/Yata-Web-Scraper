const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function scrapeWebsite() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    executablePath: '/usr/bin/google-chrome', // Path to Google Chrome
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1920,1080',
      '--start-maximized', // To start maximized
      '--incognito', // Launch Chrome in incognito mode
    ],
    ignoreDefaultArgs: ['--disable-extensions'] // In case you want to keep extensions
  });
  const page = await browser.newPage();

  try {
    const mainCategoryLinks = [
      { name: "yataklar", href: "https://www.yatasbedding.com.tr/yataklar" },
      { name: "yastik-yorgan", href: "https://www.yatasbedding.com.tr/yastik-yorgan" },
      { name: "ev-tekstili", href: "https://www.yatasbedding.com.tr/ev-tekstili" },
      { name: "baza-baslik", href: "https://www.yatasbedding.com.tr/baza-baslik" },
      { name: "bebek-cocuk", href: "https://www.yatasbedding.com.tr/bebek-cocuk" }
    ];

    const scrapedData = [];

    for (let mainCategoryLink of mainCategoryLinks) {
      let page_url = mainCategoryLink.href + '?isStock=true';
      await page.goto(page_url);

      async function repeatFunction() {
        return new Promise(async (resolve) => {
          let currentPage = 1;

          const getTotalPages = async () => {
            const productCountElement = await page.$('.product-list-count');
            if (productCountElement) {
              const productCountText = await page.evaluate(
                (element) => element.textContent.trim(),
                productCountElement
              );
              const totalProducts = parseInt(productCountText.match(/\d+/)[0]);
              return Math.ceil(totalProducts / 24);
            } else {
              return 0;
            }
          };

          const totalPages = await getTotalPages();

          const intervalId = setInterval(async () => {
            if (currentPage < totalPages) {
              await page.waitForSelector('#showMoreProductsBtn');
              await page.click('#showMoreProductsBtn');
              currentPage++;
            } else {
              clearInterval(intervalId);
              resolve();
            }
          }, 5000);
        });
      }

      await repeatFunction();

      const dataCodes = new Set();
      const products = await page.$$('.n1-product-box');

      for (let product of products) {
        const dataProductId = await product.evaluate((element) =>
          element.getAttribute('data-productid')
        );

        if (!dataCodes.has(dataProductId)) {
          let productName, productSize, productPrice, productUrl, productImageSrcset;

          try {
            productName = await product.$eval(
              '.n1-product-box-alternativename-container',
              (element) => element.textContent.trim()
            );
          } catch (error) {
            productName = null;
          }

          try {
            productSize = await product.$eval(
              '.product-detail-info-size-button span',
              (element) => element.textContent.trim()
            );
          } catch (error) {
            productSize = null;
          }

          try {
            productPrice = await product.$eval(
              '.n1-new-price',
              (element) => element.textContent.trim()
            );
          } catch (error) {
            productPrice = null;
          }

          try {
            productUrl = await product.$eval(
              '.n1-product-box-image a',
              (element) => element.href
            );
          } catch (error) {
            productUrl = null;
          }

          try {
            productImageSrcset = await product.$eval(
              '.n1-product-box-image a img',
              (source) => source.getAttribute('src')
            );
          } catch (error) {
            productImageSrcset = null;
          }

          const productCategory = mainCategoryLink.name;

          const productDetails = {
            id: dataProductId,
            productTitle: productName,
            productSize: productSize,
            price: productPrice,
            productUrl: productUrl,
            imageSrcset: productImageSrcset,
            category: productCategory,
          };

          console.log(productDetails); // Output each scraped result to the console

          scrapedData.push(productDetails);
          dataCodes.add(dataProductId);
        }
      }
    }

    const csvWriter = createCsvWriter({
      path: '../Data Analysis/csv/yatas_data.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'productTitle', title: 'Product Title' },
        { id: 'productSize', title: 'Size' },
        { id: 'price', title: 'Price' },
        { id: 'productUrl', title: 'URL' },
        { id: 'imageSrcset', title: 'Image URL' },
        { id: 'category', title: 'Category' },
      ],
    });

    await csvWriter.writeRecords(scrapedData);
    console.log('Data saved to yatas_data.csv');

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await browser.close();
  }
}

scrapeWebsite().then(() => {
  console.log('Scraping completed.');
});
