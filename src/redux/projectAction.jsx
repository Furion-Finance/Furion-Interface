/**
 * things to do when initializing NFT project or switching
 * update nft basic information, then summarize pool information, account information and locking information
 */
import CyberKongz from "../contracts/CyberKongz.json";
import Web3 from "web3";

export const UPDATE_NFT_PROJECT = 'UPDATE_NFT_PROJECT';
export const UPDATE_NFT_PROJECT_NAME = 'UPDATE_NFT_PROJECT_NAME';
export const UPDATE_NFT_BALANCE = 'UPDATE_NFT_BALANCE';

export const UPDATE_POOL_COLLECTIONS = 'UPDATE_POOL_COLLECTIONS';
export const UPDATE_ACCOUNT_COLLECTIONS = 'UPDATE_ACCOUNT_COLLECTIONS';

export const update_nft_project = (nft_project) => ({
    type: UPDATE_NFT_PROJECT,
    payload: nft_project
});

export const update_nft_project_name = (nft_project_name) => ({
    type: UPDATE_NFT_PROJECT_NAME,
    payload: nft_project_name
});

export const update_nft_balance = (nft_balance) => ({
    type: UPDATE_NFT_BALANCE,
    payload: nft_balance
});

export const update_pool_collections = (pool_collections) => ({
    type: UPDATE_POOL_COLLECTIONS,
    payload: pool_collections
});

export const update_account_collections = (account_collections) => ({
    type: UPDATE_ACCOUNT_COLLECTIONS,
    payload: account_collections
})

export const initialize_project = (furion_pool) => {
    return (dispatch) => {
        const web3 = new Web3(window.web3.currentProvider);
        const networkId = 5777;
        const cyberKongzData = CyberKongz.networks[networkId];
        if (cyberKongzData) {
            // if such NFT does exist, then realize it into instance and then initilize all variables
            const myKongz = new web3.eth.Contract(CyberKongz.abi, cyberKongzData.address);
            dispatch(update_nft_project(myKongz)); // update NFT project
            // dispatch(get_pool_nft(furion_pool, myKongz._address)); // update NFT information in pool
            (myKongz.methods.name().call()).then((res) => {
                dispatch(update_nft_project_name(res));
            });
            (web3.eth.getAccounts()).then((accounts) => {
                // update account NFT balance and specific NFT token ids
                (myKongz.methods.balanceOf(accounts[0]).call()).then(async (balance) => {
                    dispatch(update_nft_balance(balance)); // update balance
                    dispatch(get_pool_collections(furion_pool, myKongz, accounts[0]));
                    // dispatch(get_account_nft(myKongz, accounts[0], balance)); // update account NFT
                });

                // dispatch(get_lock_nft(furion_pool, accounts[0], myKongz._address)); // update lock NFT
            });
        }
    }
}

/**
 * get NFT holding in account, locked not included inside
 * @param {*} nft_project nft contract
 * @param {*} account account to query
 * @param {*} balance total balance of current account
 * @returns list consisting of token ids hoding in hand, directly
 */
export const get_account_nft = async (nft_project, account) => {
    let account_nft = [];
    let temp_token_id = 0;
    let temp_owner;
    let balance = await nft_project.methods.balanceOf(account).call();
    // balance = min(balance, 8);
    while (account_nft.length < balance) {
        try {
            temp_owner = await nft_project.methods.ownerOf(temp_token_id).call();
            // console.log('Processing ', temp_token_id, ', owner is ', temp_owner);
            if (temp_owner === account) {
                account_nft.push(temp_token_id)
            }
            temp_token_id++;
        } catch (e) {
            console.log('Processing ', temp_token_id, ', no existing');
            temp_token_id++;
        }

    }
    return account_nft;
}

/**
 * get pool collections based on furion pool, NFT project, and current account
 * @param {*} furion_pool furion pool to query
 * @param {*} nft_project nft project to query
 * @param {*} account current account
 * @returns pool collections
 */
