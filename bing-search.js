const axios = require('axios');

const BING_API_KEY = process.env.BING_API_KEY;
const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';

async function searchBing(query) {
  try {
    const response = await axios.get(BING_ENDPOINT, {
      params: { q: query, mkt: 'pt-BR', count: 3 },
      headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY }
    });
    const webPages = response.data.webPages?.value || [];
    let summary = '';
    webPages.forEach((page, i) => {
      summary += `${i + 1}. ${page.name}: ${page.snippet}\n${page.url}\n\n`;
    });
    return summary || 'Nenhum resultado encontrado.';
  } catch (err) {
    console.error('Erro Bing Search:', err.message);
    return 'Desculpe, não consegui realizar a busca.';
  }
}

module.exports = { searchBing };
