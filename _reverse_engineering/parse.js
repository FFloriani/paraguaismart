const fs = require('fs');

async function parseDom() {
  const html = fs.readFileSync('fetch_search.html', 'utf8');
  
  // Try to extract the first product block. Often it's defined by an article tag or a list item with a specific class inside resultado-busca-container
  const resultadoMatch = html.match(/id="resultado-busca-container"[^>]*>([\s\S]*?)<div class="row align-items-center">/);
  if (resultadoMatch) {
    const list = resultadoMatch[1];
    const firstProduct = list.split('href="/')[1].split('</a>')[0];
    console.log("First product summary block:", '<a href="/' + firstProduct + '</a>');
  }

  const prodHtml = fs.readFileSync('fetch_product.html', 'utf8');
  // See if there's a store list or something containing prices
  const prodMatch = prodHtml.match(/id="lojas-produto"[^>]*>([\s\S]*?)<\/section>/);
  if (prodMatch) {
    console.log("Found store list section in product page, length:", prodMatch[1].length);
  } else {
    // maybe look for standard classes
    const classes = Array.from(prodHtml.matchAll(/class="([^"]+)"/g)).map(m => m[1]);
    const storeClasses = [...new Set(classes)].filter(c => c.includes('loja') || c.includes('price') || c.includes('preco'));
    console.log("Produto page specific classes:", storeClasses.slice(0, 10));
  }
}
parseDom();
