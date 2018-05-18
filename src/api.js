import Web3 from 'web3';
import config from './config';

let myweb3;
if (
  typeof window.web3 !== 'undefined' &&
  typeof window.web3.currentProvider !== 'undefined'
) {
  myweb3 = new Web3(window.web3.currentProvider);
  myweb3.eth.defaultAccount = window.web3.eth.defaultAccount;
} else {
  myweb3 = new Web3(new Web3.providers.HttpProvider(config.infuraUrl));
}

myweb3.eth.net.getId().then((netId) => { console.log(netId); });

const api = {

  currency: 'ETH',

  toWei: function toWei(value, unit) {
    return myweb3.utils.toWei(value, unit);
  },

  printWei: function printWei(weiValue) {
    const ethValue = myweb3.utils.fromWei(String(weiValue), 'ether');
    if (api.currency === 'ETH') {
      return `${ethValue} ETH`;
    }
    const ethPrice = 700;
    return `${ethPrice * ethValue} USD`;
  },

  getAccountInfo: function getAccountInfo() {
    return myweb3.eth.getAccounts()
      .then(acc => (acc.length > 0
        ? {
          address: acc[0],
          isAdmin: true,
          tickets: 38
        } : {
          address: null
        }));
  },

  getCampainInfo: function getCampainInfo() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
          depositFraction: 2,
          commitStart: Date.now(),
          commitEnd: Date.now() + 500000,
          revealEnd: Date.now() + 500000,
          jackpot: api.toWei('1928', 'ether'),
          raisedCharity: api.toWei('23', 'ether'),
          ticketsSold: 456,
          ticketPrice: api.toWei('0.1', 'ether'),
          totalWon: 4,
          totalRaisedCharity: api.toWei('34258', 'ether')
        }));
      }, 1000);
    });
  }
};

export default api;
