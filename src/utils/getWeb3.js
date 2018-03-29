import Web3 from 'web3'
import contract from 'truffle-contract'
import LeaveSystemContract from '../../build/contracts/LeaveSystem.json'

const LeaveSystem = contract(LeaveSystemContract)

export const getWeb3 = new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      console.log('Injected web3 detected.');

      resolve(web3)
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

      web3 = new Web3(provider)
      console.log('No web3 instance injected, using Local web3.');

      resolve(web3)
    }
  })
})

export const getDefaultAccount = (web3Provider) => {
  return new Promise((resolve, reject) => {
    // Get accounts.
    web3Provider.eth.getAccounts((error, accounts) => {
      if (error)
        reject(error)

      if (accounts.length > 0) {
        resolve(accounts[0]);
      } else {
        reject(new Error('No Accounts Found!!!'));
      }
    });
  });
}

export const getAccountBalance = (web3Provider, account) => {
  return new Promise((resolve, reject) => {
    web3Provider.eth.getBalance(account, function (error, wei) {
      if (!error) {
        var balance = web3Provider.fromWei(wei, 'ether');
        resolve(balance + "");
      } else {
        reject(error);
      }
    })
  });
}

export const initContract = (web3Provider) => {
  return new Promise((resolve, reject) => {

    LeaveSystem.setProvider(web3Provider.currentProvider )
    resolve(LeaveSystem);
  });
}

export const joinUser = (contract, account, userId, leaveBalance) => {
  return new Promise((resolve, reject) => {

    LeaveSystem.deployed().then((leaveContract) => {
      return leaveContract.joinUser(userId, leaveBalance, { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}