import React, { Component } from 'react';
import $ from 'jquery';
import Activity    from "./component/activity/Activity.js";
import Sector      from "./component/sector/Sector.js";
import SubActivity from "./component/subActivity/SubActivity.js";
import "./SectorAndActivity.css";

class SectorAndActivity extends Component{
  constructor(props){
    super(props)
    this.state = {
      tabtype : "sector",
    }
    this.changeTab = this.changeTab.bind(this); 

  }
    componentDidMount() {
     
    }

    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
    console.log("tabtype",this.state.tabtype);
  }


    render() {

    return (
       <div className="container-fluid">
       <div className="row">
          <div className="formWrapper">
               <section className="content">
                    <div className="">
                         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                                        Master Data                                
                                        </div>
                              <hr className="hr-head container-fluid row"/>
                            </div>
                            <div className="col-lg-12 ">
                              <h4 className="pageSubHeader add15">Create Sector & Activity Report</h4>
                          </div>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                   <div className="reportWrapper">
                                      <div className="row">
                                          <div className="nav-center manageLocationTabs col-lg-12 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
                                             <ul className="nav nav-pills locNavTab">
                                                  
                                                  <li className=" active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab dis">
                                                      <a href="#Sector" data-toggle="tab"  onClick={()=>this.changeTab('sector')} >
                                                        Sector
                                                      </a>
                                                  </li>
                                                   <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab st">
                                                      <a href="#Activity" data-toggle="tab"      onClick={()=>this.changeTab('activity')} >
                                                        Activity
                                                      </a>
                                                  </li>
                                                  <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab cntry">
                                                      <a  href="#SubActivity" data-toggle="tab"   onClick={()=>this.changeTab('subactivity')} >
                                                        Sub-Activity
                                                      </a>
                                                  </li>
                                                  
                                             </ul>
                                          </div>
                                          <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            
                                                <div className="tab-pane active" id="Sector">
                                                  {
                                                this.state.tabtype == "sector" ?
                                                <div className="row"><Sector dataVal={this.state.tabtype} /></div>       
                                                :
                                                null
                                              } 
                                            </div>
                                            <div className="tab-pane" id="Activity">
                                                  {
                                                this.state.tabtype == "activity" ?
                                                <div className="row"><Activity dataVal={this.state.tabtype} /></div>        
                                                :
                                                null
                                              }
                                            </div>
                                            <div className="tab-pane" id="SubActivity">
                                                  {
                                                this.state.tabtype == "subactivity" ?
                                                <div className="row"><SubActivity dataVal={this.state.tabtype} /></div>        
                                                :
                                                null
                                              }
                                            </div>
                                            
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
export default SectorAndActivity