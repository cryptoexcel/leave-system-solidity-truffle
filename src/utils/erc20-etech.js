import Web3 from 'web3'
import contract from 'truffle-contract'
import ERC20Contract from '../../build/contracts/ETECHToken.json'

const ERC20 = contract(ERC20Contract)

export const initTokenContract = (web3Provider) => {
  return new Promise((resolve, reject) => {

    ERC20.setProvider(web3Provider.currentProvider)
    resolve(ERC20Contract);
  });
}


const getTokenContract = (ERC20Contract) => {
    return ERC20.at('0x8bc0978b628c93c86ae79e53017b30363fe81840');
}


export const getTokenBalance = (contract, account) => {
  return new Promise((resolve, reject) => {
    return getTokenContract(contract).then((tokenContract) => {
      return tokenContract.balanceOf(account, { from: account })
    }).then((obj) => {
      resolve(web3.toDecimal(obj));
    }).catch((err) => reject(err))
  });
}


//0x07f728172eed57E6936A14fdC862d1933CFeB3C7
export const transferToken = (contract, account, to , amount) => {
  return new Promise((resolve, reject) => {
    return getTokenContract(contract).then((tokenContract) => {
      return tokenContract.transfer(web3.toHex(to), amount*1, { from: account })
    }).then((obj) => {
      resolve(obj);
    }).catch((err) => reject(err))
  });
}