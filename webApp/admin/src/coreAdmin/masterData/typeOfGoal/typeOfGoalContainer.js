import React, { Component } from 'react';
import $                    from 'jquery';
import TypeOfGoal           from "./typeOfGoal/typeOfGoal.js";
import NameOfGoal           from "./nameOfGoal/nameOfGoal.js";
import _                    from 'underscore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/tab.js';

class typeOfGoalContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
      "tabtype" : "typeOfGoal" ,
      "shown"       : true,
    }
    this.changeTab = this.changeTab.bind(this); 

  }
  componentDidMount(){
    var editId = this.props.match.params;
    // console.log('editId', editId);
    // this.setState({
    //   tabtype : editId.subactivityId ? 'subactivity' : (editId.activityId ? "activity" : "sector" )
    // },()=>{
    //   console.log(' tabtype ======================', this.state.tabtype, _.has(editId , 'sectorId', 'activityId', "subactivityId"));
    // });
  }
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  toglehidden(){
    this.setState({
     shown: !this.state.shown
    });
  }
  changeTab = (data)=>{
    this.setState({
      tabtype : data,
    },()=>{
      this.props.history.push('/type-goal');
    });
  }
  render() {
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }

    return (
      <div className="container-fluid"> 
        <div className="row">
          <div className="formWrapper">
             <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                        Master Data                                
                      </div>
                      <hr className="hr-head container-fluid row"/>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="row">
                        <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <h4 className="pageSubHeader add15">Create Goal</h4>
                        </div>
                        {/*<div className=" col-lg-3 col-lg-offset-3 col-md-6 col-sm-6 col-xs-6">
                          <div className="can-toggleSA genderbtn demo-rebrand-2 marginL21 ">
                            <input id="SA" type="checkbox"/>
                            <label className="formLable" htmlFor="SA">
                            <div className="can-toggleSA__switch" data-checked="Auto"  data-unchecked="Manual" onClick={this.toglehidden.bind(this)} ></div>
                              <div className="can-toggleSA__label-text"></div>
                            </label>
                          </div>                      
                        </div>*/}
                      </div>
                    </div>
                    
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={shown} >                            
                    <div className="row">
                      <div className="nav-center manageLocationTabs col-lg-12 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 marginTop30">
                         <ul className="nav nav-tabs nav-pills locNavTab">
                              
                              <li className=" active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab dis">
                                  <a href="#typeOfGoal" data-toggle="tab"  onClick={()=>this.changeTab('typeOfGoal')} >
                                    Goal Type
                                  </a>
                              </li>
                               <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab st">
                                  <a href="#nameOfGoal" data-toggle="tab"      onClick={()=>this.changeTab('nameOfGoal')} >
                                    Goal Name
                                  </a>
                              </li>
                              
                         </ul>
                      </div>
                      <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                        <div className="tab-pane active" id="typeOfGoal">
                        {

                          this.state.tabtype === "typeOfGoal" ?
                          <div className="row"><TypeOfGoal dataval={this.state.tabtype} /></div>       
                          :
                          null
                        } 
                        </div>
                        <div className="tab-pane" id="nameOfGoal">
                        {
                          this.state.tabtype === "nameOfGoal" ?
                          <div className="row"><NameOfGoal dataval={this.state.tabtype} /></div>        
                          :
                          null
                        }
                        </div>
                      
                      </div>
                    </div>
                  </div>
                
                  
                </div>
              </div>
            </section>
           
          </div>
        </div>
      </div>
    );

  }

}
export default typeOfGoalContainer