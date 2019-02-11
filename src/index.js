/* global document */
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './rootReducer';

import Firebase from './components/firebase';
import App from './components/app';
import './styles.css';

const initialAppReducer = {
  firebase: new Firebase(),
  authUser: null
};

const store = createStore(rootReducer, { app: initialAppReducer });

const app = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.querySelector('#sceneContainer'));
