export class Web3Util {
    getWeb3 = () => {
        return new Promise(function (resolve, reject) {
            // Wait for loading completion to avoid race conditions with web3 injection timing.
            // this component is already loaded, page has already loaded!!
            // window.addEventListener('load', function () {

            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            if (typeof web3 !== 'undefined') {
                // Use Mist/MetaMask's provider.
                web3 = new Web3(web3.currentProvider)

                console.log('Injected web3 detected.');

                resolve(web3)
            } else {
                console.log('No web3? You should consider trying MetaMask!')
                // Fallback to localhost if no web3 injection. We've configured this to
                // use the development console's port by default.
                reject(new Error("No web3 injected"));
            }
            // })
        })
    }

    getDefaultAccount = (web3Provider) => {
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

    getAccountBalance = (web3Provider, account) => {
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

    initWeb3 = () => {
        return new Promise((resolve, reject) => {
            this.getWeb3()
                .then((web3) => {
                    return this.getDefaultAccount(web3)
                        .then((account) => {
                            return this.getAccountBalance(web3, account)
                                .then((balance) => {
                                    resolve({ web3, account, balance })
                                })
                        })
                }).catch((err) => {
                    console.log(err);
                    alert(err.message);
                })
        });
    }
}
