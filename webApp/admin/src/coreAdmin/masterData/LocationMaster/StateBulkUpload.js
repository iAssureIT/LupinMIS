import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
// import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import Loader                 from "../../../common/Loader.js";
import BulkUpload             from "../../../admin/bulkupload/BulkUpload.js";
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./location.css";

class StateBulkUpload extends Component{
  
  constructor(props){
    super(props);  
    this.state = {
      "tableData"           :[],
      "shown"               : true,
      fileDetailUrl         : "/api/states/get/filedetails/",
      goodRecordsTable      : [],
      failedRecordsTable    : [],
      goodRecordsHeading :{
        stateCode        : "State Code",
        stateName        : "State Name",
      },
      failedtableHeading :{
        stateCode        : "State Code",
        stateName        : "State Name",
        failedRemark     : "Failed Data Remark"
      },
      "tableHeading"        : {
        stateCode        : "State Code",
        stateName        : "State Name",
        action           : 'Action',
      },
      "downloadtableHeading"        : {
        stateCode        : "State Code",
        stateName        : "State Name",
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/states/',
        editUrl             : '/statebulkupload/',
        downloadApply       : true,
        paginationApply     : false,
        searchApply         : false,
      },
      "editId"              : props.match.params ? props.match.params.stateID : '',
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
  }

  uploadedData(data){}

  componentWillReceiveProps(nextProps){
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    });    
    this.getData()
    axios
    .get("/api/countries/get/list")
    .then((response)=> {
      // console.log('response',response);
      this.setState({ 
        countryArray : response.data, 
        countryID : response.data[0]._id, 
      },()=>{
        // console.log('countryID',this.state.countryID);
      })
    })
    .catch((error)=> {     
    })
  }

  getData(){
    $(".fullpageloader").show();
    axios
    .get("/api/states/get/list/IN")
    .then((response)=> {
      console.log('response',response);
      $(".fullpageloader").hide();
      var tableData = response.data.map((a, i)=>{
        return {
          _id       : a._id, 
          stateCode : a.stateCode, 
          stateName : a.stateName,
        }
      })
      this.setState({
        tableData : tableData,
        downloadData : tableData, 
      });
    })
    .catch((error)=> {     
    })
  }

  getFileDetails(fileName){
    axios
    .get(this.state.fileDetailUrl+fileName)
    .then((response)=> {
      console.log('response',response);
      $('.fullpageloader').hide();  
      if (response) {
        this.setState({
            fileDetails:response.data,
            failedRecordsCount : response.data.failedRecords.length,
            goodDataCount : response.data.goodrecords.length
        });
        var tableData = response.data.goodrecords.map((a, i)=>{
          return{
            "stateCode"        : a.stateCode,
            "stateName"        : a.stateName,
          }
        })
        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
            "stateCode"        : a.stateCode,
            "stateName"        : a.stateName,
            "failedRemark"     : a.failedRemark     ? a.failedRemark : '-'
          }
        })
        this.setState({
            goodRecordsTable : tableData,
            failedRecordsTable : failedRecordsTable
        })
      }
    })
    .catch((error)=> { 
    }) 
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
                      State Bulk Upload
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <ul className="nav tabNav nav-pills col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-12 col-xs-12">
                    <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualState">List</a></li>
                    <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkState">Bulk Upload</a></li>
                  </ul> 
                  <div className="tab-content mt col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <div id="manualState"  className="tab-pane fade in active ">
                        <IAssureTable
                          noSRNumber = {false}  
                          divClass = "col-lg-8 col-lg-offset-2"
                          tableName = "State"
                          id = "State"
                          downloadtableHeading={this.state.downloadtableHeading}
                          downloadData={this.state.downloadData}
                          tableHeading={this.state.tableHeading}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
                    </div>
                    <div id="bulkState" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <BulkUpload 
                          url="/api/states/post/stateBulkinsert" 
                          data={{"countryID" : this.state.countryID ? this.state.countryID : "" }}
                          uploadedData={this.uploadedData} 
                          fileurl="https://lupiniassureit.s3.ap-south-1.amazonaws.com/master/templates/Create-State.xlsx"
                          fileDetailUrl={this.state.fileDetailUrl}
                          getData={this.getData.bind(this)}
                          propsdata={this.state.propsdata}
                          getFileDetails={this.getFileDetails}
                          fileDetails={this.state.fileDetails}
                          goodRecordsHeading ={this.state.goodRecordsHeading}
                          failedtableHeading={this.state.failedtableHeading}
                          failedRecordsTable ={this.state.failedRecordsTable}
                          failedRecordsCount={this.state.failedRecordsCount}
                          goodRecordsTable={this.state.goodRecordsTable}
                          goodDataCount={this.state.goodDataCount}
                          />
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
export default StateBulkUpload
