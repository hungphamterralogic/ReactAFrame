
import React from 'react';
import ReactDOM from 'react-dom';
import Screen360 from './components/screen360';

import input from './input/demo.json';

const App = () => <Screen360 metadata={input} />;

ReactDOM.render(<App />, document.querySelector('#sceneContainer'));
