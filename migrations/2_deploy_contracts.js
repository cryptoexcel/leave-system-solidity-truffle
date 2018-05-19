var LeaveSystem = artifacts.require("./LeaveSystem.sol");
var AirDrop = artifacts.require("./AirDrop.sol");

module.exports = function(deployer) {
  deployer.deploy(LeaveSystem);
  deployer.deploy(AirDrop);
};
