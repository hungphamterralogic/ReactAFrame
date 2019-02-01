
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './rootReducer';

import Firebase from './components/firebase';
import App from './components/app';
import './styles.css';
// import Screen360 from './components/screen360';

const initialAppReducer = {
  firebase: new Firebase(),
  authUser: null
}
const store = createStore(rootReducer, { 'app': initialAppReducer})

// import input from './input/demo.json';

// const App = () => <Screen360 metadata={input} />;

ReactDOM.render(<Provider store={store}><App /></Provider>, document.querySelector('#sceneContainer'));
