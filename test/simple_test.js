let cyberKongz = await CyberKongz.deployed();
let myFUSD = await FUSD.deployed();

let myOracle = await LocalOracle.deployed();
let myPool = await FurionPool.deployed(myFUSD.address, 1000000, 3000000, 1);

cyberKongz.setApprovalForAll(myPool.address, true);
let a = await myPool.stakeNFT(cyberKongz.address, 2);
a = await myPool.stakeNFT(cyberKongz.address, 1);
let b = await myPool.lockNFT(cyberKongz.address, 3);
var c = await myPool.stakingNFT(cyberKongz.address, 0);

let p = await myOracle.viewPrice(cyberKongz.address, 2);

a = await myPool.stakeNFT(cyberKongz.address, 1);
a = myPool.unstakeNFT(punk1.address, 1)
console.log(a)

myPool.lockNFT(punk1.address, 2, 10)
myNFTF.balanceOf(myPool.address);