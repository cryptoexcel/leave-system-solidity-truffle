var LeaveSystem = artifacts.require("./LeaveSystem.sol");

module.exports = function(deployer) {
  deployer.deploy(LeaveSystem);
};
