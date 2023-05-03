// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Wallet {
    
    mapping (address => uint) wallet;

    function deposit() external payable {
        wallet[msg.sender] += msg.value;
    }

    function withdraw(address payable _to, uint amount) external {
        require(wallet[msg.sender] >= amount, "Insufficient funds");
        wallet[msg.sender] -= amount;
        _to.transfer(amount);
    }

    function getBalance() external view returns (uint) {
        return wallet[msg.sender];
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getWalletBalance(address _address) external view returns (uint) {
        return wallet[_address];
    }

}