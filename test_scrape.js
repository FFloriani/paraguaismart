const fs = require('fs');
const cheerio = require('cheerio');

const prodHtml = fs.readFileSync('_reverse_engineering/product_detail.html', 'utf8');
const $ = cheerio.load(prodHtml);

const container = $('[class*="container-card-produtos-categ-lojas"]');
const children = container.children();

// Focus on first 2 offers - get FULL detail
let count = 0;
children.each((i, el) => {
  const text = $(el).text().replace(/\s+/g, ' ').trim();
  if (text.includes('US$') && count < 2) {
    count++;
    const row = $(el);
    
    console.log(`\n=== OFFER ${count} ===`);
    
    // ALL links
    row.find('a').each((j, a) => {
      const href = $(a).attr('href') || '';
      const target = $(a).attr('target') || '';
      console.log(`  LINK[${j}]: href="${href}" target="${target}"`);
    });
    
    // ALL images with ALL attributes
    row.find('img').each((j, img) => {
      const attrs = {};
      const el2 = $(img);
      ['src', 'data-src', 'data-original', 'alt', 'class', 'width', 'height'].forEach(attr => {
        const val = el2.attr(attr);
        if (val) attrs[attr] = val.substring(0, 120);
      });
      console.log(`  IMG[${j}]:`, JSON.stringify(attrs));
    });
  }
});

// Also check: is there a "redirect" link pattern anywhere?
console.log("\n\n--- Checking for redirect/outbound links ---");
const redirectLinks = $('a[href*="redirect"], a[href*="outbound"], a[href*="go/"], a[href*="redir"]');
console.log("Redirect pattern links:", redirectLinks.length);

// Check for onclick with redirect
const onclickLinks = $('a[onclick*="redirect"], a[onclick*="window.open"], a[onclick*="location"]');
console.log("Onclick redirect links:", onclickLinks.length);
onclickLinks.each((i, el) => {
  if (i < 3) {
    console.log(`  onclick[${i}]:`, $(el).attr('onclick')?.substring(0, 200));
  }
});

// Check for data-href or data-url
const dataHrefs = $('a[data-href], [data-url], [data-link]');
console.log("data-href/url elements:", dataHrefs.length);

// Check for links with class "btn" or button-like that could be the "ver no site" button
console.log("\n--- Buttons matching 'ver no site' ---");
$('a').each((i, el) => {
  const text = $(el).text().replace(/\s+/g, ' ').trim().toLowerCase();
  if (text.includes('ver no site') || text.includes('ir para') || text.includes('visitar')) {
    console.log(`  Found: text="${text.substring(0,50)}" href="${$(el).attr('href')?.substring(0, 120)}"`);
  }
});

// Check for the icon that looks like "open external" in the screenshots
console.log("\n--- Links with external icon class ---");
$('a[class*="icon"], a[class*="external"], a[class*="redirect"], a[class*="link-out"]').each((i, el) => {
  if (i < 5) {
    const href = $(el).attr('href') || '';
    const cls = $(el).attr('class') || '';
    console.log(`  ext[${i}]: class="${cls}" href="${href.substring(0, 120)}"`);
  }
});
