import React, { Component }       from 'react';
import $                          from 'jquery';
// import moment                     from 'moment';
// import swal                       from 'sweetalert';
import axios                      from 'axios';
import IAssureTable               from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader                     from "../../common/Loader.js";

import "./ProjectList.css";

class ProjectMapping extends Component{
  constructor(props){
    super(props);
    this.state = {
      "startDate"          : "",
      "endDate"            : "",
      "projectName"        : "",
      "framework"          : [],
      "availableSectors"   : [],
      "listofTypesArray"   : "",
      "goalName"           : "-- Select --",
      "goalType"           : "-- Select --",
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        projectName        : "Project Name",
        sectorName         : "Sector",
        activityName       : "Activity", 
        subActivityName    : "Subactivity", 
      },
      "tableObjects"       : {
        deleteMethod       : 'delete',
        apiLink            : '/api/projectMappings/',
        downloadApply      : true,
        paginationApply    : false,
        searchApply        : false,
        editUrl            : '/project-definition/'
      },
      "startRange"         : 0,
      "limitRange"         : 10000,
      "sectorData"         : [],
      "editId"             : this.props.match.params ? this.props.match.params.projectMappingId : '',
      "role"                : localStorage.getItem("role")
    }
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
  } 
  getLength(){
    axios.get('/api/projectMappings/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getData(startRange, limitRange){
    $(".fullpageloader").show();
    axios.get('/api/projectMappings/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      $(".fullpageloader").hide();
      // console.log(response)
      if(response&&response.data&&response.data.length>0){
        var tableData = response.data.map((a, i)=>{
        return {
            _id                       : a._id,
            projectName               : a.projectName,
            sectorName                : a.sectorName,
            activityName              : a.activityName,
            subActivityName           : a.subActivityName,
          }
        })
        this.setState({
          tableData : tableData
        })
      }
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  render() {
    // console.log('this.state.availableSectors',this.state.availableSectors)
    return(
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Project List                                        
                      </div>
                    <hr className="hr-head container-fluid row zeroMB"/>
                  </div>
                     
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <IAssureTable 
                      tableName = "Project List"
                      id = "ProjectList" 
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
export default ProjectMapping