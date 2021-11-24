import FUSD from "../contracts/FUSD.json";
import FurionPool from "../contracts/FurionPool.json";
import Web3 from "web3";

export const UPDATE_FURION = 'UPDATE_FURION';

export const initialize_furion = () => {
    let result = {
        fUSD: '',
        liquidity_pool: '',
    }
    const web3 = new Web3(window.web3.currentProvider);
    // this declaration does not work now since the netword IDs can not dismatch
    // const networkId = await web3.eth.net.getID();
    const networkId = 5777;

    const fUSDData = FUSD.networks[networkId];
    if (fUSDData) {
        const fUSD = new web3.eth.Contract(FUSD.abi, fUSDData.address);
        result.fUSD = fUSD;
    }

    const furionPoolData = FurionPool.networks[networkId];
    if (furionPoolData) {
        const liquidity_pool = new web3.eth.Contract(FurionPool.abi, furionPoolData.address);
        result.liquidity_pool = liquidity_pool;
    }
    return ({
        type: UPDATE_FURION,
        payload: result
    })
}
