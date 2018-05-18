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

myweb3.eth.net.getId().then((netId) => {
  // TODO: check networkId to set api.constractAddress
});

const api = {

  currency: 'ETH',
  constractAddress: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',

  setCurrency: function setCurrency(e) {
    api.currency = e;
  },

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
    // TODO: get account info from web3 and contract
    return myweb3.eth.getAccounts()
      .then(acc => (acc.length > 0
        ? {
          address: acc[0],
          isAdmin: true,
          tickets: 0
        } : {
          address: null
        }));
  },

  postCommit: function commit(weiValue, secret) {
    // TODO: create transaction
    return myweb3.eth.getAccounts().then(accounts => myweb3.eth
      .sendTransaction({
        from: accounts[0],
        to: api.constractAddress,
        value: weiValue,
        data: secret
      }));
  },

  postReveal: function reveal(secret) {
    // TODO: create transaction
    return myweb3.eth.getAccounts().then(accounts => myweb3.eth
      .sendTransaction({
        from: accounts[0],
        to: api.constractAddress,
        data: secret
      }));
  },

  postCreate: function createCampaign(values) {
    // TODO: create transaction
    console.log(values);
    return myweb3.eth.getAccounts().then(accounts => myweb3.eth
      .sendTransaction({
        from: accounts[0],
        to: api.constractAddress
      }));
  },

  getCampainInfo: function getCampainInfo() {
    // TODO: get info from contract
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
          depositFraction: 2,
          commitStart: Date.now(),
          commitEnd: Date.now() + 500000,
          revealEnd: Date.now() + 500000,
          jackpot: api.toWei('18.56', 'ether'),
          raisedCharity: api.toWei('3.71', 'ether'),
          ticketsSold: 1856,
          ticketPrice: api.toWei('0.1', 'ether'),
          totalWon: 4,
          totalRaisedCharity: api.toWei('18.56', 'ether')
        }));
      }, 1000);
    });
  }
};

export default api;
