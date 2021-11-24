// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract FUSD is ERC20, ERC20Burnable{
    address owner;
    mapping(address => bool) Managers; // Only managers can mint and burn NFTF tokens

    constructor() ERC20("NFT Fraction", "NFTF"){
        owner = msg.sender;
    }

    function changeOwner(address _newOwner) public{
        require(msg.sender == owner);
        owner = _newOwner;
    }

    // Only owner can nominate and remove manager right, the right to mint & burn
    function nominateManager(address _account) public{
        require(msg.sender == owner);
        Managers[_account] = true;
    }

    function removeManager(address _account) public{
        require(msg.sender == owner);
        Managers[_account] = false;
    }

    // only managers can mint & burn tokens
    function mint(address _to, uint256 _amount) public{
        require(Managers[msg.sender], "Only manager can mint");
        _mint(_to, _amount);
    }

    function burnFrom(address _from, uint256 _amount) override public{
        require(Managers[msg.sender] || msg.sender == _from, "Only managers and oneself can burn NFTF tokens");
        _burn(_from, _amount);
    }
}