import React    from 'react';
import axios    from 'axios';
import $        from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import './coreAdmin/css/root.css'
import './App.css';
import Layout   from './coreAdmin/Layout/Layout.js';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL; 
// axios.defaults.baseURL  = "http://localhost:3050"
// axios.defaults.baseURL  = "http://api.lupinfoundation.in"
axios.defaults.headers.post['Content-Type'] = 'application/json';
console.log("process.env.REACT_APP_BASE_URL = ", axios.defaults.baseURL);

function App() {
    return (
	    <div>
	      <Layout />
	    </div> 
    );
}

export default App;