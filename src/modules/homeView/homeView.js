import React from 'react'
import Header from '../../components/header/header'
import './homeView.scss'
import { LeaveContarct } from '../../utils/leavesystem'
import { Web3Util } from '../../utils/getWeb3'
import { ERC20 } from '../../utils/erc20-etech'
import swal from 'sweetalert';
import LoginView from '../login/login';
import ApplyLeaveView from '../applyLeave/applyLeave'

// import {
//     initTokenContract,
//     getTokenContract,
//     getTokenBalance,
//     transferToken
// } from '../../utils/erc20-etech'


class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: false,
            account: false,
            balance: false,
            leaveContract: false,
            userId: false,
            leavesBalance: false,
            erc20Contract: false
        };
    }
    componentDidMount() {
        this.initApp();
    }

    initApp() {
        console.log("init app....")
        new Web3Util().initWeb3()
            .then((state) => {
                state.erc20Contract = new ERC20(state.web3, state.account);
                state.leaveContract = new LeaveContarct(state.web3, state.account)
                this.setState(state, () => {


                    //this is not a good practice, but i am king of waiting for contract to be loaded.
                    //just to reduce boilet plate code in leavesystem.
                    //we are waiting for the contract to get set in the class object and the call further functions
                    // but is not good way, just lazy!!
                    let checker = setInterval(() => {
                        if (state.leaveContract.isContract()) {
                            clearInterval(checker);
                            this.checkIfUserExists();
                        }
                    }, 100)
                    if (this.state.account)
                        //keep tracker if eth account is changed from meta mask
                        setInterval(() => {
                            new Web3Util().getDefaultAccount(this.state.web3)
                                .then((newDefaltAccount) => {
                                    if (newDefaltAccount !== this.state.account) {
                                        swal("web3 account changed, refreshing the page", "info")
                                            .then((val) => {
                                                if (val) {
                                                    window.location.reload(true);
                                                }
                                            })

                                    }
                                })

                        }, 2000)
                })
            })
    }
    checkUserLeaves() {
        this.state.leaveContract.getMyLeaves().then((leavesBalance) => {

            this.setState({
                leavesBalance
            })
            if (leavesBalance > 0) {
                swal({
                    title: "Good Job!!",
                    text: "You are already part of Excellence Blockchain based leave system!!!",
                    icon: "success"
                });
            }

        })
    }
    checkIfUserExists() {
        this.state.leaveContract.getUser()
            .then((userId) => {
                if (userId > 0) {
                    this.setState({
                        userId
                    })

                    this.checkUserLeaves();

                } else {
                    swal("Oops!!", "You are not part of our system, you need to create account", "error");
                    this.setState({
                        leavesBalance: 0,
                        userId: 0
                    })
                }
            })
    }
    render() {
        if (!this.state.web3) {
            return (
                <div>Waiting...</div>
            )
        }
        return (
            <div className='home-view container-fluid'>
                <Header title='Warehouse' />
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='row'>

                            <div>
                                Account Found: {this.state.account}
                            </div>
                            <br />
                            <div>
                                Ether balance {this.state.balance}
                            </div>
                            <br />
                            <div>
                                User ID: {this.state.userId}
                            </div>
                            <br />
                            <div>
                                Leave Balance: {this.state.leavesBalance}
                            </div>
                        </div>
                        <LoginView {...this.state} />
                        {this.state.leavesBalance === 0 ? "You don't have any tokens so you cannot apply for leave. So either wait for airdrop of tokens which is done 1st of every month or you tokens with ETH" : null}
                        {this.state.leavesBalance > 0 ? <ApplyLeaveView {...this.state} /> : null}
                        {/** 
                            
                            <div className='col-sm-3'>
                                <button onClick={() => {
                                    let userId = prompt('whats your user id from hr system', 101);
                                    let leaveBalance = prompt('Whats your Leave balance from hr system', 10);
                                    joinUser(this.state.contract, this.state.account, userId, leaveBalance).then(tx => {
                                        console.log(tx);
                                    });
                                }}
                                >JOIN USER</button>
                                <button onClick={() => {
                                    let address = prompt('What your address', this.state.account);
                                    resetLeaves(this.state.contract, this.state.account, address).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Reset Leave</button>
                                <button onClick={() => {
                                    let address = prompt('Put eth address for which you need see user id', this.state.account);
                                    getUser(this.state.contract, this.state.account, address).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Does User Existing In System?</button>

                                <button onClick={() => {
                                    let address = prompt('Put eth address for which you need see leave balace', this.state.account);
                                    getMyLeaves(this.state.contract, this.state.account, address).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Get My Leave Balance</button>

                                <button onClick={() => {
                                    let address = prompt('How many leaves do you want to apply', 1);
                                    applyLeave(this.state.contract, this.state.account, address).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Apply Leave</button>

                                <button onClick={() => {
                                    let leave = prompt('How many leaves do you want to give to employee', 1);
                                    let address = prompt('which employee do you want to give the leaves to', this.state.account)
                                    addEmployeeLeave(this.state.contract, this.state.account, address, leave).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Add Leaves For Employeee</button>


                                <button onClick={() => {
                                    getLeaveList(this.state.contract, this.state.account).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Get My Leave Details</button>



                                <button onClick={() => {
                                    getEmployeePendingLeaveList(this.state.contract, this.state.account).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Get All Employee Pending Leaves</button>

                                <button onClick={() => {
                                    let index = prompt('give index of leave which you want to approve', 0);
                                    approveLeave(this.state.contract, this.state.account, index).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Approve Leave</button>


                                <button onClick={() => {
                                    let index = prompt('give index of leave which you want to disallow', 0);
                                    disallowLeave(this.state.contract, this.state.account, index).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Disallow Leave</button>

                                <button onClick={() => {
                                    getEmployeeApprovedLeaveList(this.state.contract, this.state.account, index).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Get Employee Approved Leave List</button>

                                <button onClick={() => {
                                    getTokenBalance(this.state.token_contract, this.state.account).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Get Token Balance</button>


                                <button onClick={() => {
                                    let address = prompt('To whom do you want to transfer token', "");
                                    let amount = prompt('how many tokens do you want to transfer', 100);
                                    transferToken(this.state.token_contract, this.state.account, address, amount).then(tx => {
                                        console.log(tx);
                                    })
                                }
                                }>Transfer Token</button>
                                 </div>
                                */}




                    </div>
                </div>
            </div >
        );
    }
}

export default HomeView;
