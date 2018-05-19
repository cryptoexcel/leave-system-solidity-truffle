var Web3 = require('web3');

const contract = require('truffle-contract');

import {
  initAirdropContract,
  tokensAvailable,
  sendTokensSingleValue
} from "./airdrop"

const fs = require('fs');
const path = require('path');


const http = require('http')
const port = 3000

// const RPC_SERVER = 'https://rinkeby.infura.io/Q6V3RsibY4PktQV508nP5';
const RPC_SERVER = 'http://5.9.144.226:8545'

var provider = new Web3.providers.HttpProvider(RPC_SERVER)

let web3 = new Web3(provider)


web3.eth.getAccounts((error, accounts) => {
  if (error)
    console.log(error)

  console.log(accounts);



  initAirdropContract(web3)
    .then((airdrop_contract) => {
      tokensAvailable(airdrop_contract)
        .then((total_token) => {
          console.log("contract has total tokens : " + total_token);


          return sendTokensSingleValue(
            airdrop_contract,
            "0xab64708395c62eE0DD3056b57f1Be30eFb86Ecd9"
            ["0x07f728172eed57E6936A14fdC862d1933CFeB3C7"],
            10 * 10 ** 18,
          ).then((result) => {
            console.log(result);

          })


        }).catch((err) => { console.log(err) })
    })


});







const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})