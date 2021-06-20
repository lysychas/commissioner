const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

const CommissionManager = require('./commissionManager');

//ENDPOINTS
app.get('/', function (req, res) {
  res.send('Hello World');
});

app.post('/transaction', function (req, res) {
  const reqData = req.body;
  convertToEUR(reqData.currency).then((rate) => {
    const CM = new CommissionManager(
      reqData.client_id,
      reqData.amount / rate,
      reqData.date
    );
    CM.getCommission().then((data) =>
      res.send({
        amount: data,
        currency: 'EUR',
      })
    );
  });
});

//FUNCTIONS
async function getRates(currency) {
  const response = await fetch('https://api.exchangerate.host/latest');
  const data = await response.json().then((data) => {
    const entries = Object.entries(data.rates);
    const requiredEntry = entries.find(([key]) => key === currency);
    return requiredEntry;
  });
  return data;
}

async function convertToEUR(currency) {
  let rate = 1;
  if (currency !== 'EUR') {
    return await getRates(currency).then((data) => {
      rate = data[1];
      return rate;
    });
  }
  return rate;
}

module.exports = app;
