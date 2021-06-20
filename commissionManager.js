const parseCSV = require('./parsecsv');

class CommissionManager {
  constructor(clientId, amount, date) {
    this.commissionPercentage = 0.005;
    this.turnoverCommission = 0.04;
    this.turnoverAmount = 1000;
    this.amount = amount;
    this.commission = (amount * this.commissionPercentage).toFixed(2);
    this.clientId = clientId;
    this.date = date;
  }

  // TODO
  // array of rules
  // vienas kintamasis atsakingas už rules

  async showData() {
    const records = await parseCSV();
    return records;
  }

  checkIfAmountLessThan5Cent() {
    if (this.amount <= 0.05) {
      this.commission = 0.01;
      return true;
    }
  }

  checkIfCommissionLessThan5Cent() {
    if (this.commission < 0.05) {
      this.commission = 0.05;
    }
  }

  checkClientID() {
    if (this.clientId === 42) {
      this.commission = 0.05;
      return true;
    }
  }

  async checkTurnover() {
    await this.showData().then((data) => {
      const date = this.date.slice(0, -3);
      const entryExists = typeof data[this.clientId];
      if (entryExists != 'undefined') {
        if (this.amount + data[this.clientId][date] >= this.turnoverAmount) {
          this.commission = this.turnoverCommission;
        }
      } else {
        if (this.amount >= this.turnoverAmount) {
          this.commission = this.turnoverCommission;
        }
      }
    });
    return this.commission;
  }

  async getCommission() {
    if (this.checkIfAmountLessThan5Cent()) return this.commission;
    if (this.checkIfCommissionLessThan5Cent()) return this.commission;
    if (this.checkClientID()) return this.commission;
    await this.checkTurnover();
    return Number(this.commission);
  }
}

module.exports = CommissionManager;
