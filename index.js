const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const { searchBing } = require('./bing-search');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const bingResults = await searchBing(message);

    const prompt = `
Você é um assistente útil e amigável que responde com base nas informações a seguir, retiradas de buscas recentes na internet:

${bingResults}

Com base nisso, responda a pergunta do usuário: ${message}
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um assistente útil e objetivo.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 700,
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Desculpe, não consegui processar sua solicitação.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
