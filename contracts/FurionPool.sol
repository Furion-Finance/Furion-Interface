//SPDX-License-Identifier: MI

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./FUSD.sol";
import "./LocalOracle.sol";

// !!Q?
// how to submit the requestPrice without involving PriceOracle.sol in
// Answer: store price inside the oracle, every time when need a price, just read it from oracle contract

/** V1

 *  all transactions are transfered to the contract itself, and the owner can distribute through <allocate>
 * locking period can is set to be 3e6 blocks(about 40 days), every block would be extraly charged at
 * min(lock price, unlock price) * 1e(-8), and would be charged at unlocking
 * inside which only the locker himself can redeem this NFT
 * after that the lcoked NFT would be released into public pool
 * 
 * all data is discounted at 10 ** baseDecimal, e.g. feeRate multiply with 10 * baseDecimal render the actual result

 * Current questions
 * one can not sign <approve> inside the contract

*/
contract FurionPool is IERC721Receiver{
    string public name =  "NFT Liquidity Pool";
    uint8 baseDecimal = 8;
    address public owner;
    LocalOracle public oracle;

    FUSD public fUSD; // fUSD token
    uint public stakeFeeRate; // stake fee rate, charged at staking time, real rate * 10 ** 8 as result
    uint public lockFeeRate; // lock fee rate, charged at locking time, real rate * 10 ** 8 as result
    uint public lockBlockCharge; // lock block fee, charged for every locked block, real rate * 10 ** 8 as result

    mapping(bytes32 => bool) public StakedInPool; // whether a NFT staked in pool
    mapping(bytes32 => bool) public LockedInPool; // whether a NFT locked in pool
    mapping(bytes32 => uint) public LockedBlockNumber; // when the NFT is locked in pool
    mapping(bytes32 => address) public Locker; // locker of the locked NFT

    /**
     * locked NFT in pool. user => NFT address => token id collection
     * if one token id appears in odd numbers, then it is locked, otherwise it is not locked.
     * under this settings, we will not have to remove one token id when it is unlocked from pool
     */
    mapping(address => mapping(address => uint256[])) public lockingNFT;

    /**
     * staked NFT in pool. NFT address => token id collection
     * also if one token id appears in odd number, then it is indeed staked in pool
     */
    mapping(address => uint256[]) public stakingNFT;

    event LinkOracle(LocalOracle oracle);
    event StakeNFT(address indexed _from, address _nftAddress, uint256 _tokenId, uint _value);
    event LockNFT(address indexed _from, address _nftAddress, uint256 _tokenId, uint _value);
    event ReleaseNFT(address indexed _locker, address _nftAddress, uint256 _tokenId);
    event WithdrawNFT(address indexed _to, address _nftAddress, uint256 _tokenId, uint _value);

    constructor(FUSD _fUSD, uint _stakeFeeRate, uint _lockFeeRate, uint _lockBlockCharge){
        owner = msg.sender;
        fUSD = _fUSD;
        stakeFeeRate = _stakeFeeRate;
        lockFeeRate = _lockFeeRate;
        lockBlockCharge = _lockBlockCharge;
    }

    function linkOracle(LocalOracle _oracle) public{
        require(msg.sender == owner, 'only owner can nominate oracle');
        oracle = _oracle;
        emit LinkOracle(_oracle);
    }

    function stakeNFT(address _nftAddress, uint256 _tokenId) public{
        // first try to transfer NFT to pool
        address sender = msg.sender;
        IERC721 nftContract =  IERC721(_nftAddress);
        // require(nftContract.ownerOf() == sender, "only NFT owner can stake");

        // msg.sender approve and then transfer such NFT to pool
        // nftContract.approve(address(this), _tokenId); // seems impossible to implement
        nftContract.safeTransferFrom(msg.sender, address(this), _tokenId);

        bytes32 fixedNFT = keccak256(abi.encodePacked(_nftAddress, _tokenId));
        StakedInPool[fixedNFT] = true;

        uint256 nftPrice = oracle.NFTPrice(_nftAddress, _tokenId);
        require(nftPrice > 0, 'the price need to be positive');

        // push this token id into pool's collection
        stakingNFT[_nftAddress].push(_tokenId);

        // calculate stakeFee based on stakeFeeRate, then mintValue to msg.sender, stakeFee to owner
        uint stakeFee = nftPrice * stakeFeeRate;
        uint mintValue = nftPrice * (10 ** baseDecimal - stakeFeeRate);
        fUSD.mint(sender, mintValue);
        fUSD.mint(address(this), stakeFee);
        emit StakeNFT(sender, _nftAddress, _tokenId, mintValue);
    }

    function unstakeNFT(address _nftAddress, uint256 _tokenId) public{
        // unstake NFT from pool. receiver, nFTAddress, tokenID required
        bytes32 fixedNFT = keccak256(abi.encodePacked(_nftAddress, _tokenId));
        require(StakedInPool[fixedNFT], "the NFT is not staked in pool");

        uint256 nftPrice = oracle.NFTPrice(_nftAddress, _tokenId);
        require(nftPrice > 0, 'the price need to be positive');
        uint256 burnValue = nftPrice * 10 ** baseDecimal;

        // burn fUSD token and transfer fixedNFT to recepient
        fUSD.burnFrom(msg.sender, burnValue);
        IERC721 nftContract = IERC721(_nftAddress);
        nftContract.safeTransferFrom(address(this), msg.sender, _tokenId);

        // push this token id into pool's collection, it turns from odd to even
        stakingNFT[_nftAddress].push(_tokenId);

        // update state variables in contract
        StakedInPool[fixedNFT] = false;
        emit WithdrawNFT(msg.sender, _nftAddress, _tokenId, burnValue);
    }

    function lockNFT(address _nftAddress, uint256 _tokenId) public{
        IERC721 nftContract =  IERC721(_nftAddress);

        // msg.sender approve and then transfer such NFT to pool
        // nftContract.approve(address(this), _tokenId);
        nftContract.safeTransferFrom(msg.sender, address(this), _tokenId);

        // store the locked NFT into pool collection
        bytes32 lockedNFT = keccak256(abi.encodePacked(_nftAddress, _tokenId));
        LockedInPool[lockedNFT] = true;
        Locker[lockedNFT] = msg.sender;
        LockedBlockNumber[lockedNFT] = block.number;

        // store this token id into lockedNFT
        lockingNFT[msg.sender][_nftAddress].push(_tokenId);

        // lock fee to owner, and mintValue to msg.sender
        uint256 nftPrice = oracle.NFTPrice(_nftAddress, _tokenId);
        require(nftPrice > 0, 'the price need to be positive');
        uint lockFee = nftPrice * lockFeeRate;
        // balanceOfMargin[msg.sender] = margin;
        uint mintValue = nftPrice * (10 ** baseDecimal - lockFeeRate);
        fUSD.mint(address(this), lockFee);
        fUSD.mint(msg.sender, mintValue);
        emit LockNFT(msg.sender, _nftAddress, _tokenId, mintValue);
    }

    function unlockNFT(address _nftAddress, uint256 _tokenId) public{
        bytes32 fixedNFT = keccak256(abi.encodePacked(_nftAddress, _tokenId));
        require(LockedInPool[fixedNFT], "the NFT is not locked in pool");
        require(Locker[fixedNFT] == msg.sender, "only locker himself can unlock this NFT");

        uint256 nftPrice = oracle.NFTPrice(_nftAddress, _tokenId);
        require(nftPrice > 0, 'the price need to be positive');

        uint lockFee = (block.number - LockedBlockNumber[fixedNFT]) * lockBlockCharge * nftPrice;
        uint burnValue = lockFee + nftPrice * 10 ** baseDecimal;
        // burn fUSD token and transfer fixedNFT to recepient
        fUSD.burnFrom(msg.sender, burnValue);
        IERC721 nftContract = IERC721(_nftAddress);
        nftContract.safeTransferFrom(address(this), msg.sender, _tokenId);

        // store this token id into lockedNFT
        lockingNFT[msg.sender][_nftAddress].push(_tokenId);

        // update state variables in contract
        LockedInPool[fixedNFT] = false;
        emit WithdrawNFT(msg.sender, _nftAddress, _tokenId, burnValue);
    }

    function releaseNFT(address _nftAddress, uint256 _tokenId) public{
        // owner can release locked NFT into staking pool after 1e6 blocks
        require(msg.sender == owner, "only contract owner can release locked NFT");
        bytes32 fixedNFT = keccak256(abi.encodePacked(_nftAddress, _tokenId));
        require(LockedInPool[fixedNFT], "the NFT is not locked in pool");
        require(block.number - LockedBlockNumber[fixedNFT] >= 3 * 10 ** 6, "the lock is stiil valid");

        // change this NFT from being locked to being staked
        LockedInPool[fixedNFT] = false;
        StakedInPool[fixedNFT] = true;
        
        // store this token id into lockedNFT
        lockingNFT[msg.sender][_nftAddress].push(_tokenId);
        stakingNFT[_nftAddress].push(_tokenId);

        emit ReleaseNFT(Locker[fixedNFT], _nftAddress, _tokenId);
    }

    function allocate(address _to, uint256 _amount) public{
        require(msg.sender == owner, "only owner can allocate income tokens");
        fUSD.transfer(_to, _amount);
    }

    function changeStakeFeeRate(uint256 _stakeFeeRate) public{
        require(msg.sender == owner, "only contract owner can change fee rate");
        stakeFeeRate = _stakeFeeRate;
    }

    function changeLockDailyCharge(uint256 _lockFeeRate) public{
        require(msg.sender == owner, "only contract owner can change fee rate");
        lockFeeRate = _lockFeeRate;
    }

    function changeLockFeeRate(uint256 _lockBlockCharge) public{
        require(msg.sender == owner, "only contract owner can change fee rate");
        lockBlockCharge = _lockBlockCharge;
    }

    function changeOwner(address _newOwner) public{
        require(msg.sender == owner, "only contract owner can change ownership");
        owner = _newOwner;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function viewStakingNFT(address _nftAddress) external view returns (uint256[] memory) {
        return stakingNFT[_nftAddress];
    }

    function viewLockingNFT(address _userAddress, address _nftAddress) external view returns (uint256[] memory) {
        return lockingNFT[_userAddress][_nftAddress];
    }
}