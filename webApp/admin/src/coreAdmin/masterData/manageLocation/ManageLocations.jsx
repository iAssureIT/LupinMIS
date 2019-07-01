import React, { Component } from 'react';
import { render }           from 'react-dom';
import {withTracker}        from 'meteor/react-meteor-data';

// import {State}              from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';
import {State}              from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';
import {Countries}          from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/Countries.js';
import {District}           from '/imports/coreAdmin/masterData/manageLocation/components/District/component/District.js';
import {Location}           from '/imports/coreAdmin/masterData/manageLocation/components/location/component/Location.js';
import {Taluka}             from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/Taluka.js';
import {MartialStatus}      from '/imports/coreAdmin/masterData/manageLocation/components/MartialStatus/component/MartialStatus.js';
import {Languages}          from '/imports/coreAdmin/masterData/manageLocation/components/Languages/component/Languages.js';
import {Religion}           from '/imports/coreAdmin/masterData/manageLocation/components/Religion/component/Religion.js';


import AddCountries         from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/AddCountries.jsx';
import AddDistrict          from '/imports/coreAdmin/masterData/manageLocation/components/District/component/AddDistrict.jsx';
import AddTaluka            from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/AddTaluka.jsx';
import AddState             from '/imports/coreAdmin/masterData/manageLocation/components/State/component/AddState.jsx';
import AddLocations         from '/imports/coreAdmin/masterData/manageLocation/components/location/component/AddLocations.jsx';
import AddMartialStatus     from '/imports/coreAdmin/masterData/manageLocation/components/MartialStatus/component/AddMartialStatus.jsx';
import AddLanguages         from '/imports/coreAdmin/masterData/manageLocation/components/Languages/component/AddLanguages.jsx';
import AddReligion          from '/imports/coreAdmin/masterData/manageLocation/components/Religion/component/AddReligion.jsx';

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
  }


    render() {

    return (
       <div>
          <div className="content-wrapper">
               <section className="content">
                    <div className="">
                         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 dashboardWrapper pageContent">
                              <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                   <div className="">
                                       <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg">
                                              Manage Locations  
                                            </div>

                                           
                                              
                                          </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                             <div className="reportWrapper">
                                                  <div className="nav-center manageLocationTabs col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
                                                       <ul className="nav nav-pills nav-pillss">
                                                            <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab loc">
                                                                <a href="#Location" data-toggle="tab" onClick={()=>this.changeTab('location')} >
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
                                                            <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab ">
                                                                <a  href="#MartialStatus" data-toggle="tab"   onClick={()=>this.changeTab('MartialStatus')} >
                                                                  Marital Status
                                                                </a>
                                                            </li>
                                                            <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab lng">
                                                                <a  href="#Languages" data-toggle="tab"   onClick={()=>this.changeTab('Languages')} >
                                                                  Languages
                                                                </a>
                                                            </li>
                                                            <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab rel">
                                                                <a  href="#Religion" data-toggle="tab" onClick={()=>this.changeTab('Religion')} >
                                                                  Religion
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
                                                            {
                                                          this.state.tabtype == "MartialStatus" ?
                                                          <AddMartialStatus dataVal={this.state.tabtype} />        
                                                          :
                                                          null
                                                        }
                                                      </div>
                                                      <div className="tab-pane" id="Languages">
                                                            {
                                                          this.state.tabtype == "Languages" ?
                                                          <AddLanguages dataVal={this.state.tabtype} />        
                                                          :
                                                          null
                                                        }
                                                      </div>
                                                      <div className="tab-pane" id="Religion">
                                                            {
                                                          this.state.tabtype == "Religion" ?
                                                          <AddReligion dataVal={this.state.tabtype} />        
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
                    </div>
               </section>
          </div>
      </div>
    );

  }

}
export default EditLocationDetails = withTracker((props)=>{

    const postHandle = Meteor.subscribe('countriesdata');
    const post       = Countries.find({}).fetch({})||{};
    const loading    = !postHandle.ready();

    const postHandle1 = Meteor.subscribe('districtdata');
    const post1       = District.find({}).fetch({})||{};
    const loading1    = !postHandle1.ready();
    
    const postHandle2 = Meteor.subscribe('statedata');
    const post2       = State.find({}).fetch({})||{};
    const loading2    = !postHandle2.ready();
  
    return {
      loading,
      post,
      
      loading1,
      post1,

      loading2,
      post2,     
    };
})(ManageLocations);