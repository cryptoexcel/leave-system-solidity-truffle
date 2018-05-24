import React from 'react'


class LeaveDisplay extends React.Component {
    render() {
        return (
            <div className="card" style={{ width: '18rem' }}>
                <div className="card-body">
                    Leave Applied By: {this.props.leave.by}
                    <br />
                    Leave Approved: {this.props.leave.approved}
                    <br />
                    No of days {this.props.leave.no_of_days}
                    <br />
                    HR System Leave ID {this.props.leave.id}
                    <br />
                    Leave Approved At: {this.props.leave.action_at}
                    <br />
                    Approved By {this.props.leave.action_by}

                    {
                        !this.props.leave.approved && this.props.isAdmin ?
                            <button onClick={() => this.props.disallow()}>Disallow</button>
                            : null
                    }

                    {
                        !this.props.leave.approved && this.props.isAdmin ?
                            <button onClick={() => this.props.allow()}>Approve</button>
                            : null
                    }
                </div>
            </div>
        );
    }
}

export default LeaveDisplay;
