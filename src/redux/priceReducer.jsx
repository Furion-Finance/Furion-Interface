import { UPDATE_PRICE } from "./priceAction";

const initialState = {
    price: 0,
}

const priceReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRICE:
            return {
                ...state,
                price: action.payload,
            };
        default:
            return state;
    }
}

export default priceReducer;