import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LayoutSystemSecurity from './coreAdmin/LayoutSystemSecurity/LayoutSystemSecurity.js';
import Layout from './coreAdmin/Layout/Layout.js';
import './lib/router.js';
import axios from 'axios';
import $ from 'jquery';

axios.defaults.baseURL = "http://qalmisapi.iassureit.com/";
axios.defaults.headers.post['Content-Type'] = 'application/json';



function App() {
  return (
    <div>
      <Layout />
      {/*<LayoutSystemSecurity />*/}
    </div>
    
    );  
}
  
export default App;
