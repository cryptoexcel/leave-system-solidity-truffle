import React from 'react'
import Transaction from '../../components/transaction/transaction';
import PubSub from 'pubsub-js'

class BuyLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            execTx: false,
            exchange: false,
            eth: 0
        }
    }
    getExchangeRate() {
        this.props.leaveContract.exchangeRate()
            .then((obj) => {
                this.setState({
                    exchange: obj
                })
            })
    }
    buy() {
        if (this.state.exchange > 0) {
            let eth_to_send = this.state.eth / this.state.exchange;

            swal("confirm that you will be sending " + eth_to_send + " ETH")
                .then((val) => {
                    if (val) {
                        let tx = this.props.leaveContract.buyLeave(eth_to_send)
                        this.setState({
                            execTx: tx
                        })
                        tx.then( () => {
                            PubSub.publish("buyleave");
                        })
                    }
                })
        } else {
            swal("invalid exchage rate!!")
        }
    }
    componentDidMount() {
        this.getExchangeRate();
    }
    render() {
        return (
            <div>
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">Note!</h4>
                    <p>You don't have any tokens so you cannot apply for leave. So either wait for airdrop of tokens which is done 1st of every month or you tokens with ETH</p>
                    <hr />
                    <p className="mb-0">
                        Exchange Rate is {this.state.exchange} leaves (ETECH Token) per ETH
                    </p>
                    <form>
                        <div className="form-group">
                            <label>How leaves do you want to buy?</label>
                            <input type="number" value={this.state.eth} onChange={(e) => this.setState({ eth: e.target.value })} />
                        </div>
                        <button className="btn btn-secondary" onClick={() => this.buy()}>Buy Leaves</button>
                    </form>
                </div>
                {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}
            </div>
        )
    }
}

export default BuyLeave;