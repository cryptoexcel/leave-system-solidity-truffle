import React from 'react'
import swal from 'sweetalert';
import Transaction from '../../components/transaction/transaction';
import { LEAVE_CONTRACT_ADDRESS } from '../../utils/leavesystem'
import LeaveDisplay from '../../components/leavedisplay'
import PubSub from 'pubsub-js'

class LeaveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            execTx: false,
            message: false,
            leaves: []
        }
    }
    componentDidMount() {
        this.getLeaveList();
        PubSub.subscribe('leave_appied', () => {
            this.getLeaveList();
        });
    }
    getLeaveList() {
        this.props.leaveContract.getLeaveList()
            .then((obj) => {
                console.log(obj);
                this.setState({
                    leaves: obj
                })
            })
    }
    render() {
        return (
            <div className="row" >
                <h2>Leave List</h2>
                {this.state.leaves.length === 0 ? "No Leaves" : null}

                {this.state.leaves.map((leave, i) => {
                    // Return the element. Also pass key     
                    return <LeaveDisplay allow={() => this.allow(leave, i)} disallow={() => this.disallow(leave, i)} key={i} leave={leave} isAdmin={this.state.isAdmin} />
                })}

                {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}

            </div >
        )
    }
}

export default LeaveList;
