import React from 'react'
import Header from '../../components/header/header'
import './homeView.scss'
import {
    getWeb3,
    getDefaultAccount,
    initContract,
    getAccountBalance,
    joinUser,
    resetLeaves,
    getUser,
    getMyLeaves,
    applyLeave,
    addEmployeeLeave,
    getLeaveList,
    getEmployeePendingLeaveList,
    approveLeave,
    disallowLeave,
    getEmployeeApprovedLeaveList
}
    from '../../utils/getWeb3'

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'reactexcel@excellence',
            password: '123456',
            contract: false,
            account: false,
            balance: false,
        };
    }

    componentWillMount() {
        console.log(this.props, '============')

        getWeb3
            .then(web3 => {
                return initContract(web3)
                    .then((contract) => {
                        return getDefaultAccount(web3)
                            .then(account => {
                                console.log(account);
                                return getAccountBalance(web3, account)
                                    .then(balance => {
                                        console.log(balance);
                                        this.setState({
                                            account,
                                            balance,
                                            contract
                                        })
                                    })
                            });
                    });
            })
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        const { email, password } = this.state;
        return (
            <div className='home-view container-fluid'>
                <Header title='Warehouse' />
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='row login-panel'>
                            <div className='col-sm-3'></div>
                            <div className='col-sm-6 form'>
                                <h1 className='heading' > LOGIN </h1>
                                <input
                                    type='text'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                />
                                <button onClick={() => this.onSubmitLogin()} >LOGIN</button>
                            </div>
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

                                

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default HomeView;
