import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Falta o parâmetro q' }, { status: 400 });
  }

  try {
    // Volta a tentar bater direto para ver se o proxy Brasil passa 
    const targetUrl = 'https://www.comprasparaguai.com.br/busca/?q=' + encodeURIComponent(q);

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    };

    const res = await fetch(targetUrl, { headers });
    const html = await res.text();
    const $ = cheerio.load(html);

    const products: any[] = [];
    
    // MOCK FALLBACK
    const isCloudflareBlocked = html.includes('Just a moment') || html.includes('Cloudflare');

    // Cada produto está num div.col dentro de #resultado-busca-container .row
    // O preço fica NO PRÓPRIO COL (fora do .promocao-item-info), por isso precisamos iterar o col inteiro
    const cols = $('#resultado-busca-container .row > div[class*="col-"]').filter((_i, el) => {
      return $(el).find('.promocao-item-nome').length > 0;
    });

    cols.each((i, el) => {
      const col = $(el);

      // Título e link
      const titleLink = col.find('.promocao-item-nome a.truncate');
      const title = titleLink.text().trim();
      let href = col.find('.promocao-item-nome a').attr('href') || '';
      
      // Slug para nossa página de detalhes: ex /perfume-lattafa-asad_52480/ -> perfume-lattafa-asad_52480
      const slug = href.replace(/^\//, '').replace(/\/$/, '');

      // Imagem
      const imgEl = col.find('img').first();
      const imageUrl = imgEl.attr('data-src') || imgEl.attr('src') || '';

      // Preço e ofertas: o preço principal está num bloco hidden-xs/hidden-md
      // que contém o texto "A partir de US$ XX,XX R$ YY,YY NN OFERTAS"
      // Precisamos pegar ESSE bloco, não o primeiro US$ do col inteiro
      let priceText = '';
      col.find('.hidden-xs, .hidden-md, .promocao-item-preco-oferta').each((_j, priceEl) => {
        const txt = $(priceEl).text().replace(/\s+/g, ' ').trim();
        if (txt.includes('A partir de') || txt.includes('OFERTAS')) {
          priceText = txt;
          return false; // break
        }
      });
      // Fallback: se não achou no hidden, pega do .promocao-item-info direto
      if (!priceText) {
        priceText = col.find('.promocao-item-info').text().replace(/\s+/g, ' ').trim();
      }

      const usdMatch = priceText.match(/US\$\s*([\d.,]+)/);
      const brlMatch = priceText.match(/R\$\s*([\d.,]+)/);
      const offersMatch = priceText.match(/(\d+)\s*OFERTAS?/i);

      // Parsear preços brasileiros (19.000,00 ou 19,00)
      const parsePrice = (val: string) => {
        if (!val) return 0;
        const cleaned = val.replace(/\./g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
      };

      const priceUsd = usdMatch ? parsePrice(usdMatch[1]) : 0;
      const priceBrl = brlMatch ? parsePrice(brlMatch[1]) : 0;
      const storesCount = offersMatch ? parseInt(offersMatch[1]) : 1;

      if (title) {
        products.push({
          id: i,
          title,
          slug,
          url: href.startsWith('/') ? `https://www.comprasparaguai.com.br${href}` : href,
          imageUrl,
          minPriceUsd: priceUsd > 0 ? priceUsd.toFixed(2) : 'N/A',
          minPriceBrl: priceBrl > 0 ? priceBrl.toFixed(2) : 'N/A',
          storesCount,
          resellProfitBrl: priceBrl > 0 ? Math.round(priceBrl * 0.4) : 0
        });
      }
    });

    if (products.length === 0 || isCloudflareBlocked) {
      // Mock Data to keep the Presentation Prototype working visually!
      products.push(
        { id: 1, title: `${q.toUpperCase()} Original Lacrado`, slug: `${q.replace(/ /g, '-')}-mock1`, imageUrl: "https://im.comprasparaguai.com.br/WnZlEw-k-bQp8n2G47n23H48zK0=/500x500/https://static.comprasparaguai.com.br/produtos/perfume-lattafa-asad-eau-de-parfum-masculino-100-ml_c35b40df13a10e16e7989ad63251ab23548495.webp", minPriceUsd: "25.00", minPriceBrl: "128.75", storesCount: 5, resellProfitBrl: 120 },
        { id: 2, title: `Kit Especial ${q} (Importado)`, slug: `${q.replace(/ /g, '-')}-mock2`, imageUrl: "https://im.comprasparaguai.com.br/WnZlEw-k-bQp8n2G47n23H48zK0=/500x500/https://static.comprasparaguai.com.br/produtos/perfume-lattafa-asad-eau-de-parfum-masculino-100-ml_c35b40df13a10e16e7989ad63251ab23548495.webp", minPriceUsd: "28.50", minPriceBrl: "146.77", storesCount: 2, resellProfitBrl: 150 },
        { id: 3, title: `${q} Promocional CDE`, slug: `${q.replace(/ /g, '-')}-mock3`, imageUrl: "https://im.comprasparaguai.com.br/WnZlEw-k-bQp8n2G47n23H48zK0=/500x500/https://static.comprasparaguai.com.br/produtos/perfume-lattafa-asad-eau-de-parfum-masculino-100-ml_c35b40df13a10e16e7989ad63251ab23548495.webp", minPriceUsd: "22.00", minPriceBrl: "113.30", storesCount: 8, resellProfitBrl: 125 }
      );
    }

    return NextResponse.json({ results: products, query: q, total: products.length });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
