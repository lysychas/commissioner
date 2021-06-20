/* eslint-disable no-prototype-builtins */
const csv = require('csv-parser');
const fs = require('fs');
const { finished } = require('stream/promises');

async function parseCSV() {
  const results = [];
  const holder = {};
  const parser = fs
    .createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.forEach((entry) => {
        const date = entry.date.slice(0, -3);
        if (holder.hasOwnProperty(entry.client_id)) {
          if (holder[entry.client_id].hasOwnProperty(date)) {
            holder[entry.client_id][date] =
              holder[entry.client_id][date] + Number(entry.amount);
          } else {
            holder[entry.client_id][date] = Number(entry.amount);
          }
        } else {
          holder[entry.client_id] = {};
          holder[entry.client_id][date] = Number(entry.amount);
        }
      });
    })
    .on('error', (error) => {
      console.log(error);
    });
  await finished(parser);
  return holder;
}

module.exports = parseCSV;
