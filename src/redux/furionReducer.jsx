import { UPDATE_FURION } from "./furionAction";

const initialState = {
    fUSD: '',
    liquidity_pool: '',
}

const furionReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_FURION:
            let new_value = action.payload;
            // console.log('Initializ Furion modules', new_value)
            return {
                ...state,
                fUSD: new_value.fUSD,
                liquidity_pool: new_value.liquidity_pool,
            };
        default:
            return state;
    }
}

export default furionReducer;