pragma solidity ^0.4.19;

contract LeaveSystem {
    //data type of employee
	struct Employee {
	    uint id; // id of employee from database
	    uint leaves;  //starting leave balance of employee
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
	mapping (address => Employee) private leaveBalance;
    
    Leave[] private leaves;
	
	modifier isOwner { require(msg.sender == owner); _; }
	
	//constructor
	function LeaveSystem() public {
	    owner = msg.sender;
	}
	
	//event to notify when a new user has joined
	event UserJoined(address user);
	event LeaveApplied(address user, uint leaves);
	event LeaveApproved(uint leave_index);
	event LeaveDisallowed(uint leave_index);
	
	//function to add user to contract
	function joinUser(uint userId, uint leave_balance) public {
	    require(userId > 0);  //actual database user id from hr system
	    require(leave_balance > 0);  //no leaves user has from hr system
	    if(leaveBalance[msg.sender].id != 0) revert(); //revert if user already exists
	    
	    Employee memory user = Employee(userId, leave_balance);
	    leaveBalance[msg.sender] = user;
	    
	    UserJoined(msg.sender);
	}
	
	function resetLeaves(address addr) public isOwner {
	    delete leaveBalance[addr];
	}
	
	function applyLeave(uint no_days, uint id) public{
	     require(no_days > 0);
	     if(leaveBalance[msg.sender].id == 0) revert();
	     require(leaveBalance[msg.sender].leaves > no_days);
	     
	     Leave memory leave = Leave(id,no_days, false, msg.sender,0,address(0));
	     leaves.push(leave);
	     LeaveApplied(msg.sender,no_days);
	}
	
	function approveLeave(uint leave_index) public isOwner{
	    Leave memory leave = leaves[leave_index];
	    require(leaveBalance[leave.by].leaves > leave.no_days);
	    leaveBalance[leave.by].leaves = leaveBalance[leave.by].leaves - leave.no_days;
	    leave.approved = true;
	    leave.action_by = msg.sender;
	    leave.action_at = now;
	    leaves[leave_index] = leave;
	    //delete leaves[leave_index];
	    // if we don't delete the leaves it will keep on charging more gas.
	    // https://ethereum.stackexchange.com/questions/872/what-is-the-cost-to-store-1kb-10kb-100kb-worth-of-data-into-the-ethereum-block
	    // so need a better solution
	    // but we need to keep all leave history as well.
	    LeaveApproved(leave_index);
	}
	
	function disallowLeave(uint leave_index) public isOwner{
	    Leave memory leave = leaves[leave_index];
	    leave.approved = false;
	    leave.action_by = msg.sender;
	    leave.action_at = now;
	    leaves[leave_index] = leave;
	    LeaveDisallowed(leave_index);
	}
	
	//employee earn leaves every month
	function addEmployeeLeave(address employee, uint monthly_leaves) public isOwner {
	    leaveBalance[employee].leaves += monthly_leaves;
	}
	
	//each user can his leave balance
	function getLeaveBalance() public constant returns (uint){
	    return leaveBalance[msg.sender].leaves;
	}
	
	// get leave balance of any employee
	function getEmployeeLeaveBalance(address addr) public isOwner constant returns (uint){
	    return (leaveBalance[addr].leaves);
	}
}