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
  constractAddress: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',

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

  postCommit: function commit(weiValue, secret) {
    return myweb3.eth.getAccounts().then(accounts => myweb3.eth
      .sendTransaction({
        from: accounts[0],
        to: api.constractAddress,
        value: weiValue,
        data: secret
      }));
  },

  getCampainInfo: function getCampainInfo() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
          depositFraction: 2,
          commitStart: Date.now() + 5000,
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
