// utils/API.js

import axios from "axios";

export default axios.create({
  baseURL: "http://qalmisapi.iassureit.com/",
  responseType: "json"
  

});
