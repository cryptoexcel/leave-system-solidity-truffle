//leave management contract with ETECH Tokens

import './erc20.sol';

pragma solidity ^0.4.19;

contract LeaveSystemTokenized {
    //data type of employee
	struct Employee {
	    uint id; // id of employee from database
	}
	
	struct Leave {
	    uint id;  //actual id of leave from database
	    uint no_days;  //number of days for which leave is applied
	    bool approved; // if leave is approved or not 
	    address by; // person who applied the leave
	    uint action_at; // at what time was leave approved/disallowed 
	    address action_by; // who approved/disallowed leave
	}
	
	//owner of the contract 
	address owner;
	
	//maintain a leave balance
	mapping (address => Employee) private employees;
    
    Leave[] private leaves;
	
	modifier isOwner { require(msg.sender == owner); _; }

    modifier isEmployee { require(employees[msg.sender].id != 0); _; }
    
    ERC20Interface token;

	//constructor
	constructor() public {
	    owner = msg.sender;
        address _tokenAddr = 0x8bc0978B628C93c86aE79e53017b30363FE81840; //ETECH smartcontract address
        token = ERC20Interface(_tokenAddr);
	}
	
	//event to notify when a new user has joined
    event UserJoined(address user);
	event LeaveApplied(address user, uint leaves);
	event LeaveApproved(uint leave_index);
	event LeaveDisallowed(uint leave_index);
	
	function isContractOwner() public constant returns (bool){
	    return msg.sender == owner;
	}
	//function to add user to contract
	function joinUser(uint userId) public {
	    require(userId > 0);  //actual database user id from hr system
	    if(employees[msg.sender].id != 0) revert(); //revert if user already exists
	    
	    Employee memory user = Employee(userId);
	    employees[msg.sender] = user;
	    
	    emit UserJoined(msg.sender);
	}
    
    function addUser(address addr, uint userId) public isOwner {
        
        require(userId > 0);  //actual database user id from hr system
	    
	    Employee memory user = Employee(userId);
	    employees[addr] = user;
	    
	    emit UserJoined(addr);
    }
    
    function getUser() public constant returns (uint){
		return employees[msg.sender].id;
	}

	function getMyLeaves() public isEmployee constant returns (uint) {
		uint balance = token.balanceOf(msg.sender);
		return balance;
	}  
    
	function getUserId(address addr) public isOwner constant returns (uint){
		return employees[addr].id;
	}

	function getLeaves(address addr) public isOwner constant returns (uint) {
		uint balance = token.balanceOf(addr);
		return balance;
	} 
	

	function applyLeave(uint leave_id, uint no_days) public isEmployee {
	     require(no_days > 0);
	     
         uint allowance = token.allowance(msg.sender,this);

	     require(allowance >= no_days * 10 ** 18);
	     
	    
	     Leave memory leave = Leave(leave_id,no_days, false, msg.sender,0,address(0));
	     leaves.push(leave);
	     emit LeaveApplied(msg.sender,no_days);
	}
	
	function approveLeave(uint leave_index) public isOwner{
	    
	    
	    Leave memory leave = leaves[leave_index];
	    
	    token.transferFrom(leave.by, this, leave.no_days);
	    
	    leave.approved = true;
	    leave.action_by = msg.sender;
	    leave.action_at = now;
	    leaves[leave_index] = leave;
	    //delete leaves[leave_index];
	    // if we don't delete the leaves it will keep on charging more gas.
	    // https://ethereum.stackexchange.com/questions/872/what-is-the-cost-to-store-1kb-10kb-100kb-worth-of-data-into-the-ethereum-block
	    // so need a better solution
	    // but we need to keep all leave history as well.
	    emit LeaveApproved(leave_index);
	}
	
	function disallowLeave(uint leave_index) public isOwner{
	    Leave memory leave = leaves[leave_index];
	    leave.approved = false;
	    leave.action_by = msg.sender;
	    leave.action_at = now;
	    leaves[leave_index] = leave;
	    emit LeaveDisallowed(leave_index);
	}
	
	function getLeaveList() public constant returns (uint[]) {
	    //maximum restriction of 80 leaves
	    uint[] memory indexs = new uint[](80);
	    uint j = 0;
	    for( uint i = 0 ; i < leaves.length ; i++ ){
	        if(leaves[i].by == msg.sender){
	            indexs[j] = i+1;
	            j++;
	        }
	    }
	    return indexs;
	}
	
	function getEmployeeApprovedLeaveList() public isOwner constant returns (uint[]){
	    //maximum restriction of 80 leaves
	    uint[] memory indexs = new uint[](80);
	    uint j = 0;
	    for( uint i = 0 ; i < leaves.length ; i++ ){
	        if(leaves[i].approved){
	            indexs[j] = i+1;
	            j++;
	        }
	    }
	    return indexs;
	}
	
	function getEmployeePendingLeaveList() public isOwner constant returns (uint[]){
	    //maximum restriction of 80 leaves
	    uint[] memory indexs = new uint[](80);
	    uint j = 0;
	    for( uint i = 0 ; i < leaves.length ; i++ ){
	        if(!leaves[i].approved){
	            indexs[j] = i+1;
	            j++;
	        }
	    }
	    return indexs;
	}
	
	function getLeaveDetail(uint index) public constant returns (uint, uint, bool, address, uint, address){
        Leave memory _leave = leaves[index];
        if(_leave.by == msg.sender || msg.sender == owner){
            return (_leave.id, _leave.no_days, _leave.approved, _leave.by, _leave.action_at, _leave.action_by);
        }else{
            revert();
        }
	}
	
	
	
	//employee earn leaves every month
	function addEmployeeLeave(address employee, uint monthly_leaves) public isOwner {
	    
	    //this will not work because msg.sender will be seen as the contract 
	    //rather than actual person doing the transaction.
	    //so either this contract should have tokens or it will assume contract having 0 tokens
	    // https://ethereum.stackexchange.com/questions/28328/unable-to-call-token-contract-function-from-another-contract
        require(token.transfer(employee, monthly_leaves * 10 ** 18));
	}
	  
	function buyLeave() public payable {
	    require(msg.value > 0);
	    uint256 rate = exchangeRate();
	    token.transfer(msg.sender, msg.value * rate);
	    owner.transfer(msg.value);
	}
	function exchangeRate() public pure returns (uint256) {
	    return 1000;
	}
	function tokensAvailable() public constant returns (uint256) {
        return token.balanceOf(this);
    }
	function destroy() isOwner public{
        uint256 balance = tokensAvailable();
        require (balance > 0);
        token.transfer(owner, balance);
        selfdestruct(owner);
    }
}