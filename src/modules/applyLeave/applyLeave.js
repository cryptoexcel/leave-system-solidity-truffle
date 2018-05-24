import React from 'react'
import swal from 'sweetalert';
import Transaction from '../../components/transaction/transaction';
import { LEAVE_CONTRACT_ADDRESS } from '../../utils/leavesystem'
import PubSub from 'pubsub-js'
import classNames from 'classnames'


class ApplyLeaveView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            execTx: false,
            message: false,
            startdate: false,
            enddate: false,
            reason: "",
            leave_type: ""
        }
    }
    applyLeave() {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let startDate = this.state.startdate;
        if (!startDate) {
            startDate = "";
        }
        let endDate = this.state.enddate;
        if (!endDate) {
            endDate = "";
        }
        var firstDate = new Date(startDate.split("-")[0]*1, startDate.split("-")[1]*1, startDate.split("-")[2]*1);
        var secondDate = new Date(endDate.split("-")[0]*1, endDate.split("-")[1]*1, endDate.split("-")[2]*1);
        console.log(firstDate)
        console.log(secondDate);
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        console.log(diffDays)
        if (!diffDays || diffDays <= 0) {
            this.setState({ message: "you need to apply leave for more tha 0 zero days" })
            return;
        }
        if (this.state.reason.length == 0) {
            this.setState({ message: "put reason for leave" })
            return;
        }
        if (this.state.leave_type.length == 0) {
            this.setState({ message: "select leave type" })
            return;
        }

        this.props.hrsystem.applyLeave(this.startdate, this.enddata, diffDays, this.state.reason, this.state.type)
        return;
        this.props.erc20Contract.allowance(LEAVE_CONTRACT_ADDRESS).then((allowed) => {
            if (allowed < this.state.days * 10 ** 18) {
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
                                    let leaveId = Math.floor(Math.random() * 10000)
                                    let tx = this.props.leaveContract.applyLeave(leaveId, this.state.days);
                                    this.setState({
                                        execTx: tx,
                                        message: "applying leave..."
                                    })
                                    tx.then(() => {
                                        PubSub.publish('leave_appied', {});
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
                let leaveId = Math.floor(Math.random() * 10000)
                let tx = this.props.leaveContract.applyLeave(leaveId, this.state.days);
                this.setState({
                    execTx: tx,
                    message: "applying leave..."
                })
                tx.then(() => {
                    this.setState({
                        execTx: tx,
                        message: "leave applied..."
                    })

                    PubSub.publish('leave_appied', {});

                })
            }
        })



    }
    render() {
        return (
            <div className="row" >
                You have a leave balance of {this.props.leavesBalance}
                <br />

                {this.state.message ? <div><div className="alert alert-secondary" role="alert">{this.state.message}</div></div> : null}

                Apply leave Form
                < br />

                <div className='col-sm-12 form'>
                    <div className="form-group">
                        <label>Start Date of Leave </label>
                        <input type="date" value={this.state.startdate}
                            onChange={(e) => {
                                this.setState({
                                    startdate: e.target.value
                                })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date of Leave </label>
                        <input type="date" value={this.state.enddate}
                            onChange={(e) => {
                                this.setState({
                                    enddate: e.target.value
                                })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label> Reason </label>
                        <input
                            type='text'
                            placeholder='Reason'
                            value={this.state.reason}
                            onChange={(e) => this.setState({ reason: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label> Type of Leave </label>
                        <ul className="list-group">
                            <li onClick={() => this.setState({ leave_type: "Casual Leave" })} className={classNames('list-group-item', { "active": this.state.leave_type === "Casual Leave" })}>Casual Leave</li>
                            <li onClick={() => this.setState({ leave_type: "Sick Leave" })} className={classNames('list-group-item', { "active": this.state.leave_type === "Sick Leave" })} > Sick Leave</li>
                        </ul>
                    </div>

                    <button onClick={() => this.applyLeave()} >Apply Leave</button>
                </div>
                {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}
            </div >
        )
    }
}

export default ApplyLeaveView;
