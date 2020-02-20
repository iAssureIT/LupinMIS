import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';

import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
   
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
        activityName        : "Activity",
        subActivityName     : "Sub-Activity",
        unit                : "Unit",
        familyUpgradation   : "Family Upgradation",
      },
      "tableObjects"              : {
        deleteMethod        : 'patch',
        apiLink             : '/api/sectors/subactivity/delete/',
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
    axios.post('/api/sectors/subactivity/list', data)
    .then((response)=>{

      this.setState({
        tableData : response.data
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
        <div className="row">
          <div className="formWrapper">
              <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                            Sector List                                     
                         </div>
                        <hr className="hr-head container-fluid row"/>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
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
