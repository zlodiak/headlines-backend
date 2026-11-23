const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const express = require('express');
const app = express();
const PORT = process.env.PORT;

const { GigaChat } = require('gigachat');
const https = require('node:https');
const Agent = https.Agent;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const giga = new GigaChat({
  credentials: process.env.GIGACHAT_AUTH_KEY,
  scope: 'GIGACHAT_API_PERS', // Для физлиц (для юрлиц: GIGACHAT_API_B2B или GIGACHAT_API_CORP)
  model: 'GigaChat-2-Pro',   // Актуальная модель (также есть GigaChat-2, GigaChat-2-Max)
  httpsAgent: httpsAgent,
});

app.get('/', (req, res) => {
  res.send(`Сервер работает на порту ${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get("/api/generate-headlines", async (req, res) => {
    console.log('получен параметр:', req.query.searchValue);
    if (!req.query.searchValue.trim()) {
        return res.status(400).json({ error: 'Поле темы обязательно' });
    }

    try {
        const searchValue = req.query.searchValue;
        const prompt = `Придумай 10 креативных заголовков для статьи на тему: "${searchValue}". Каждый заголовок - не более 10 слов, цепляющий и вовлекающий. Верни результат в формате JSON, ключами которого являются числа от единицы`;

        const response = await giga.chat({
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        });

        let answer = response.choices[0]?.message?.content?.trim();
        answer = answer.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const answerJSON = JSON.parse(answer);

        console.log(answer);

        res.status(200).type('json').send({ 
            data: answerJSON,
            error: null
        });        
    } catch (error) {
        console.error('Ошибка GigaChat API:', error);
        res.status(500).type('json').send({ 
            data: null,
            error: 'Не удалось получить ответ от нейросети'
        });           
    }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
