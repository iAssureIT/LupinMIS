import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import './lib/router.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './coreAdmin/css/root.css'
import LayoutSystemSecurity from './coreAdmin/LayoutSystemSecurity/LayoutSystemSecurity.js';
import Layout from './coreAdmin/Layout/Layout.js';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// axios.defaults.baseURL  = "http://localhost:3054"
axios.defaults.headers.post['Content-Type'] = 'application/json';
console.log("process.env.REACT_APP_BASE_URL = ", axios.defaultfaults.baseURL);
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

function App() {
  return (
    <div>
      <Layout />
      {/*<LayoutSystemSecurity />*/} 	
    </div>
    
    );  
}
  
export default App;
