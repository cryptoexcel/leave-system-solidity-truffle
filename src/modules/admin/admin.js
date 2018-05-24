import React from 'react'
import Header from '../../components/header/header'
import { LeaveContarct } from '../../utils/leavesystem'
import { Web3Util } from '../../utils/getWeb3'
import { ERC20 } from '../../utils/erc20-etech'
import swal from 'sweetalert';
import LeaveDisplay from '../../components/leavedisplay'
import Transaction from '../../components/transaction/transaction';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: false,
            account: false,
            balance: false,
            leaveContract: false,
            userId: false,
            leavesBalance: false,
            erc20Contract: false,
            pending_leaves: [],
            approved_leaves: [],
            execTx: false,
            isAdmin: false,
            tokens_to_send: {
                addr: "",
                value: 0
            }
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
                            this.getPendigLeaves();
                            this.getApprovedLeaves()
                            this.isContractOwner();
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
    isContractOwner() {
        this.state.leaveContract.isContractOwner()
            .then((obj) => {
                this.setState({
                    isAdmin: obj
                })
            })
    }
    getPendigLeaves() {
        this.state.leaveContract.getEmployeePendingLeaveList()
            .then((obj) => {
                this.setState({
                    pending_leaves: obj
                })
            })
    }
    getApprovedLeaves() {
        this.state.leaveContract.getEmployeeApprovedLeaveList()
            .then((obj) => {
                this.setState({
                    approved_leaves: obj
                })
            })
    }
    allow() {
        console.log("allow")
    }
    disallow() {
        let tx = this.state.leaveContract.disallowLeave();
        this.setState({
            execTx: tx
        })
    }
    sendTokens() {
        if (!this.state.isAdmin) {
            swal("Only contract owner can do this")
            return;
        }

        let tx = this.state.leaveContract.addEmployeeLeave(this.state.tokens_to_send.addr, this.state.tokens_to_send.value)
        this.setState({
            execTx: tx
        })

    }
    render() {
        return (
            <div className='home-view container-fluid'>
                <Header title='Admin' />
                <div className='row'>
                    {this.state.isAdmin ? "You are contract owner!!" : "Since you are not contract owner, this admin will be just read only for you"}
                    <div className='col-sm-12'>
                        <h3>Get Employee Pending Leaves</h3>
                        <div className='row'>

                            {this.state.pending_leaves.length === 0 ? "No Pending Leaves" : null}

                            {this.state.pending_leaves.map((leave, i) => {
                                // Return the element. Also pass key     
                                return <LeaveDisplay allow={() => this.allow(leave, i)} disallow={() => this.disallow(leave, i)} key={i} leave={leave} isAdmin={this.state.isAdmin} />
                            })}

                        </div>


                        <h3>Get Employee Approved Leaves</h3>
                        <div className='row'>

                            {this.state.approved_leaves.length === 0 ? "No Approved Leaves" : null}

                            {this.state.approved_leaves.map((leave, i) => {
                                // Return the element. Also pass key     
                                return <LeaveDisplay allow={() => this.allow(leave, i)} disallow={() => this.disallow(leave, i)} key={i} leave={leave} isAdmin={this.state.isAdmin} />
                            })}

                        </div>

                        <h3>Send ETECH Tokens to Employee</h3>
                        Only Contract Owner can Do this
                        <div className='row'>
                            <input
                                type='text'
                                placeholder='Address'
                                value={this.state.tokens_to_send.addr}
                                onChange={(e) => this.setState({
                                    tokens_to_send: {
                                        addr: e.target.value,
                                        value: this.state.tokens_to_send.value
                                    }
                                })}
                            />
                            <input
                                type='number'
                                placeholder='Tokens'
                                value={this.state.tokens_to_send.value}
                                onChange={(e) => this.setState({
                                    tokens_to_send: {
                                        addr: this.state.tokens_to_send.addr,
                                        value: e.target.value
                                    }
                                })}
                            />
                            <button onClick={() => {
                                this.sendTokens();
                            }}>Send</button>
                        </div>
                    </div>
                    {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}
                </div>
            </div>
        )
    }
}

export default Admin;
