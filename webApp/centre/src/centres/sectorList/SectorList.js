import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';

import Loader                 from "../../common/Loader.js";
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./SectorList.css";
   
class SectorList extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "typeOfCenter"             :"",
      "nameOfCenter"             :"",
      "address"                  :"",
      "state"                    :"",
      "district"                 :"",
      "pincode"                  :"",
      "centerInchargeName"       :"",
      "centerInchargeContact"    :"",
      "centerInchargeEmail"      :"",
      "MISCoordinatorName"       :"",
      "MISCoordinatorContact"    :"",
      "MISCoordinatorEmail"      :"",
      "districtCovered"          :"",
      "blockCovered"             :"",
      "array"                    :[],
      "shown"                    : true,
      "tabtype"                  : "location",
      "fields"                   : {},
      "errors"                   : {},
      "listofStates"             : [],
      "listofDistrict"           : [],
      "listofBlocks"             : [],
      "listofVillages"           : [],
      "selectedVillages"         : [],
      "twoLevelHeader"           : {
        apply                    : false,
        firstHeaderData          : []
      },
      "tableHeading"                : {
        sector              : "Sector",
        sectorShortName     : "Sector Short Name",
        activityName        : "Activity",
        subActivityName     : "Sub-Activity",
        unit                : "Unit",
        familyUpgradation   : "Family Upgradation",
      },
      "tableObjects"              : {
        deleteMethod        : 'patch',
        apiLink             : '/api/sectors/subactivity/delete/',
        downloadApply       : true,
        paginationApply     : false,
        searchApply         : false,
        editUrl             : '/sector-and-activity/'
      },
      "startRange"                : 0,
      "limitRange"                : 10000,
    }
  }

  getData(startRange, limitRange){
      var data = {
      startRange : startRange,
      limitRange : limitRange
    }
    $(".fullpageloader").show();
    axios.post('/api/sectors/subactivity/list', data)
    .then((response)=>{
    $(".fullpageloader").hide();
      console.log('response',response);
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
      var tableData = response.data.map((a, i)=>{
        return {
          _id               : a._id,
          sector            : a.sector,
          sectorShortName   : a.sectorShortName,
          activityName      : a.activityName,
          subActivityName   : a.subActivityName,
          unit              : a.unit,
          familyUpgradation : a.familyUpgradation,
        }
      })
      tableData.sort(dynamicSort("sector"));
      this.setState({
        tableData : tableData
      });
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }  
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getData(this.state.startRange, this.state.limitRange);
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
                            Sector List                                     
                         </div>
                        <hr className="hr-head container-fluid row zeroMB"/>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
                          tableName = "Sector List"
                          id = "SectorList"
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
export default SectorList
