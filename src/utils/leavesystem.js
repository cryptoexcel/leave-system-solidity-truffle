import Web3 from 'web3'
import contract from 'truffle-contract'
import LeaveSystemContract from '../../build/contracts/LeaveSystemTokenized.json'

export const LEAVE_CONTRACT_ADDRESS = '0x84dcaf6bc1d7f90d467191cfcc2fce34c917224e'
const LeaveSystem = contract(LeaveSystemContract)
export class LeaveContarct {
  contract = false;
  account = false
  web3Provider = false;
  web3 = false;
  constructor(web3Provider, account) {
    this.web3 = new Web3(web3Provider)
    this.web3Provider = web3Provider;
    this.account = account;
    LeaveSystem.setProvider(web3Provider.currentProvider)
    LeaveSystem.at(LEAVE_CONTRACT_ADDRESS).then((contract) => {
      this.contract = contract;
    })
  }
  isContract(){
    return this.contract;
  }
  joinUser = (userId) => {
    return this.contract.joinUser(userId, { from: this.account })
  }


  getUserId = (addr) => {
    return this.contract.getUserId(web3.toHex(addr), { from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }
  getLeaves = (addr) => {
    return this.contract.getLeaves(web3.toHex(addr), { from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }

  getUser = () => {
    return this.contract.getUser({ from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }
  getMyLeaves = () => {
    return this.contract.getMyLeaves({ from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })

  }
  applyLeave = (no_of_days) => {
      return this.contract.applyLeave(no_of_days, { from: this.account })
  }
  approveLeave = (index) => {
      return this.contract.approveLeave(index, { from: this.account })

  }
  disallowLeave = (index) => {
      return this.contract.disallowLeave(index, { from: this.account })
  }
  addEmployeeLeave = (addr, leaves) => {
      return this.contract.addEmployeeLeave(this.web3.toHex(addr), leaves, { from: this.account })

  }

  getLeaveList = () => {
    return this.contract.getLeaveList({ from: this.account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (this.web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(getLeaveDetail(contract, account, i - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })

  }

  getEmployeePendingLeaveList = () => {
    return this.account.getEmployeePendingLeaveList({ from: this.account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (this.web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(getLeaveDetail(contract, account, i - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })

  }

  getEmployeeApprovedLeaveList = () => {
    return this.getEmployeeApprovedLeaveList({ from: this.account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (this.web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(getLeaveDetail(contract, account, i - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })

  }



  getLeaveDetail = (index) => {
    return this.contract.getLeaveDetail(this.web3.toDecimal(index), { from: this.account })
      .then((obj) => {
        return {
          id: this.web3.toDecimal(obj[0]),
          no_of_days: this.web3.toDecimal(obj[1]),
          approved: obj[2],
          by: this.web3.toHex(obj[3]),
          action_at: this.web3.toDecimal(obj[4]),
          action_by: this.web3.toHex(obj[5])
        }
      })

  }
}




