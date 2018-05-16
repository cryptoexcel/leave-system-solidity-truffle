module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      host: '5.9.144.226',
      port: 8545,
      network_id: '*', // Match any network id
      from: "0xab64708395c62eE0DD3056b57f1Be30eFb86Ecd9",
      gas: 4704585,
    }
  },
  solc: { optimizer: { enabled: true, runs: 200 } }
}