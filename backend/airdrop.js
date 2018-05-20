import contract from 'truffle-contract'
import AirdropContract from '../build/contracts/AirDrop.json'
var Web3 = require('web3');

const Airdrop = contract(AirdropContract)

export const initAirdropContract = (web3Provider) => {
  return new Promise((resolve, reject) => {
    Airdrop.setProvider(web3Provider.currentProvider)
    resolve(Airdrop);
  });
}


const getAirdropContract = (Airdrop) => {
    return Airdrop.at('0xa20aa1034adff2a9b0b122101e714a7c59c7ef30');
}


export const sendTokensSingleValue = (contract, account, addresses, amount) => {
  return new Promise((resolve, reject) => {
    return getAirdropContract(contract).then((airdropContract) => {
      return airdropContract.sendTokensSingleValue(addresses, amount)
    }).then((obj) => {
      resolve(obj);
    }).catch((err) => reject(err))
  });
}

export const tokensAvailable = (contract) => {
  return new Promise((resolve, reject) => {
    return getAirdropContract(contract).then((airdropContract) => {
      airdropContract.isActive().then( (x) => {
        console.log(x);
      })
      return airdropContract.tokensAvailable()
    }).then((obj) => {
      resolve(obj);
    }).catch((err) => reject(err))
  });
}
