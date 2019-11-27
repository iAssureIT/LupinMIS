import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';



import './Footer.css';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Footer extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
  componentDidMount(){
 
}

    
  render(){
    return(
      <footer  className="main-footer col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable ">
        <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerLeftCss"><b><span className="footerLeftCss">Copyright © 2019</span> <a href="/" className="footerLeftCss">LupinMIS</a></b><span className="footclr">&nbsp;&nbsp;All rights
            reserved.</span>
          </div>
        </div>
        <div className="col-lg-7 col-md-7 col-sm-7 col-xs-12">
          <p className="pull-right footerRightCss"><b>Version 1.0</b></p>
          <p className="footerRightCss1">Design & Developed by <a href="http://iassureit.com">iAssure International Technology Pvt Ltd</a>&nbsp;&nbsp;</p>
        </div>
      </footer>
    );
  }
}


/*Copyright © 2019Designed & Developed by iAssure International Technologies Pvt. Ltd. Version 1.0.0 reserved.*/