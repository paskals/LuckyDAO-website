import Web3 from 'web3';
import App from './App.js';
import config from './config';
const abi = require('./abi.json');

var myweb3;
var networkName;
var contract;

var numCampaigns = 0;
var founder = '0x0';
var totalWon = '0';
var totalCharity = '0';
var props;

var campaign = {
  ID: 0,
  jackpot: '0',
  charity: '0',
  tickets: 0,
  ticketPrice: '1000000000',
  commitStart: Date.now(),
  commitDeadline: Date.now(),
  revealDeadline: Date.now(),
  depositFraction: '25',
  jackpotFraction: '60',
  charityFraction: '5'
}

var participant = {
  address: '',
  tickets: 0
}

const api = {

  currency: 'ETH',
  constractAddress: '',


  initWeb3: function (prop) {
    props = prop;
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
      return contract = new myweb3.eth.Contract(abi, "0xeac21710ad4208cf2d8fb0ebe226997f09ce4e15");
    }).then(function () {
      contract.address = api.constractAddress;
      return myweb3.eth.getAccounts().then(function (acc) {
        contract.methods.founder().call({ from: acc[0] })
          .then(function (result) {
            founder = result;

            contract.events.CampaignAdded({fromBlock: 0
            }, function (error, event) {
              console.log(event);
              api.triggerGUIUpdate();
            })
              .on('data', function (event) {
                console.log(event); // same results as the optional callback above
              })
              .on('changed', function (event) {
                // remove event from local database
              })
              .on('error', console.error);

            contract.events.TicketsBought({
              fromBlock: 0
            }, function (error, event) {
              console.log(event);
              api.triggerGUIUpdate();
            })
              .on('data', function (event) {
                console.log(event); // same results as the optional callback above
              })
              .on('changed', function (event) {
                // remove event from local database
              })
              .on('error', console.error);

          }).then(function () {
            return api.updateUserInfo();
          }).then(function () {
            return api.updateCampaignInfo();
          }).then(function() {
             api.triggerGUIUpdate();
          })
      })
    });
    

  },

  triggerGUIUpdate: function () {
    props.getAccount(); 
    props.getInfo();
    
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
    const ethPrice = 420;
    return `${ethPrice * ethValue} USD`;
  },

  updateCampaignInfo: function () {

    return myweb3.eth.getAccounts().then(acc => {
      if(typeof contract != 'undefined'){
      contract.methods.numCampaigns().call({ from: acc[0] })
        .then(result => {
          numCampaigns = result;

          myweb3.eth.getAccounts()
            .then(acc => {

              contract.methods.lastCampaign().call({ from: acc[0] })
                .then(function (result) {

                  campaign.ID = result.campaignID;

                  console.log('Campaign ID: ' + result.campaignID);
                  
                  contract.methods.campaignInfo(campaign.ID).call({ from: acc[0] })
                  .then(result => {
                    campaign.commitStart = new Date(result.commitStart * 1000);
                    campaign.commitDeadline = new Date(result.commitDeadline * 1000);
                    campaign.revealDeadline = new Date(result.revealDeadline * 1000);
                    campaign.ticketPrice = myweb3.utils.fromWei(result.ticketPrice, 'ether');
                    campaign.depositFraction = result.depositFraction/(10**16);
                    campaign.jackpotFraction = result.jackpotFraction/(10**16);
                    campaign.charityFraction = result.charityFraction/(10**16);
                  });

                  contract.methods.campaignStats(campaign.ID).call({ from: acc[0] })
                  .then(result => {
                    campaign.jackpot = myweb3.utils.fromWei(result.jackpot, 'ether');
                    campaign.charity = myweb3.utils.fromWei(result.charity, 'ether');
                    campaign.tickets = result.ticketsSold/(10**18)
                  });

                })
            })
        })}}
      )

  },

  updateUserInfo: function() {
    myweb3.eth.getAccounts()
      .then(acc => {
        participant.address = acc[0];
        if(typeof contract != 'undefined'){
        contract.methods.participant(campaign.ID, participant.address).call({ from: acc[0] })
          .then(result => {
            participant.tickets = result.tickets/(10**18);
          })
        }
      })

  },

  keccak256: function keccak256(args) {
      
    return myweb3.utils.soliditySha3(args);
  },


  getAccountInfo: function getAccountInfo() {
    // TODO: get account info from web3 and contract
    api.updateUserInfo();
    
    return (participant.address != ''
        ? {
          address: participant.address,
          isAdmin: participant.address == founder,
          tickets: participant.tickets
        } : {
          address: null,
          isAdmin: true
        });
  },

  postCommit: function commit(weiValue, secret) {
    // TODO: create transaction
    return myweb3.eth.getAccounts().then(accounts => {
      console.log("Commitment: " + api.keccak256(secret));
      contract.methods.purchaseTickets(campaign.ID, api.keccak256(secret)).send({
        from: accounts[0],
        value: weiValue
      }).on('receipt', function (receipt) {
          // receipt example
          console.log(receipt);
          api.triggerGUIUpdate();
        })
        .on('error', console.error)});
  },

  postReveal: function reveal(secret) {
    // TODO: create transaction
    return myweb3.eth.getAccounts().then(accounts =>
      contract.methods.reveal(campaign.ID, parseInt(secret, 10)).send({
        from: accounts[0]
      }).on('receipt', function (receipt) {
          // receipt example
          console.log(receipt);
          api.triggerGUIUpdate();
        })
        .on('error', console.error));
  },

  postCreate: function createCampaign(values) {
    // TODO: create transaction
    console.log(values, api.keccak256('abc'));
    myweb3.eth.getAccounts().then(accounts =>
      contract.methods.newCampaign(api.keccak256(321)).send({
        from: accounts[0]
      }).on('receipt', function (receipt) {
          // receipt example
          console.log(receipt);
          api.triggerGUIUpdate();
        })
        .on('error', console.error));
  },

  getCampainInfo: function getCampainInfo() {
    // TODO: get info from contract
    api.updateCampaignInfo();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
          depositFraction: campaign.depositFraction,
          commitStart: campaign.commitStart,
          commitEnd: campaign.commitDeadline,
          revealEnd: campaign.revealDeadline,
          jackpot: api.toWei(campaign.jackpot, 'ether'),
          raisedCharity: api.toWei(campaign.charity, 'ether'),
          ticketsSold: campaign.tickets,
          ticketPrice: api.toWei(campaign.ticketPrice, 'ether'),
          totalWon: totalWon,
          totalRaisedCharity: api.toWei(totalCharity, 'ether')
        }));
      }, 1000);
    });
  }
};


export default api;
