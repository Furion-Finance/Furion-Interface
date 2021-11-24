const CyberKongz = artifacts.require("CyberKongz");
const FUSD = artifacts.require("FUSD.sol");
const LocalOracle = artifacts.require("LocalOracle.sol");
const FurionPool = artifacts.require("FurionPool.sol");

const nft_to_mint = [
    "https://lh3.googleusercontent.com/XQ90DgHBCz3nGXzHzzS2I6__WoqbxiqMwVozbktYCcZdvvPN-nx46Td8CfbMCn_JfaPv-DF-bwPcwMmnvpoOiiVKYyG2b6lHIKTzaw",
    "https://lh3.googleusercontent.com/CfcmaNI3PDzokD4Jp5_yQUnwBOp0HAlWy8VhZzyclkAnDR8UWMTlD2_W0OMFOr6y1z2Hx7OmOK7WfKIqPZu9aNYt3sbTm4JNDSL-cbM",
    "https://lh3.googleusercontent.com/XvqPK98HCu4gNEt2_D3_olDImiCMZMvpfXA4SOBRQ4sa6640Q4fEJH_PveskXSukrYNB556krcUYjPBw3DcwAvzMbj-ZWZo1JBCX",
    "https://lh3.googleusercontent.com/6czQl54_waAdSCM5Ct4bqWdnX1BzTCX9a43BwCFItbXuri_F6t4f1BudIJezRsqKnjhT-0cHQxpwAKpLP85ZBmcD3Eat5XsNbUQHoA",
    "https://lh3.googleusercontent.com/ZNuRxj7eFsNH8WYY1VLAJ8xUwBjOmicCS-4HYY_GRy_lhVeqwu9l1eEj2ICtggd12P3CocKWAj5gT1D_5TjoUikWTkTSXoUinBqnFA",
    "https://lh3.googleusercontent.com/JAtYLJOVUU2J9kkt2zUzH0eq1A5huFTXYkRwL0ZUvBtA2a9zMrVfPfpHbbptIcwCZmP0VlPnSVOPC9QFKiceoF8agvWkIUbMMLgwuE4",
    "https://lh3.googleusercontent.com/hyITn5O0_R0ppX_0KHr-dkJMy0U4_hPsia4YwWV3sICxzS7UDnoCvclzzPSyh2phaoleML84xuorAnZaM9iy4WnIATL0swWcC2Ne"
];
const price_list = [224, 220, 220, 215, 240, 220, 215];

// we are going to mint seven different cyberkongz for current account at deployment
module.exports = async function(deployer, network, accounts){

    // firstlt we deploy the CyberKongz contract
    await deployer.deploy(CyberKongz);
    const cyberKongz = await CyberKongz.deployed();

    let index, temp_json;
    for(index=0; index<nft_to_mint.length; index++){
        temp_json = {"image_url": nft_to_mint[index]};
        await cyberKongz.awardItem(accounts[0], JSON.stringify(temp_json))
    }

    // then deploy the token contract
    await deployer.deploy(FUSD);
    const myFUSD = await FUSD.deployed();

    await deployer.deploy(LocalOracle);
    const localOracle = await LocalOracle.deployed();

    // entitle price to several NFT product
    for(index=0; index<price_list.length; index++){
        await localOracle.setPrice(cyberKongz.address, (index + 1), price_list[index] * 10 ** 10);
    }
    
    // finally deploy the liquidity pool
    // 1% stake fee rate, 3% lock fee rate
    await deployer.deploy(FurionPool, myFUSD.address, 1000000, 3000000, 1);
    const myFurionPool = await FurionPool.deployed();
    await myFurionPool.linkOracle(localOracle.address);
    myFUSD.nominateManager(myFurionPool.address);
}