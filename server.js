const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const CommissionManager = require("./commissionManager");

//ENDPOINTS
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/transaction", async (req, res) => {
  const reqData = req.body;
  const rates = await convertToEUR(reqData.currency);
  const CM = new CommissionManager(
    reqData.client_id,
    (reqData.amount / rates[0][1]).toFixed(2),
    reqData.date
  );
  const amount = await CM.getCommission();
  res.send({ amount: amount, currency: "EUR" });
});

//FUNCTIONS
async function getRates(currency) {
  const res = await axios.get("https://api.exchangerate.host/latest");
  const entries = Object.entries(res.data.rates);
  const requiredEntry = entries.filter((entry) => entry[0] === currency);
  return requiredEntry;
}

async function convertToEUR(currency) {
  let rate = 1;
  if (currency !== "EUR") {
    const res = await getRates(currency);
    return res;
  }
  return rate;
}

module.exports = app;
