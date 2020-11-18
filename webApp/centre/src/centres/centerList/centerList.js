import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import 'bootstrap/js/tab.js';

import Loader                 from "../../common/Loader.js";
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./centerList.css";
   
class centerList extends Component{
  
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
        firstHeaderData          : [
                                      {
                                          heading : '',
                                          mergedColoums : 4
                                      },
                                      {
                                          heading : 'Center Incharge',
                                          mergedColoums : 3
                                      },
                                      {
                                          heading : 'MIS Coordinator',
                                          mergedColoums : 3
                                      },
                                    ]
      },
      "tableHeading"                : {
        type                      : "Type of Center",
        centerName                : "Name of Center",
        place                   : "Address",
        centerInchargeDetail      : "Center Incharge Detail",
        misCoordinatorDetail      : "MIS Coordinator Detail",
        numberofVillage           : "No of Villages",
        // actions                   : 'Action',
      },
      "tableObjects"              : {
        deleteMethod              : 'delete',
        apiLink                   : '/api/centers/',
        paginationApply           : false,
        searchApply               : false,
        editUrl                   : '/center-detail/'
      },
      "startRange"                : 0,
      "limitRange"                : 10000,
    }
  }

  getData(startRange, limitRange){
    $(".fullpageloader").show();
    axios.get('/api/centers/list/'+startRange+'/'+limitRange)
    .then((response)=>{
    $(".fullpageloader").hide();
      // console.log('response', response.data);
      var tableData = response.data.map((a, i)=>{
        return {
          _id                       : a._id,
          type                      : a.type,
          centerName                : a.centerName,
          place                     : a.address,
          centerInchargeDetail      : a.centerInchargeDetail,
          misCoordinatorDetail      : a.misCoordinatorDetail,
          numberofVillage           : a.numberofVillage,
        }
      })
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
      tableData.sort(dynamicSort("centerName"));
      this.setState({
        tableData : tableData
      },()=>{
      })
    })
    .catch(function(error){
        console.log("error = ",error);
    });

    var listofStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh','Maharashtra'];
    this.setState({
      listofStates : listofStates
    })
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
                            Center List                                     
                         </div>
                        <hr className="hr-head container-fluid row"/>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <IAssureTable 
                          tableName = "Center Details"
                          id = "CenterDetail"
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
export default centerList
