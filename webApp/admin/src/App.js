import React from 'react';
import LayoutSystemSecurity from './coreAdmin/LayoutSystemSecurity/LayoutSystemSecurity.js';
import Layout from './coreAdmin/Layout/Layout.js';
import axios from 'axios';
import $ from 'jquery';
import './lib/router.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './coreAdmin/css/root.css'

// console.log("process.env.REACT_APP_BASE_URL = ",process.env.REACT_APP_BASE_URL);
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
 
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
