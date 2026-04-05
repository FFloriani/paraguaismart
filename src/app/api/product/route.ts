import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Falta o parâmetro slug' }, { status: 400 });
  }

  try {
    const targetUrl = `https://www.comprasparaguai.com.br/${slug}/`;
    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl);

    const res = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    // ===== Dados principais do produto =====
    const mainTitle = $('h1').first().text().trim() || $('title').text().trim();
    const mainImage = $('meta[property="og:image"]').attr('content') || '';

    // Remover parsing global do body, vamos pegar o preço mínimo das ofertas reais
    const parsePrice = (val: string) => {
      if (!val) return 0;
      return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0;
    };

    // ===== Lista de ofertas por loja =====
    const offers: any[] = [];

    const offerContainer = $('[class*="container-card-produtos-categ-lojas"]');
    const offerRows = offerContainer.children();

    offerRows.each((i, el) => {
      const row = $(el);
      const rowText = row.text().replace(/\s+/g, ' ').trim();

      // Filtrar só rows que contêm preço
      if (!rowText.includes('US$') && !rowText.includes('R$')) return;

      // Preço
      const usdMatch = rowText.match(/US\$\s*([\d.,]+)/);
      const brlMatch = rowText.match(/R\$\s*([\d.,]+)/);

      // Título do produto na oferta (primeiro <a> dentro do row)
      const firstLink = row.find('a').first();
      const offerTitle = firstLink.text().trim();

      // ===== LINK CORRETO PARA O PRODUTO NA LOJA =====
      // O ComprasParaguai usa a classe "btn-store-redirect" para o link que vai direto ao produto na loja
      const storeRedirectBtn = row.find('a.btn-store-redirect, a[class*="store-redirect"]');
      const storeUrl = storeRedirectBtn.attr('href') || '';

      // ===== WHATSAPP =====
      const waLink = row.find('a[href*="whatsapp"]').attr('href') || '';

      // ===== LOGO DA LOJA =====
      // Logos usam lazy loading com class="lozad store-image"
      // A imagem real está em data-src, não em src (que aponta para placeholder)
      const storeImg = row.find('img.store-image, img[class*="store-image"]');
      const storeLogoUrl = storeImg.attr('data-src') || storeImg.attr('src') || '';
      const storeName = storeImg.attr('alt') || '';

      // ===== IMAGEM DO PRODUTO =====
      // A primeira img (antes da store-image) é a foto do produto naquela loja
      const allImgs = row.find('img');
      let productImgUrl = '';
      allImgs.each((_j, img) => {
        const cls = $(img).attr('class') || '';
        if (!cls.includes('store-image') && !productImgUrl) {
          productImgUrl = $(img).attr('data-src') || $(img).attr('src') || '';
          // Ignorar placeholders
          if (productImgUrl.includes('loading-images') || productImgUrl.includes('placeholder')) {
            productImgUrl = $(img).attr('data-src') || '';
          }
        }
      });

      // Filtrar logos com URL de placeholder
      let cleanLogoUrl = storeLogoUrl;
      if (cleanLogoUrl.includes('loading-images') || cleanLogoUrl.includes('placeholder')) {
        cleanLogoUrl = storeImg.attr('data-src') || '';
      }
      // Adicionar domínio base se necessário
      if (cleanLogoUrl && cleanLogoUrl.startsWith('/')) {
        cleanLogoUrl = `https://www.comprasparaguai.com.br${cleanLogoUrl}`;
      }
      if (productImgUrl && productImgUrl.startsWith('/')) {
        productImgUrl = `https://www.comprasparaguai.com.br${productImgUrl}`;
      }

      offers.push({
        id: offers.length,
        title: offerTitle || storeName,
        storeName: storeName,
        storeLogoUrl: cleanLogoUrl,
        productImgUrl,
        priceUsd: usdMatch ? parsePrice(usdMatch[1]).toFixed(2) : 'N/A',
        priceBrl: brlMatch ? parsePrice(brlMatch[1]).toFixed(2) : 'N/A',
        whatsappUrl: waLink,
        storeUrl: storeUrl, // Link direto pro produto na loja (não homepage!)
      });
    });

    // Ordenar ofertas pelo preço USD
    offers.sort((a, b) => {
      const p1 = parseFloat(a.priceUsd) || 999999;
      const p2 = parseFloat(b.priceUsd) || 999999;
      return p1 - p2;
    });

    const lowestOffer = offers.length > 0 ? offers[0] : null;

    return NextResponse.json({
      product: {
        title: mainTitle,
        imageUrl: mainImage,
        minPriceUsd: lowestOffer && lowestOffer.priceUsd !== 'N/A' ? lowestOffer.priceUsd : 'N/A',
        minPriceBrl: lowestOffer && lowestOffer.priceBrl !== 'N/A' ? lowestOffer.priceBrl : 'N/A',
        sourceUrl: targetUrl,
      },
      offers,
      totalOffers: offers.length,
    });
  } catch (error) {
    console.error('Product scraping error:', error);
    return NextResponse.json({ error: 'Erro ao buscar detalhes do produto' }, { status: 500 });
  }
}
