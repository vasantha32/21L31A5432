const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const windowSize = 10;
const window = [];

const thirdPartyServer = 'http://20.244.56.144/test';
const bearerToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxOTc0MDM3LCJpYXQiOjE3MjE5NzM3MzcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjlmMmVmOTQxLWM5N2QtNDM3Ny05NWNiLTIxYmJjODVjMTMwYyIsInN1YiI6InZhc2FudGhhamV0dGkyMDAzQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IlZpZ25hbidzIEluc3RpdHV0ZSBvZiBJbmZvcm1hdGlvbiBhbmQgVGVjaG5vbG9neSIsImNsaWVudElEIjoiOWYyZWY5NDEtYzk3ZC00Mzc3LTk1Y2ItMjFiYmM4NWMxMzBjIiwiY2xpZW50U2VjcmV0IjoibFRoWnhmRVlMU1hsQWF4cyIsIm93bmVyTmFtZSI6IlZhc2FudGhhIExheG1pIEpldHRpIiwib3duZXJFbWFpbCI6InZhc2FudGhhamV0dGkyMDAzQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxTDMxQTU0MzIifQ.funCjV4xQl1kqccbyQAFIow1fJfRlrJXH7TrM4pEdK8';
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`${thirdPartyServer}/${type}`, {
      timeout: 500,
      headers: {
        Authorization: `Bearer: ${bearerToken}`
      }
    });
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return '0.00';
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  if (!['primes', 'fibo', 'even', 'rand'].includes(type)) {
    return res.status(400).send({ error: 'Invalid number type' });
  }

  const fetchedNumbers = await fetchNumbers(type);
  const uniqueNumbers = [...new Set(fetchedNumbers)];
  const prevState = [...window];

  uniqueNumbers.forEach(num => {
    if (!window.includes(num)) {
      if (window.length >= windowSize) {
        window.shift();
      }
      window.push(num);
    }
  });

  const avg = calculateAverage(window);
  const response = {
    windowPrevState: prevState,
    windowCurrState: window,
    numbers: fetchedNumbers,
    avg: avg
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Average Calculator microservice running on http://localhost:${port}`);
});
