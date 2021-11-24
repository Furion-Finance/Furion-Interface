import { UPDATE_NFT_PROJECT, UPDATE_NFT_PROJECT_NAME, UPDATE_NFT_BALANCE } from "./projectAction";
import { UPDATE_POOL_COLLECTIONS, UPDATE_ACCOUNT_COLLECTIONS } from "./projectAction";

const defaultView = [
    { "nft_project": "LOADING", "token_id": 0, "locked": false },
    { "nft_project": "LOADING", "token_id": 1, "locked": false },
    { "nft_project": "LOADING", "token_id": 2, "locked": false },
    { "nft_project": "LOADING", "token_id": 3, "locked": false },
    { "nft_project": "LOADING", "token_id": 4, "locked": false },
    { "nft_project": "LOADING", "token_id": 5, "locked": false },
    { "nft_project": "LOADING", "token_id": 6, "locked": false },
    { "nft_project": "LOADING", "token_id": 7, "locked": false },
];

const initialState = {
    nft_project: '',
    nft_project_name: '',
    nft_balance: 0,
    pool_collections: defaultView,
    account_collections: defaultView
}

const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_NFT_PROJECT:
            return {
                ...state,
                nft_project: action.payload
            };
        case UPDATE_NFT_PROJECT_NAME:
            return {
                ...state,
                nft_project_name: action.payload
            };
        case UPDATE_NFT_BALANCE:
            return {
                ...state,
                nft_balance: action.payload
            }
        case UPDATE_POOL_COLLECTIONS:
            return {
                ...state,
                pool_collections: action.payload
            }
        case UPDATE_ACCOUNT_COLLECTIONS:
            return {
                ...state,
                account_collections: action.payload
            }
        default:
            return state;
    }
}

export default projectReducer;