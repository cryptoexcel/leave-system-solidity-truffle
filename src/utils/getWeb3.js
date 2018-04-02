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

    LeaveSystem.setProvider(web3Provider.currentProvider)
    resolve(LeaveSystem);
  });
}

const getContract = (LeaveSystemContract) => {
  return LeaveSystemContract.at('0xb60c5d8ce70552e39a4b06a2d7ada14d128b7bdd');
}

export const joinUser = (contract, account, userId, leaveBalance) => {
  return new Promise((resolve, reject) => {
    return getContract(contract).then((leaveContract) => {
      return leaveContract.joinUser(userId, leaveBalance, { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}

export const resetLeaves = (contract, account, addr) => {
  return new Promise((resolve, reject) => {
    return getContract(contract).then((leaveContract) => {
      return leaveContract.resetLeaves(web3.toHex(addr), { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}

export const getUser = (contract, account, addr) => {
  return getContract(contract).then((leaveContract) => {
    return leaveContract.getUser(web3.toHex(addr), { from: account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  })
}

export const getMyLeaves = (contract, account, addr) => {
  return getContract(contract).then((leaveContract) => {
    return leaveContract.getMyLeaves(web3.toHex(addr), { from: account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  })
}

export const applyLeave = (contract, account, no_of_days) => {
  return new Promise((resolve, reject) => {
    return getContract(contract).then((leaveContract) => {
      return leaveContract.applyLeave(no_of_days, { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}

export const approveLeave = (contract, account, index) => {
  return new Promise((resolve, reject) => {
    return getContract(contract).then((leaveContract) => {
      return leaveContract.approveLeave(index, { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}

export const disallowLeave = (contract, account, index) => {
  return new Promise((resolve, reject) => {
    return getContract(contract).then((leaveContract) => {
      return leaveContract.disallowLeave(index, { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}

export const addEmployeeLeave = (contract, account, addr, leaves) => {
  return new Promise((resolve, reject) => {
    return getContract(contract).then((leaveContract) => {
      return leaveContract.addEmployeeLeave(web3.toHex(addr), leaves, { from: account })
    }).then((obj) => {
      resolve(obj.tx);
    }).catch((err) => reject(err))
  });
}

export const getLeaveList = (contract, account) => {
  return getContract(contract).then((leaveContract) => {
    return leaveContract.getLeaveList({ from: account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(getLeaveDetail(contract, account, i - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })
  })
}

export const getEmployeePendingLeaveList = (contract, account) => {
  return getContract(contract).then((leaveContract) => {
    return leaveContract.getEmployeePendingLeaveList({ from: account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(getLeaveDetail(contract, account, i - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })
  })
}

export const getEmployeeApprovedLeaveList = (contract, account) => {
  return getContract(contract).then((leaveContract) => {
    return leaveContract.getEmployeeApprovedLeaveList({ from: account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(getLeaveDetail(contract, account, i - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })
  })
}



export const getLeaveDetail = (contract, account, index) => {
  return getContract(contract).then((leaveContract) => {
    return leaveContract.getLeaveDetail(web3.toDecimal(index), { from: account })
      .then((obj) => {
        return {
          id: web3.toDecimal(obj[0]),
          no_of_days: web3.toDecimal(obj[1]),
          approved: obj[2],
          by: web3.toHex(obj[3]),
          action_at: web3.toDecimal(obj[4]),
          action_by: web3.toHex(obj[5])
        }
      })
  })
}

// export const approveLeave = (contract, account, index) => {

// }
