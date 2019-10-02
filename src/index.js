import React from 'react';
import ReactDOM from 'react-dom';
import Race from './Race';
import Logo from './assets/logo.png'
import './index.css'


ReactDOM.render(
(<div>
  <div className="header">
  <img src={Logo} alt="AODocs" height="60"/>
  <h1>OUTBOUND SALES BLITZ</h1>
  </div>
  <Race /></div>), document.getElementById("root"));
