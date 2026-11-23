const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Сервер работает на порту 5000');
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

app.post("/api/generate-headlines", (req, res) => {
    const headlines = {
        "qwqwqw": "wewewewe",
        "azazazaaz": "xsxsxsxsxs",
        "fgfgfgfg": "fgfgfgfgfg",
        "cvcccvcvc": "deededeeded",
        "uiuiuuiuiui": "dfdfdfdfdfd",
        "mnmnmnmnnnm": "defdedefefef"
    };
    res.status(200).type('json').send({ 
        data: headlines,
        error: null
    });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
