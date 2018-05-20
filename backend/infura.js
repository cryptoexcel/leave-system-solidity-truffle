const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const ProviderSubprovider = require("web3-provider-engine/subproviders/provider.js");


const WalletSubprovider = require('ethereumjs-wallet/provider-engine')
const walletFactory = require('ethereumjs-wallet')
var Web3 = require('web3');
var Transaction = require('ethereumjs-tx');

import {
    initAirdropContract,
    tokensAvailable,
    sendTokensSingleValue
  } from "./airdrop"

const contract = require('truffle-contract');

const fs = require('fs');
const path = require('path');


const http = require('http')
const port = 3000

const RPC_SERVER = 'https://rinkeby.infura.io/Q6V3RsibY4PktQV508nP5';
// const RPC_SERVER = 'http://5.9.144.226:8545'
const privateKey = 'E89a625b52b1643cd91d74ccf213232d6cbb39908274b70ec957ff3b0a0cb6ed';

//EthereumJS Wallet Sub-Provider


//Wallet Initialization

var privateKeyBuffer = new Buffer(privateKey, "hex")
var myWallet = walletFactory.fromPrivateKey(privateKeyBuffer)

console.log(myWallet.getAddressString(), " account address");
console.log(myWallet.getPublicKeyString(), " account public key");

//Engine initialization & sub-provider attachment

var engine = new ProviderEngine();

var web3 = new Web3(engine)

engine.addProvider(new HookedWalletSubprovider({
    getAccounts: function (cb) { cb(null, [myWallet.getAddressString()]) },
    getPrivateKey: function (address, cb) {
        console.log(address, "Adadd")
        cb(null, myWallet.getPrivateKeyString());
    },
    signTransaction: function (txParams, cb) {
        let pkey = myWallet.getPrivateKey();
        var tx = new Transaction(txParams);
        tx.sign(pkey);
        var rawTx = '0x' + tx.serialize().toString('hex');
        cb(null, rawTx);
    }
}));

engine.addProvider(new FixtureSubprovider({
    web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
}))

// cache layer
// engine.addProvider(new CacheSubprovider())

// filters
engine.addProvider(new FilterSubprovider())

// pending nonce
// engine.addProvider(new NonceSubprovider())

// vm
// engine.addProvider(new VmSubprovider())


// Wallet Attachment
// engine.addProvider(new WalletSubprovider(myWallet,{}))


// Here the URL can be your localhost for TestRPC or the Infura URL
// engine.addProvider(new ProviderSubprovider(new Web3.providers.HttpProvider(RPC_SERVER)))

engine.addProvider(new RpcSubprovider({
    rpcUrl: RPC_SERVER,
}))

// network connectivity error
engine.on('error', function (err) {
    // report connectivity errors
    console.error(err.stack)
})

engine.on('block', function (block) {
    console.log('================================')
    console.log('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'))
    console.log('================================')
})

// start polling for blocks
engine.start();

const TOKEN_SALE_CONTRACT = path.resolve(__dirname, '..', 'build', 'contracts', 'AirDrop.json');

fs.readFile(TOKEN_SALE_CONTRACT, 'utf-8', function (err, data) {
    if (err) {
        reject(err);
    } else {
        const Airdrop = contract(JSON.parse(data));
        Airdrop.setProvider(engine)
        Airdrop.at('0xa20aa1034adff2a9b0b122101e714a7c59c7ef30').then((airdropContract) => {
            airdropContract.tokensAvailable()
                .then((obj) => {
                    console.log(obj);
                    return airdropContract.sendTokensSingleValue(
                        ["0x07f728172eed57E6936A14fdC862d1933CFeB3C7"], 
                        10 * 10 ** 18,
                        { from: myWallet.getAddressString() }
                    ).then((obj) => {
                        console.log(obj)
                    })

                }).catch((err) => { console.log(err) })
        });
    }
});

// initAirdropContract(web3)
//   .then((airdrop_contract) => {
//     tokensAvailable(airdrop_contract)
//       .then((total_token) => {
//         console.log("contract has total tokens : " + total_token)
//       }).catch((err) => { console.log(err) })
//   })



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