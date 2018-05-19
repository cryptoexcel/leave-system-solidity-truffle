pragma solidity ^0.4.19;

import './erc20.sol';

contract AirDrop is Owned {

  ERC20Interface token;

  event TransferredToken(address indexed to, uint256 value);
  event FailedTransfer(address indexed to, uint256 value);

  modifier whenDropIsActive() {
    assert(isActive());

    _;
  }

  constructor() public {
      address _tokenAddr = 0x8bc0978B628C93c86aE79e53017b30363FE81840; //ETECH smartcontract address
      token = ERC20Interface(_tokenAddr);
  }

  function isActive() public constant returns (bool) {
    return (
        tokensAvailable() > 0 // Tokens must be available to send
    );
  }


//below function can be used when you want to send every recipient with different number of tokens
function sendTokens(address[] dests, uint256[] values) public whenDropIsActive onlyOwner {
    uint256 i = 0;
    while (i < dests.length) {
        uint256 toSend = values[i]*10**18; 	//    "* 10**18" was here on this line, changed it to 10^0 because ETECHToken has 0 decimals??? Idk.
        sendInternally(dests[i] , toSend, values[i]);
        i++;
    }
  }
//
//
//
//


// this function can be used when you want to send same number of tokens to all the recipients
  function sendTokensSingleValue(address[] dests, uint256 value) whenDropIsActive onlyOwner public {
    uint256 i = 0;
    uint256 toSend = value;
    while (i < dests.length) {
        sendInternally(dests[i] , toSend, value);
        i++;
    }
  }  

  function sendInternally(address recipient, uint256 tokensToSend, uint256 valueToPresent) internal {
    if(recipient == address(0)) return;

    if(tokensAvailable() >= tokensToSend) {
      token.transfer(recipient, tokensToSend);
      emit TransferredToken(recipient, valueToPresent);
    } else {
      emit FailedTransfer(recipient, valueToPresent); 
    }
  }   


  function tokensAvailable() public constant returns (uint256) {
    return token.balanceOf(this);
  }

  function destroy() onlyOwner public{
    uint256 balance = tokensAvailable() *10**18;
    require (balance > 0);
    token.transfer(owner, balance);
    selfdestruct(owner);
  }

}