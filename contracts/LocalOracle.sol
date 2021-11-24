// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LocalOracle{
    
    address public owner;

    mapping(address => mapping(uint256 => uint256)) public NFTPrice;

    event UpdatePrice(address _nftAddress, uint256 _tokenId, uint256 _newPrice);

    constructor(){
        owner = msg.sender;
    }

    /* 
     * owner can call this function to set price, need to * 10 ** 10 when transfer to the contract
    */
    function setPrice(address _nftAddress, uint256 _tokenId, uint256 _price) external{
        require(msg.sender == owner, 'only owner can set price');
        require(_price > 0, 'price need to be positive');
        NFTPrice[_nftAddress][_tokenId] = _price;
        emit UpdatePrice(_nftAddress, _tokenId, _price);
    }

    function viewPrice(address _nftAddress, uint256 _tokenId) view external returns (uint256){
        return NFTPrice[_nftAddress][_tokenId];
    }
}

