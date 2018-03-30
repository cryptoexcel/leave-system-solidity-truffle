import React from 'react'
import Header from '../../components/header/header'
import './homeView.scss'
import { getWeb3, getDefaultAccount, initContract, getAccountBalance, joinUser, resetLeaves } from '../../utils/mockWeb3'

class HomeView extends React.Component{
    constructor(props){
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
    render(){
        const { email, password } = this.state;
        return(
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
                                    onChange={(e) => this.setState({email: e.target.value})}
                                />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => this.setState({password: e.target.value})}
                                />
                                <button onClick={() => this.onSubmitLogin()} >LOGIN</button>
                            </div>
                            <div className='col-sm-3'>
                            <button onClick={() => resetLeaves(this.state.contract, this.state.account, this.state.account).then(tx => {
                                console.log(tx);
                                })
                            }>Reset Leave</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeView;
