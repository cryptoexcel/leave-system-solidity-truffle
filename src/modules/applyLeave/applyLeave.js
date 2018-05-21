import React from 'react'
import swal from 'sweetalert';
import Transaction from '../../components/transaction/transaction';
import { LEAVE_CONTRACT_ADDRESS } from '../../utils/leavesystem'

class ApplyLeaveView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            execTx: false,
            message: false
        }
    }
    applyLeave() {
        this.props.erc20Contract.allowance(LEAVE_CONTRACT_ADDRESS).then((allowed) => {
            if (allowed < this.state.days * 10 ** 18) {
                console.log(allowed + "xxx" + this.state.days * 10 ** 18)
                swal({
                    title: "Oops!!",
                    text: "You first need to allow contract to use your tokens, current allowane is only " + allowed
                }).then(() => {
                    let tx = this.props.erc20Contract.approve(LEAVE_CONTRACT_ADDRESS, this.state.days * 10 ** 18);
                    this.setState({
                        execTx: tx
                    })
                    tx.then(() => {
                        this.setState({
                            execTx: false,
                            message: "Waiting for block confirmations..."
                        })

                        let retry = 0;

                        let checkInterval = setInterval(() => {
                            this.props.erc20Contract.allowance(LEAVE_CONTRACT_ADDRESS).then((allowed) => {
                                retry++;
                                if (allowed >= this.state.days * 10 ** 18) {
                                    clearInterval(checkInterval);
                                    let tx = this.props.leaveContract.applyLeave(this.state.days);
                                    this.setState({
                                        execTx: tx,
                                        message: "applying leave..."
                                    })

                                } else {
                                    if (retry > 60) {
                                        clearInterval(checkInterval);
                                        this.setState({
                                            message: "Trying again after some time... Blockchain is flooded"
                                        })
                                    } else {
                                        this.setState({
                                            message: "Waiting for block confirmations... (" + retry + "/60) sec"
                                        })
                                    }
                                }
                            })

                        }, 1000)





                    })
                })

            } else {
                let tx = this.props.leaveContract.applyLeave(this.state.days);
                this.setState({
                    execTx: tx,
                    message: "applying leave..."
                })
                tx.then( () => {
                    this.setState({
                        execTx: tx,
                        message: "leave applied..."
                    })
                })
            }
        })



    }
    render() {
        return (
            <div className="row" >
                You have a leave balance of {this.props.leavesBalance}
                <br />

                {this.state.message ? <div>{this.state.message}</div> : null}

                Apply leave Form
                < br />

                <div className='col-sm-12 form'>
                    <h1 className='heading' > Number of Days You Want Leave? </h1>
                    <input
                        type='number'
                        placeholder='Email'
                        value={this.state.days}
                        onChange={(e) => this.setState({ days: e.target.value })}
                    />
                    <button onClick={() => this.applyLeave()} >Apply Leave</button>


                    {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}

                </div>
            </div >
        )
    }
}

export default ApplyLeaveView;
