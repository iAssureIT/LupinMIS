import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LayoutSystemSecurity from './coreAdmin/LayoutSystemSecurity/LayoutSystemSecurity.js';
import Layout from './coreAdmin/Layout/Layout.js';
import './lib/router.js';
import axios from 'axios';
import $ from 'jquery';


console.log("process.env.REACT_APP_BASE_URL = ",process.env.REACT_APP_BASE_URL);

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
