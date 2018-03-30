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

// this for a new user to join the contract. 
//userId is the id of user form hr system
//leaveBalance is the leave balance of user
export const joinUser = (contract, account, userId, leaveBalance) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}

//this can be used by owner of the contract only.
// this will delete the user
export const resetLeaves = (contract, account, addr) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}

//this to apply leave
export const applyLeave = (contract, account, no_of_days, userId) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}

// this to approve leave, index 
// only owner can do
export const approveLeave = (contract, account, index) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}


// this to reject leave, index 
// only owner can do
export const disallowLeave = (contract, account, index) => {
    return new Promise((resolve, reject) => {
        resolve('0x627306090abab3a6e1400e9345bc60c78a8bef57');
    });
}


//this is for a person to get his own leave balance
export const getMyLeaveBalance = (contract, account) => {
    return new Promise((resolve, reject) => {
        resolve(10);
    });
}

//this is for the owner to get any employee balance
export const getEmployeeLeaveBalance = (contract, account, addr) => {
    return new Promise((resolve, reject) => {
        resolve(2);
    });
}
