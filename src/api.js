import Web3 from 'web3';
import config from './config';
const abi = require('./abi.json');

var myweb3;
var networkName;
var contract;

var campaignID = 0;
var founder = '0x0';

const api = {

  currency: 'ETH',
  constractAddress: '',
  

  initWeb3: function() {

    if (
      typeof window.web3 !== 'undefined' &&
      typeof window.web3.currentProvider !== 'undefined'
    ) {
      myweb3 = new Web3(window.web3.currentProvider);
      myweb3.eth.defaultAccount = window.web3.eth.defaultAccount;
    } else {
      myweb3 = new Web3(new Web3.providers.HttpProvider(config.infuraRopsten));
    }
  
    myweb3.eth.net.getId().then((netId) => {
      // TODO: check networkId to set api.constractAddress
      
        switch (netId) {
          case 1:
            console.log('This is mainnet')
            break
          case 2:
            console.log('This is the deprecated Morden test network.')
            break
          case 3:
            console.log('This is the ropsten test network.');
            api.constractAddress = "0x0";// ropsten address
            networkName = "Ropsten";
            break
          case 4:
            networkName = "Rinkeby";
            break;
          case 42:
            networkName = "Kovan";
            break;
          case 5777:
            networkName = "Ganache";
            api.constractAddress = "0xeac21710ad4208cf2d8fb0ebe226997f09ce4e15";
            
            break;
          default:
            console.log('This is an unknown network.');
            console.log(netId);
            api.constractAddress = "0xeac21710ad4208cf2d8fb0ebe226997f09ce4e15";
            
      }
      
    }).then(() => {
      contract = new myweb3.eth.Contract(abi, "0xeac21710ad4208cf2d8fb0ebe226997f09ce4e15");
    }).then(function() {
      contract.address = api.constractAddress;
    }).then(function() {
      myweb3.eth.getAccounts()
      .then(acc => {
      contract.methods.lastCampaign().call({from: acc[0]})
      .then(function(result) {
        
        campaignID = result.campaignID;

        console.log('Campaign ID: ' + campaignID);
        
        return contract.methods.founder().call({from: acc[0]})
      })
      .then(function(result) {
        founder = result;
      })
    })
  })
  },

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
    const ethPrice = 60;
    return `${ethPrice * ethValue} USD`;
  },

  getAccountInfo: function getAccountInfo() {
    // TODO: get account info from web3 and contract
    
    let tix = 0;

    return myweb3.eth.getAccounts()
      .then(function(acc) {
          if(typeof contract !== 'undefined') {
            return contract.methods.participant(campaignID, acc[0]).call({from: acc[0]})
            .then(function(result) {
              tix = result.tickets;
              return myweb3.eth.getAccounts()
            }).then(acc => 
              (acc.length > 0
                ? {
                  address: acc[0],
                  isAdmin: founder == acc[0],
                  tickets: tix
                } : {
                  address: null
                }))
          } else {
            return ({
              address: acc[0],
              isAdmin: false,
              tickets: 0
            });
          }
          
        })
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
    myweb3.eth.getAccounts().then(accounts => 
      contract.methods.newCampaign(myweb3.utils.fromAscii("abc")).send({
        from: accounts[0],
        to: api.constractAddress
      }).on('transactionHash', function(hash){
        
    })
    .on('confirmation', function(confirmationNumber, receipt){

    })
    .on('receipt', function(receipt){
        // receipt example
        console.log(receipt);
    })
    .on('error', console.error));
  },

  getCampainInfo: function getCampainInfo() {
    // TODO: get info from contract
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          myweb3.eth.getAccounts().then(acc => 
            contract.methods.campaignInfo(campaignID).call({from: acc[0]})
          .then((result) =>
          Object.assign({}, {
          depositFraction: result.depositFraction/10**16,
          commitStart: new Date(result.commitStart * 1000),
          commitEnd: new Date(result.commitDeadline * 1000) ,
          revealEnd: new Date(result.revealDeadline * 1000) ,
          jackpot: api.toWei('18.56', 'ether'),
          raisedCharity: api.toWei('3.71', 'ether'),
          ticketsSold: 1856,
          ticketPrice: result.ticketPrice,
          totalWon: 4,
          totalRaisedCharity: api.toWei('18.56', 'ether')
        }))));
      }, 1000);
    });
  }
};

export default api;
