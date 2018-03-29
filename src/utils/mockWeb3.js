import Web3 from 'web3'
import contract from 'truffle-contract'
import LeaveSystemContract from '../../build/contracts/LeaveSystem.json'

const LeaveSystem = contract(LeaveSystemContract)

export const getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        resolve({})
    })
})

export const getDefaultAccount = (web3Provider) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}

export const getAccountBalance = (web3Provider, account) => {
    return new Promise((resolve, reject) => {
        resolve("99");
    })
}

export const initContract = (web3Provider) => {
    return new Promise((resolve, reject) => {
        resolve({});
    });
}

export const joinUser = (contract, account, userId, leaveBalance) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}