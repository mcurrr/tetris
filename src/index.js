import React from 'react';
import ReactDOM from 'react-dom';
import { fillArray, emptyInitial } from './utils';

import App from './components/App/App';
import './index.css';

const filled = fillArray(emptyInitial);

ReactDOM.render(<App array={filled} />, document.getElementById('root'));