export const get_pool_collections = (furion_pool, nft_project, account) => {
    return async (dispatch) => {
        const nft_project_name = await nft_project.methods.name().call();
        const nft_project_address = nft_project._address;

        const stakingNFT = await furion_pool.methods.viewStakingNFT(nft_project._address).call();
        const lockingNFT = await furion_pool.methods.viewLockingNFT(account, nft_project._address).call();
        const pool_nft = oddRecords(stakingNFT).sort();
        const lock_nft = oddRecords(lockingNFT).sort();

        let nft_collections = [];
        let temp_index, single_uri, single_record;
        // firstly load lock NFT into collections
        for (temp_index = 0; temp_index < lock_nft.length; temp_index++) {
            single_uri = await nft_project.methods.tokenURI(lock_nft[temp_index]).call();
            single_record = {
                'nft_project_name': nft_project_name,
                'nft_project_address': nft_project_address,
                'token_id': lock_nft[temp_index],
                'locked': true,
                'uri': single_uri
            }
            nft_collections.push(single_record);
        }

        // then pool information into collections
        for (temp_index = 0; temp_index < pool_nft.length; temp_index++) {
            single_uri = await nft_project.methods.tokenURI(pool_nft[temp_index]).call();
            single_record = {
                'nft_project_name': nft_project_name,
                'nft_project_address': nft_project_address,
                'token_id': pool_nft[temp_index],
                'locked': false,
                'uri': single_uri
            }
            nft_collections.push(single_record);
        }
        // console.log("Loading pool collections", nft_collections);
        dispatch(update_pool_collections(nft_collections));
    }
}

/**
 * get pool collections based on furion pool, NFT project, and current account
 * @param {*} furion_pool furion pool to query
 * @param {*} nft_project nft project to query
 * @param {*} account current account
 * @returns pool collections
 */
export const get_account_collections = (furion_pool, nft_project, account) => {
    return async (dispatch) => {
        const nft_project_name = await nft_project.methods.name().call();
        const nft_project_address = nft_project._address;

        const holdingNFT = await get_account_nft(nft_project, account);
        const lockingNFT = await furion_pool.methods.viewLockingNFT(account, nft_project._address).call();
        const account_nft = holdingNFT.sort();
        const lock_nft = oddRecords(lockingNFT).sort();

        let nft_collections = [];
        let temp_index, single_uri, single_record;
        // firstly load lock NFT into collections
        for (temp_index = 0; temp_index < lock_nft.length; temp_index++) {
            single_uri = await nft_project.methods.tokenURI(lock_nft[temp_index]).call();
            single_record = {
                'nft_project_name': nft_project_name,
                'nft_project_address': nft_project_address,
                'token_id': lock_nft[temp_index],
                'locked': true,
                'uri': single_uri
            }
            nft_collections.push(single_record);
        }

        // then holding information into collections
        for (temp_index = 0; temp_index < account_nft.length; temp_index++) {
            single_uri = await nft_project.methods.tokenURI(account_nft[temp_index]).call();
            single_record = {
                'nft_project_name': nft_project_name,
                'nft_project_address': nft_project_address,
                'token_id': account_nft[temp_index],
                'locked': false,
                'uri': single_uri
            }
            nft_collections.push(single_record);
        }
        // console.log("Loading account collections", nft_collections);
        dispatch(update_account_collections(nft_collections));
    }
}

/**
   * filter out records which appear in odd times
   * @param {*} total_records total records
   * @returns records who exist in odd times
   */
export const oddRecords = function (total_records) {
    let result = [];
    const map = new Map();
    // record num of appearance
    for (let record of total_records) {
        if (map.has(record)) {
            map.set(record, map.get(record) + 1);
        } else {
            map.set(record, 1);
        }
    }
    for (let [_, value] of map.entries()) {
        if (value % 2 === 1) result.push(_);
    }
    return result
};