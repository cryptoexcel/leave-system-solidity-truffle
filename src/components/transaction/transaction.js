import React from 'react'
import './transaction.scss'

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tx: false,
            err: false
        }
    }
    componentWillReceiveProps(newProps){
        console.log(newProps)
        if(!newProps.execTx){
            this.setState({
                tx: false,
                err: false
            })
        }
    }
    componentDidMount() {
        this.props.execTx
            .then((tx) => {
                console.log(tx);
                this.setState({ tx: tx.tx })
            }).catch((err) => {
                console.log("transaction error", err)
                this.setState({ err });
            })
    }
    render() {
        return (
            <div className="transaction">
                {!this.state.tx && !this.state.err ? <span>Executing Transaction on blockchain... <div className="spinner"> </div> </span> : null}
                {this.state.tx ? "https://rinkeby.etherscan.io/tx/" + this.state.tx : null}
                {this.state.err ? this.state.err.message : null}
            </div>
        );
    }
}

export default Transaction;
