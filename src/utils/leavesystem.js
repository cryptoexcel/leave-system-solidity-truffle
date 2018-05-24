import Web3 from 'web3'
import contract from 'truffle-contract'
import LeaveSystemContract from '../../build/contracts/LeaveSystemTokenized.json'

export const LEAVE_CONTRACT_ADDRESS = '0x2ec395e0db6549ab204b7a67fe68bc966e80b9b5'
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
  isContract() {
    return this.contract;
  }
  isContractOwner() {
    console.log("========= is contract owner ======")
    return this.contract.isContractOwner({ from: this.account })
  }
  joinUser = (userId) => {
    console.log("========= join called ======")
    return this.contract.joinUser(userId, { from: this.account })
  }

  getUserId = (addr) => {
    console.log("========= get user id ======")
    return this.contract.getUserId(web3.toHex(addr), { from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }
  getLeaves = (addr) => {
    console.log("========= get leaves ======")
    return this.contract.getLeaves(web3.toHex(addr), { from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }

  getUser = () => {
    console.log("========= get user ======")
    return this.contract.getUser({ from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }
  getMyLeaves = () => {
    console.log("========= get my leaves ======")
    return this.contract.getMyLeaves({ from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })

  }
  applyLeave = (leave_id, no_of_days) => {
    console.log("========= apply leave ======")
    return this.contract.applyLeave(leave_id, no_of_days, { from: this.account })
  }
  approveLeave = (index) => {
    console.log("========= approve leave ======")
    return this.contract.approveLeave(index, { from: this.account })

  }
  disallowLeave = (index) => {
    console.log("========= disallow leave ======")
    return this.contract.disallowLeave(index, { from: this.account })
  }
  //admin can give leave balance to any employee
  addEmployeeLeave = (addr, leaves) => {
    console.log("========= add employee leave ======")
    return this.contract.addEmployeeLeave(web3.toHex(addr), leaves, { from: this.account })
  }
  exchangeRate = () => {
    console.log("========= exchange rate ======")
    return this.contract.exchangeRate({ from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }
  buyLeave = (eth) => {
    console.log("========= buy leave ======")
    return this.contract.buyLeave({ from: this.account, value: web3.toWei(eth) })
  }
  getLeaveList = () => {
    console.log("========= get leave list ======")
    return this.contract.getLeaveList({ from: this.account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(this.getLeaveDetail(web3.toDecimal(obj[i] - 1)));
          }
        }
        return Promise.all(leavesIndexs);
      })

  }

  getEmployeePendingLeaveList = () => {
    console.log("========= get employee pending leaves ======")
    return this.contract.getEmployeePendingLeaveList({ from: this.account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(this.getLeaveDetail(web3.toDecimal(obj[i]) - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })

  }

  getEmployeeApprovedLeaveList = () => {
    console.log("========= get employee approved leave ======")
    return this.contract.getEmployeeApprovedLeaveList({ from: this.account })
      .then((obj) => {
        let leavesIndexs = [];
        for (let i = 0; i < obj.length; i++) {
          if (web3.toDecimal(obj[i]) !== 0) {
            leavesIndexs.push(this.getLeaveDetail(web3.toDecimal(obj[i]) - 1));
          }
        }
        return Promise.all(leavesIndexs);
      })

  }



  getLeaveDetail = (index) => {
    return this.contract.getLeaveDetail(web3.toDecimal(index), { from: this.account })
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

  }
}




