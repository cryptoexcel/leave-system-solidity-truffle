import React from 'react'
import Header from '../../components/header/header'
import './homeView.scss'
import { LeaveContarct } from '../../utils/leavesystem'
import { Web3Util } from '../../utils/getWeb3'
import { ERC20 } from '../../utils/erc20-etech'
import swal from 'sweetalert';
import LoginView from '../login/login';
import ApplyLeaveView from '../applyLeave/applyLeave'
import LeaveList from '../leaves/leaves'
import { HRSystem } from '../../utils/hr'
import BuyLeave from '../buyleave/buyleave'

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: false,
            account: false,
            balance: false,
            leaveContract: false,
            userId: false,
            leavesBalance: false,
            erc20Contract: false,
            hrsystem: false,
            message: false,
            isUserInContract: false
        };
    }
    componentDidMount() {
        this.initApp();
    }

    initApp() {
        console.log("init app....")
        new Web3Util().initWeb3()
            .then((state) => {
                state.hrsystem = new HRSystem();
                state.erc20Contract = new ERC20(state.web3, state.account);
                state.leaveContract = new LeaveContarct(state.web3, state.account)
                this.setState(state, () => {


                    //this is not a good practice, but i am king of waiting for contract to be loaded.
                    //just to reduce boilet plate code in leavesystem.
                    //we are waiting for the contract to get set in the class object and the call further functions
                    // but is not good way, just lazy!!
                    let checker = setInterval(() => {
                        if (state.leaveContract.isContract()) {
                            clearInterval(checker);
                            this.checkIfUserExists();
                        }
                    }, 100)
                    if (this.state.account)
                        //keep tracker if eth account is changed from meta mask
                        setInterval(() => {
                            new Web3Util().getDefaultAccount(this.state.web3)
                                .then((newDefaltAccount) => {
                                    if (newDefaltAccount !== this.state.account) {
                                        swal("web3 account changed, refreshing the page", "info")
                                            .then((val) => {
                                                if (val) {
                                                    window.location.reload(true);
                                                }
                                            })

                                    }
                                })

                        }, 2000)
                })
            })
    }
    checkUserLeaves() {
        this.state.leaveContract.getMyLeaves().then((leavesBalance) => {

            this.setState({
                leavesBalance: leavesBalance / (10 ** 18)
            })
            if (leavesBalance > 0) {
                this.setState({
                    message: "You are already part of Excellence Blockchain based leave system!!!",
                })
            }

        })
    }
    checkIfUserExists() {
        this.state.leaveContract.getUser()
            .then((userId) => {
                if (userId > 0) {
                    this.setState({
                        userId,
                        isUserInContract: true
                    })

                    this.checkUserLeaves();

                } else {
                    this.setState({
                        message: "You are not part of our system, you need to create account",
                        isUserInContract: false,
                        leavesBalance: 0,
                        userId: 0
                    })
                }
            })
    }
    onUsersLogin(profile) {
        this.setState({
            userId: profile.id
        })
    }
    _renderMessage() {
        return (
            <div className="alert alert-secondary" role="alert">
                {this.state.message}
            </div>
        )
    }
    render() {
        if (!this.state.web3) {
            return (
                <div>Waiting...</div>
            )
        }
        return (
            <div className='home-view container-fluid'>
                <Header title='Warehouse' />
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='row'>
                            {this.state.message ? this._renderMessage() : null}
                            <ul className="list-group">
                                <li className="list-group-item">Account Found: {this.state.account}</li>
                                <li className="list-group-item">Ether balance {this.state.balance}</li>
                                <li className="list-group-item">User ID: {this.state.userId}</li>
                                <li className="list-group-item">Leave Balance: {this.state.leavesBalance}</li>
                            </ul>
                        </div>
                        {this.state.userId !== false ? <LoginView onJoinContract={() => { this.checkIfUserExists(); }} onUserLogin={(obj) => this.onUsersLogin(obj)} {...this.state} /> : null}
                        {this.state.leavesBalance === 0 ? <BuyLeave {...this.state} /> : null}
                        {this.state.leavesBalance > 0 ? <ApplyLeaveView {...this.state} /> : null}
                        {this.state.userId > 0 ? <LeaveList {...this.state} /> : null}
                    </div>
                </div>
            </div >
        );
    }
}

export default HomeView;
