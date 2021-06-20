/* eslint-disable no-prototype-builtins */
const csv = require('csv-parser');
const fs = require('fs');

function parseCSV() {
  const results = [];
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // TODO
      // collect turnover per month for every client by client_id
      // calculate turnover amount for every month in the csv file (the year is also important)
      const holder = {};
      results.forEach((entry) => {
        const date = entry.date.slice(0, -3);
        if (holder.hasOwnProperty(entry.client_id)) {
          if (holder[entry.client_id].hasOwnProperty(date)) {
            holder[entry.client_id][date] = holder[entry.client_id][date] + Number(entry.amount);
          } else {
            holder[entry.client_id][date] = Number(entry.amount);
          }
        } else {
          holder[entry.client_id] = {};
          holder[entry.client_id][date] = Number(entry.amount);
        }
      });
      console.log(holder);
      return holder;
    });
}

parseCSV();
module.exports = parseCSV;
