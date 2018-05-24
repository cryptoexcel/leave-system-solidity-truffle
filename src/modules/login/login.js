import React from 'react'
import './login.scss'
import swal from 'sweetalert';
import Transaction from '../../components/transaction/transaction';
import PubSub from 'pubsub-js'

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            execTx: false,
            profile: false,
            checkAddressIDAssoication: false
        };
    }
    componentDidMount() {
        this.initLogin();
    }
    initLogin() {
        return this.props.hrsystem.getMyProfile().then((obj) => {
            this.props.onUserLogin(obj)
            this.setState({
                profile: obj
            }, () => {
                this.checkAddressIDAssoication();
            })
        }).catch((err) => { console.log(err) })
    }
    checkAddressIDAssoication() {
        if (this.state.profile) {
            if (this.state.profile.eth_token == this.props.account) {
                console.log("all cool!! same user and eth address");
            } else if (this.state.profile.eth_token.length === 0) {
                console.log('not token found')
                this.props.hrsystem.assignAddressToUser(this.props.account);
            } else {
                this.setState({ checkAddressIDAssoication: true })
            }
        }
    }
    joinContract() {
        console.log("joining user with id " + this.state.profile.id);
        let tx = this.props.leaveContract.joinUser(this.state.profile.id);
        this.setState({
            execTx: tx
        })
        tx.then(() => {
            this.props.onJoinContract();
        })
    }
    guestLogin() {
        let userId = Math.floor(Math.random() * 10000)
        console.log("joining user with id " + userId);
        let tx = this.props.leaveContract.joinUser(userId);
        this.setState({
            execTx: tx
        })
        tx.then(() => {
            this.props.onJoinContract();
        })

    }
    onSubmitLogin() {
        this.props.hrsystem.login(this.state.username, this.state.password)
            .then(() => {
                return this.props.hrsystem.getMyProfile().then((obj) => {
                    this.props.onUserLogin(obj)
                    this.setState({
                        profile: obj
                    }, () => {
                        this.checkAddressIDAssoication();
                    })
                    // let tx = this.props.leaveContract.joinUser(obj.id);
                    // this.setState({
                    //     execTx: tx
                    // })
                    // return tx
                })
            }).catch((err) => {
                console.log(err);
                swal(err)
            })

    }
    _renderAssociation() {
        return (
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Problem!</h4>
                <p>Your account was assoicated to a different address {this.state.profile.eth_token} </p>
                <p>But now you are accessing the system with {this.props.account} </p>
                <hr />
                <p className="mb-0">Either you need to switch back to your old account and replace it with your new address</p>
                <p>If you replace, all your previous leave data would be lost!! so better to use your original address</p>
                <button type="button" onClick={() => {
                    this.props.hrsystem.assignAddressToUser(this.props.account)
                        .then(() => {
                            let profile = this.state.profile;
                            profile.eth_token = this.props.account;
                            this.setState({ checkAddressIDAssoication: false })
                            this.checkAddressIDAssoication();
                        })
                }} className="btn btn-dark">Replace</button>

                <p> OR </p>

                <button type="button" onClick={() => {
                    this.props.hrsystem.logout()
                    this.initLogin().then(() => {
                        this.props.onJoinContract();
                    })
                }} className="btn btn-dark">Logout</button>
            </div >
        )
    }
    _renderCreateAccount() {
        const { username, password } = this.state;
        return (
            <div className='row'>
                Since you don't have account already, authenticate your account with our HR system.
                so we can validate it.
                <div className='col-sm-12 form'>

                    <h1 className='heading' > LOGIN </h1>
                    <input
                        type='text'
                        placeholder='userame'
                        value={username}
                        onChange={(e) => this.setState({ username: e.target.value })}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                    <button onClick={() => this.onSubmitLogin()} >LOGIN</button>
                    <button onClick={() => this.guestLogin()} >Login As Guest</button>
                </div>

                {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}

            </div>
        )
    }
    _renderJoinContract() {
        return (
            <div>
                <div className="alert alert-warning" role="alert">
                    You are not part of the contract yet
                </div>
                <button onClick={() => this.joinContract()} type="button" className="btn btn-primary">Join Contract </button>
            </div>
        )
    }
    _renderUser() {
        return (
            <div>
                <div className="card" style={{ width: '18rem' }}>
                    <img className="card-img-top" src=".../100px180/" alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">{this.state.profile.name}</h5>
                        <div className="card-text">{this.state.profile.jobtitle}</div>
                        <div className="card-text">{this.state.profile.status}</div>
                        <div className="card-text">{this.state.profile.eth_token}</div>
                        <p className="card-text">
                            {!this.props.isUserInContract ? this._renderJoinContract() : null}
                        </p>

                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div>
                {!this.state.profile ? this._renderCreateAccount() : null}
                {this.state.profile ? this._renderUser() : null}
                {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}
                {this.state.checkAddressIDAssoication ? this._renderAssociation() : null}
            </div>
        )
    }
}

export default LoginView;
