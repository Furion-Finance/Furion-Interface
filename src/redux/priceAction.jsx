import LocalOracle from "../contracts/LocalOracle.json";
import Web3 from "web3";

export const UPDATE_PRICE = 'UPDATE_PRICE';

export const update_nft_price = (new_price) => ({
    type: UPDATE_PRICE,
    payload: new_price
});


export const get_price = (nft_project_address, token_id) => {
    return async (dispatch) => {
        const web3 = new Web3(window.web3.currentProvider);
        // this declaration does not work now since the netword IDs can not dismatch
        // const networkId = await web3.eth.net.getID();
        const networkId = 5777;
        const oracleData = LocalOracle.networks[networkId];
        if (oracleData) {
            const localData = new web3.eth.Contract(LocalOracle.abi, oracleData.address);
            try{
                const price = await localData.methods.viewPrice(nft_project_address, token_id).call();
                dispatch(update_nft_price((price / 10 ** 10).toFixed(2)));
            }catch(e){
                dispatch(update_nft_price(0.00));
            }
        } else{
            dispatch(update_nft_price(0.00));
        }
    }
}
