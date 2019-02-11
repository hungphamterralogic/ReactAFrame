import { combineReducers } from 'redux';
import app from './reducers/appReducer';

const namedReducers = { app };

const rootReducer = combineReducers(namedReducers);

export default rootReducer;
