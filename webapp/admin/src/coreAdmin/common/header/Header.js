import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './Header.css';
import Rightsidebar from '../rightSidebar/Rightsidebar.js';

export default class Header extends Component{
  
  constructor(props) {
   super(props);
    this.state = {

    }
  }
   
  componentDidMount(){}
    
  
openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

closeNav() {
  document.getElementById("mySidenav").style.width = "0";

}

  render(){
    return(
    <div>
            <header className="pageHeader">
              <div className="">
                <div className="col-lg-6 col-md-4 col-sm-4 col-xs-4 ">
                  <div className="">
                    <div id="sidebarCollapse" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 hover ">
                    <i className="fa fa-bars headicon"></i>
                  </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 ">
                  <div className="row">
                    <div onClick={this.openNav.bind(this)}className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right hover">
                    <i className="fa fa-cogs headicon "></i>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 pull-right hover">
                    <div className="row">
                      <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 ">
                      <img src="image/person.png" className="img "/>
                    </div>
                    <div className="col-lg-10 col-md-10 col-xs-6 col-sm-6 ">
                    <div className="headicon">Alexander Pierce</div>
                    </div>
                  </div>
                  </div>
                
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right hover">
                    <i className="fa fa-bell  headicon "><span className="label label-warning labelhead ">10</span></i>
                  </div>
                 

                </div>
                
                
              </div>
            </div>
            </header>

          <div id="mySidenav" className="sidenav">
          <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav.bind(this)} >&times;</a>
         <Rightsidebar/>
        </div>
      </div>
    );
  }
}
