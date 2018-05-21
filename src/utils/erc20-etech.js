import Web3 from 'web3'
import contract from 'truffle-contract'
import ERC20ContractJSON from '../../build/contracts/ETECHToken.json'

const ERC20Contract = contract(ERC20ContractJSON)
const ERC20_TOKEN_ADDRESS = '0x8bc0978b628c93c86ae79e53017b30363fe81840'

export class ERC20 {
  contract = false;
  account = false
  web3Provider = false;
  web3 = false;
  constructor(web3Provider, account) {
    this.web3 = new Web3(web3Provider)
    this.web3Provider = web3Provider;
    this.account = account;
    ERC20Contract.setProvider(web3Provider.currentProvider)
    ERC20Contract.at(ERC20_TOKEN_ADDRESS).then((contract) => {
      this.contract = contract;
    })
  }
  getTokenBalance = () => {
    return this.contract.balanceOf({ from: this.account })

  }
  transferToken = (to, amount) => {
    return this.contract.transfer(web3.toHex(to), amount * 1, { from: this.account })
  }
  approve = (to, amount) => {
    return this.contract.approve(web3.toHex(to), amount * 1, { from: this.account })
  }
  allowance = (owner) => {
    return this.contract.allowance(web3.toHex(this.account), web3.toHex(owner), { from: this.account })
      .then((obj) => {
        return web3.toDecimal(obj);
      })
  }
}

