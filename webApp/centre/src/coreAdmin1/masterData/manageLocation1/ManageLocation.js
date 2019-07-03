import React, { Component } from 'react';

// import {State}              from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';
/*import {State}              from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';
import {Countries}          from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/Countries.js';
import {District}           from '/imports/coreAdmin/masterData/manageLocation/components/District/component/District.js';
import {Location}           from '/imports/coreAdmin/masterData/manageLocation/components/location/component/Location.js';
import {Taluka}             from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/Taluka.js';

*/
import $ from 'jquery';
import AddCountries                     from "./component/country/AddCountries.js";
import AddDistrict                      from "./component/district/AddDistrict.js";
import AddLocations                     from "./component/location/AddLocations.js";
import AddState                         from "./component/state/AddState.js";
import AddTaluka                        from "./component/taluka/AddTaluka.js";

class ManageLocations extends Component{
  constructor(props){
    super(props)
    this.state = {
      tabtype : "location",
    }
    this.changeTab = this.changeTab.bind(this); 

  }
    componentDidMount() {
     //   $('.companyInformation').addClass('divActive');
      // if ( !$('body').hasClass('adminLte')) {
      //   var adminLte = document.Element("script");
      //   adminLte.type="text/javascript";
      //   adminLte.src = "/js/adminLte.js";
      //   $("body").append(adminLte);
      // }
      if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
          // console.log("I am appended!");
          var adminLte = document.createElement("script");
          adminLte.type = "text/javascript";
          adminLte.src = "/js/adminLte.js";
          adminLte.setAttribute('id','adminLte');
          $("body").append(adminLte);
      }
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
                                Manage Locations  
                              </div>
                              <hr className="hr-head container-fluid row"/>
                            </div>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                   <div className="reportWrapper">
                                      <div className="row">
                                          <div className="nav-center manageLocationTabs col-lg-10 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12">
                                             <ul className="nav nav-pills locNavTab">
                                                  <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab loc aTag">
                                                      <a href="#Location" className="fz12 " data-toggle="tab" onClick={()=>this.changeTab('location')} >
                                                        Location
                                                      </a>
                                                  </li>
                                                  <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab tal">
                                                      <a href="#Taluka" data-toggle="tab" onClick={()=>this.changeTab('Taluka')}>
                                                        Taluka
                                                      </a>
                                                  </li>
                                                  <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab dis">
                                                      <a href="#District" data-toggle="tab"   onClick={()=>this.changeTab('district')} >
                                                        District
                                                      </a>
                                                  </li>
                                                   <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab st">
                                                      <a href="#State" data-toggle="tab"      onClick={()=>this.changeTab('state')} >
                                                        State
                                                      </a>
                                                  </li>
                                                  <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab cntry">
                                                      <a  href="#Country" data-toggle="tab"   onClick={()=>this.changeTab('country')} >
                                                        Country
                                                      </a>
                                                  </li>
                                                  
                                             </ul>
                                          </div>
                                          <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="tab-pane active" id="Location">
                                              {
                                                this.state.tabtype == "location" ?
                                                <AddLocations dataVal={this.state.tabtype} />       
                                                :
                                                null
                                              }
                                            </div>
                                            <div className="tab-pane" id="Country">
                                              {
                                                this.state.tabtype == "country" ?
                                                <AddCountries dataVal={this.state.tabtype} />       
                                                :
                                                null
                                              }           
                                            </div>
                                                <div className="tab-pane" id="State">
                                                  {
                                                this.state.tabtype == "state" ?
                                                <AddState dataVal={this.state.tabtype} />       
                                                :
                                                null
                                              } 
                                            </div>
                                            <div className="tab-pane" id="District">
                                                  {
                                                this.state.tabtype == "district" ?
                                                <AddDistrict dataVal={this.state.tabtype} />        
                                                :
                                                null
                                              }
                                            </div>
                                            <div className="tab-pane" id="Taluka">
                                                  {
                                                this.state.tabtype == "Taluka" ?
                                                <AddTaluka dataVal={this.state.tabtype} />        
                                                :
                                                null
                                              }
                                            </div>
                                            <div className="tab-pane" id="MartialStatus">
                                                {/*  {
                                                this.state.tabtype == "MartialStatus" ?
                                                <AddMartialStatus dataVal={this.state.tabtype} />        
                                                :
                                                null
                                              }*/}
                                            </div>
                                            <div className="tab-pane" id="Languages">
                                                {/*  {
                                                this.state.tabtype == "Languages" ?
                                                <AddLanguages dataVal={this.state.tabtype} />        
                                                :
                                                null
                                              }*/}
                                            </div>
                                            <div className="tab-pane" id="Religion">
                                                  {/*{
                                                this.state.tabtype == "Religion" ?
                                                <AddReligion dataVal={this.state.tabtype} />        
                                                :
                                                null
                                              }*/}
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
export default ManageLocations