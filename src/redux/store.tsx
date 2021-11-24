import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk';

export const store = compose(applyMiddleware(thunk))(createStore)(reducer);