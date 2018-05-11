import Web3 from 'web3';
import config from './config';

let myweb3;
const api = {};

export default function () {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    myweb3 = new Web3(window.web3.currentProvider);
    myweb3.eth.defaultAccount = window.web3.eth.defaultAccount;
    api.candotransaction = true;
  } else {
    api.candotransaction = false;
    myweb3 = new Web3(new Web3.providers.HttpProvider(config.infuraUrl));
  }
  api.getAccount = function () {
    return myweb3.eth.getAccounts();
  };
  myweb3.eth.net.getId().then((netId) => { console.log(netId); });
  return api;
}
