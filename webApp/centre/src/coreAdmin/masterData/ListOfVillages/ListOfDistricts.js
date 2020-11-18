import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import 'bootstrap/js/tab.js';

import Loader                 from "../../../common/Loader.js";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./ListOfVillages.css";
   
class ListOfDistricts extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "center"            : "all",
      "center_ID"         : "all",
      "district"          : "all",
      "block"             : "all",
      "selectedDistrict"  : "all",
      "tabledistrictHeading"       : {
        centerName    :"CenterName",              
        district      :"District",            
      },
      "tableObjects"              : {
        deleteMethod              : 'delete',
        paginationApply           : false,
        downloadApply             : true,
        searchApply               : false,
      },
    }
  }

  getData(center_ID, district, block){
    if(center_ID && district && block){
      $(".fullpageloader").show();
      axios({
        method: 'get',
        url: '/api/reportDashboard/list_count_center_district_blocks_villages_list/'+center_ID+'/all/all',
      }).then((response)=> {
      $(".fullpageloader").hide();
        // console.log("response ===>",response);
        function removeDuplicates(data, param){
          return data.filter(function(item, pos, array){
              return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
          })
        }
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function (a,b) {
            if(sortOrder === -1){
              return b[property].localeCompare(a[property]);
            }else{
              return a[property].localeCompare(b[property]);
            }        
          }
        }
        // var centerdata = response.data.sort(dynamicSort("centerName"));
        // var centerdata = centerdata.sort(dynamicSort("district"));

        var centerdata = response.data;
        var tableDistrictData = centerdata.map((a, i)=>{
          return {
            _id           :a._id,
            centerName    :a.centerName,              
            district      :a.district,            
          }
        })
        tableDistrictData= [...new Map(tableDistrictData.map(obj => [JSON.stringify(obj), obj])).values()];

        this.setState({
          tableDistrictData  : tableDistrictData,
        })
      }).catch(function (error) {
        console.log('error', error);
      });
    }
  }
  
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getData(this.state.center_ID, this.state.selectedDistrict, this.state.block);
    this.getAvailableCenters();
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      // console.log('response',response);
      this.setState({
        availableCenters : response.data,
        // center           : response.data[0].centerName+'|'+response.data[0]._id
      },()=>{
      })
    }).catch(function (error) {
      console.log("error = ",error);
    });
  } 
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      if(this.state.selectedCenter==="all"){
        var center = this.state.selectedCenter;
      }else{
        var center = this.state.selectedCenter.split('|')[1];
      }
      // console.log('center', center);
      this.setState({
        center_ID        : center,  
        selectedDistrict : "all",
        district         : "all",
        block            : "all",
        village          : "all",          
      },()=>{
        this.getData(this.state.center_ID, this.state.selectedDistrict, this.state.block);
        this.getAvailableCenterData(this.state.center_ID);
      })
    });
  } 
  getAvailableCenterData(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        function removeDuplicates(data, param){
            return data.filter(function(item, pos, array){
                return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
            })
        }
        var availableDistInCenter= removeDuplicates(response.data[0].villagesCovered, "district");
        this.setState({
          availableDistInCenter  : availableDistInCenter,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
        },()=>{
          this.getData(this.state.center_ID, this.state.selectedDistrict, this.state.block);
          var stateCode =this.state.address.split('|')[0];
         this.setState({
            stateCode  : stateCode,
          });
      })
    }).catch(function (error) {
      console.log("districtError",+error);
    });
  } 
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      if(this.state.district==="all"){
        var selectedDistrict = this.state.district;
      }else{
        var selectedDistrict = this.state.district.split('|')[0];
      }
      this.setState({
        selectedDistrict :selectedDistrict,
        block : "all",
        village : "all",
      },()=>{        
      this.getData(this.state.center_ID, this.state.selectedDistrict, this.state.block);
      // console.log('selectedDistrict',this.state.selectedDistrict);
      // this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        // console.log('availableblockInCenter ============',response);
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.selectedDistrict);
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
      })
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block,
      village : "all",
    },()=>{
      // console.log("block",block);
      this.getData(this.state.center_ID, this.state.selectedDistrict, this.state.block);
      // this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.selectedDistrict,this.state.block);
        this.setState({
          listofVillages   : availablevillageInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
  }

   render() {
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
                          List of Districts in Centers                                     
                        </div>
                        <hr className="hr-head container-fluid row"/>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Center</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                            <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                              <option className="hidden" >-- Select --</option>
                              <option value="all" >All</option>
                              {
                                this.state.availableCenters && this.state.availableCenters.length >0 ?
                                this.state.availableCenters.map((data, index)=>{
                                  return(
                                    <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <IAssureTable 
                          noSRNumber = {false}  
                          divClass = "col-lg-8 col-lg-offset-2"
                          tableName = "List of Districts"
                          id = "ListOfDistricts"
                          tableHeading={this.state.tabledistrictHeading}
                          tableData={this.state.tableDistrictData}
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
export default ListOfDistricts
