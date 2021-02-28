  
pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ShambitToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("ShambitToken", "SBT") {
        _mint(msg.sender, initialSupply);
    }
}