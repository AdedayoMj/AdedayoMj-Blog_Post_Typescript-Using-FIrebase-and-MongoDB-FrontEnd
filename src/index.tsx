import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/dots.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
import Application from './application';


ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <Application />
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
