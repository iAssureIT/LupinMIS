import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';

import Loader                 from "../../../common/Loader.js";
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
     
class ListofLocations extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      // "stateID"                : "all",
      // "districtID"             : "all",
      // "blockID"                : "all",
      // "state"                  : "all",
      // "district"               : "all",
      // "block"                  : "all",
      // "village"                : "all",
      "twoLevelHeader"           : {
          apply                    : false,
          firstHeaderData          : []
      },
      "tableHeading"                : {
          countryCode       : "Country Code",
          countryName       : "Country Name",
          stateCode         : "State Code",
          stateName         : "State Name",
          districtName      : "District",
          blockName         : "Block",
          cityName          : "Village",
      },
      "tableObjects"              : {
        downloadApply       : true,
        paginationApply     : false,
      },
    }
  }

  getData(countryID, stateID, districtID, blockID){
    // console.log(countryID, stateID, districtID, blockID);
    if(countryID && stateID && districtID && blockID){
      $(".fullpageloader").show();
      axios.get('/api/villages/get/villagelist/'+countryID+'/'+stateID+'/'+districtID+'/'+blockID)
      .then((response)=>{
        $(".fullpageloader").hide();
        // console.log('response',response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id               : a._id,
            countryCode       : a.countryCode,
            countryName       : a.countryName,
            stateCode         : this.camelCase(a.stateCode),
            stateName         : this.camelCase(a.stateName),
            districtName      : this.camelCase(a.districtName),
            blockName         : this.camelCase(a.blockName),
            cityName          : this.camelCase(a.cityName),
            // stateCode         : a.stateCode,
            // stateName         : a.stateName,
            // districtName      : a.districtName,
            // blockName         : a.blockName,
            // cityName          : a.cityName,
          }
        })
        this.setState({
          tableData : tableData
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }  
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getState();
    axios
    .get("/api/countries/get/list")
    .then((response)=> {
      // console.log('response',response);
      this.setState({ 
        countryArray : response.data, 
        countryID : response.data[0]._id, 
      },()=>{
        this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID);
        // console.log('countryID',this.state.countryID);
      })
    })
    .catch((error)=> {     
    })
  }
  getState(){
    axios({
      method: 'get',
      url: '/api/states/get/list/IN',
    }).then((response)=> {
      // console.log('response',response);
      var listofStates = response.data;
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      listofStates.sort(dynamicSort("stateName"));
      if(response&&response.data){
        this.setState({
          listofStates : listofStates
        })
      }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  selectState(event){
    event.preventDefault();
    if(event.target.value==="all"){
      var selectedState = event.target.value;
      var stateID       = event.target.value;
    }else{
      var selectedState = event.target.value;
      var state     = selectedState.split('|')[0];
      var stateCode = selectedState.split('|')[1];
      var stateID   = selectedState.split('|')[2];
    }
    this.setState({
      stateCode  :stateCode,
      stateID    :stateID,
      state      :selectedState,
      district   : 'all',
      block      : 'all',
      village    : 'all',
      districtID : 'all',
      blockID    : 'all',
      villageID  : 'all',
    },()=>{
      this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID);
      this.getDistrict(this.state.stateCode);
    })
  }
  getDistrict(stateCode){
    axios({
      method: 'get',
      url: '/api/districts/get/list/IN/'+stateCode,
    }).then((response)=> {
      if(response&&response.data){
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function (a,b) {
            if(sortOrder == -1){
              return b[property].localeCompare(a[property]);
            }else{
              return a[property].localeCompare(b[property]);
            }        
          }
        }
        var listofDistrict = response.data;
        if(listofDistrict.length>0){
          listofDistrict.sort(dynamicSort("districtName"));
        }
        this.setState({
          listofDistrict : listofDistrict,
        })
      }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  districtChange(event){    
    event.preventDefault();
      var district = event.target.value;
    if(event.target.value==="all"){
      var selectedDistrict = event.target.value;
      var districtID       = event.target.value;
    }else{
      var selectedDistrict = district.split('|')[0];
      var districtID       = district.split('|')[1];
    }
    this.setState({
      district         : district,
      block            : 'all',
      village          : 'all',   
      blockID          : 'all',
      villageID        : 'all',
      selectedDistrict :selectedDistrict,
      districtID       :districtID,
    },()=>{
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID);
    });
  }     
  getBlock(stateCode, selectedDistrict){
    axios({
      method: 'get',
      url: '/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
    }).then((response)=> {
        // console.log('response',response);
      if(response&&response.data){
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
          }
          return function (a,b) {
            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
          }
        }
        var listofBlocks = response.data;
        if(listofBlocks.length>0){
          listofBlocks.sort(dynamicSort("blockName"));
        }
        this.setState({
          listofBlocks : listofBlocks
        })
      }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    /*this.camelCase(data.blockName)+'|'+data.countryID+'|'+data.stateID+'|'+data.districtID+'|'+data._id*/
    var blocksCoveredValue = event.target.value;
    
    if(event.target.value==="all"){
      var blocksCovered     = event.target.value;
      var blockID           = event.target.value;
      var countryID         = this.state.countryID;
      var stateID           = this.state.stateID;
      var districtID        = this.state.districtID;
    }else{
      var blocksCovered = blocksCoveredValue.split('|')[0];
      var countryID     = blocksCoveredValue.split('|')[1];
      var stateID       = blocksCoveredValue.split('|')[2];
      var districtID    = blocksCoveredValue.split('|')[3];
      var blockID       = blocksCoveredValue.split('|')[4];
    }
    // console.log('blocksCovered',blocksCoveredValue);
    this.setState({
      block              : blocksCoveredValue,
      blocksCovered      : blocksCovered,
      countryID          : countryID,
      stateID            : stateID,
      districtID         : districtID,
      blockID            : blockID,
      village            : 'all',   
      villageID          : 'all',
    },()=>{
      // console.log(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID)
      this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID);
    });
  }

  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
   render() {
    // console.log(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID);
    // console.log(this.state.countryID, this.state.state, this.state.district, this.state.block, this.state.village);
    return (
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper">
              <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                            List of Locations                                     
                         </div>
                        <hr className="hr-head container-fluid row zeroMB"/>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12 valid_box">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  ">
                          <label className="formLable">State</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                            <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.selectState.bind(this)} >
                              <option disabled="disabled" selected={true} value="--Select State--">--Select State--</option> 
                              <option value="all" >All</option>
                              {
                                this.state.listofStates ?
                                this.state.listofStates.map((data, index)=>{
                                  return(
                                    <option key={index} value={this.camelCase(data.stateName)+'|'+data.stateCode+'|'+data._id}>{this.camelCase(data.stateName)}</option> 
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                          <label className="formLable">District</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                            <select className="custom-select form-control inputBox"  value={this.state.district}  ref="district" name="district" onChange={this.districtChange.bind(this)} >
                              <option disabled="disabled" selected={true} value="--Select District--" >--Select District--</option>
                              <option value="all" >All</option>
                              {
                                this.state.listofDistrict  && this.state.listofDistrict.length > 0 ? 
                                this.state.listofDistrict.map((data, index)=>{
                                  return(
                                    <option key={index} value={this.camelCase(data.districtName)+'|'+data._id}>{this.camelCase(data.districtName)}</option>
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  ">
                          <label className="formLable">Block</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blocksCovered" >
                            <select className="custom-select form-control inputBox"  value={this.state.block}  ref="blocksCovered" name="blocksCovered"  onChange={this.selectBlock.bind(this)} >
                              <option disabled="disabled" selected={true} value="--Select Block--" >--Select Block--</option>
                              <option value="all" >All</option>
                              {
                                this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                this.state.listofBlocks.map((data, index)=>{
                                  return(
                                    <option key={index} value={this.camelCase(data.blockName)+'|'+data.countryID+'|'+data.stateID+'|'+data.districtID+'|'+data._id}>{this.camelCase(data.blockName)}</option>
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                        </div>
                      </div> 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
                          tableName = "List of Locations"
                          id = "ListofLocations"
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
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
export default ListofLocations
