# Yataş Web Scraper

A powerful web scraper designed for the Yataş Bedding website. This tool extracts product details, sizes, prices, and categories, and saves the data in a structured CSV file.

## ✨ Features
- Scrapes product details, including title, size, price, and category.
- Handles dynamic product loading with "Load More" functionality.
- Exports the scraped data to a CSV file.

## 📋 Prerequisites
- **Node.js** (>= 16.0.0)
- **Google Chrome** or **Chromium** installed on your machine.
- Basic knowledge of JavaScript and Puppeteer.

## 📦 Installation

1. Clone the repository:
```bash
   git clone https://github.com/yourusername/yatas-web-scraper.git
   cd yatas-web-scraper
```
2. Install dependencies:
```bash
npm install puppeteer csv-writer
```
3. Run the scraper:
```bash
node yatas.js
```
4.The scraped data will be saved as a CSV file in the specified directory (default: ../Data Analysis/csv/yatas_data.csv).

> [!WARNING]  
> Puppeteer requires the path to your Chrome executable. For Windows, update the executablePath in the script to the default Chrome location:
> ```bash
>executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
> ```

##🗂️ Output
The CSV file includes the following columns:

- ID: Unique identifier for each product.
- Product Title: Name of the product.
- Size: Size of the product, if available.
- Price: Price of the product.
- URL: URL of the product page.
- Image URL: URL of the product image.
- Category: Main category of the product.

##📚 Dependencies
Puppeteer: Headless browser automation library.
csv-writer: A library for writing CSV files.

##📝 Notes
Ensure a stable internet connection while running the scraper.
The scraper runs in non-headless mode by default for debugging purposes. To enable headless mode, set headless: true in the Puppeteer launch options.
Adjust the "Load More" delay if necessary to accommodate slower loading speeds.

🎉 Happy scraping! 🚀
