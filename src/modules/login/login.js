import React from 'react'
import './login.scss'
import swal from 'sweetalert';
import Transaction from '../../components/transaction/transaction';

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            execTx: false
        };
    }
    guestLogin() {
        let userId = Math.floor( Math.random()*10000 )
        console.log("joining user with id " + userId); 
        let tx = this.props.leaveContract.joinUser(userId);
        this.setState({
            execTx: tx
        })    
            
    }
    onSubmitLogin() {
        swal("Oops!!", "Integration with hr system is pending, click on guest option for now")
    }
    _renderCreateAccount() {
        const { email, password } = this.state;
        return (
            <div className='row'>
                Since you don't have account already, authenticate your account with our HR system.
                so we can validate it.
                <div className='col-sm-12 form'>
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
                    <button onClick={() => this.guestLogin()} >Login As Guest</button>
                </div>

                {this.state.execTx ? <Transaction execTx={this.state.execTx} /> : null}

            </div>
        )
    }
    render() {
        return this.props.userId === 0 ? this._renderCreateAccount() : null
    }
}

export default LoginView;
