const parseCSV = require('./parsecsv');

class CommissionManager {
  constructor(clientId, amount) {
    this.commissionPercentage = 0.005;
    this.turnoverCommission = 0.04;
    this.turnoverAmount = 1000;
    this.amount = amount;
    this.commission = amount * this.commissionPercentage;
    this.clientId = clientId;
    this.data = parseCSV()
  }

  showData() {
    this.data.forEach((obj) => {
      console.log(obj);
    });
  }

  //TODO
  //array of rules
  //vienas kitamasis atsakingas už rules

  checkIfLessThan1Cent() {
    if (this.commission < 0.01) {
      return new Error(
        'Commission is less than 0.01 EUR, please increase the amount'
      );
    }
  }

  checkClientID() {
    if (this.clientId === 42) {
      this.commission = 0.05;
    }
  }

  checkTurnover() {
    if (this.amount >= this.turnoverAmount) {
      this.commission = this.turnoverCommission;
    }
  }

  getCommission() {
    this.checkIfLessThan1Cent();
    this.checkClientID();
    this.checkTurnover();
    // this.showData();
    return this.commission;
  }
}

module.exports = CommissionManager;
