import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from 'moment';
import swal                   from 'sweetalert';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import Loader                 from "../../../common/Loader.js";
import BulkUpload             from "../../../admin/bulkupload/BulkUpload.js";

class VillageBulkUpload extends Component{
  
  constructor(props){
    super(props);  
    this.state = {
      "tableData"           :[],
      "shown"               : true,
      fileDetailUrl         : "/api/villages/get/filedetails/",
      goodRecordsTable      : [],
      failedRecordsTable    : [],
      goodRecordsHeading :{
        // stateName        : "State Name",
        // districtName     : "District Name",
        // blockName        : "Block Name",
        cityName         : "Village Name",
      },
      failedtableHeading :{
        stateName        : "State Name",
        districtName     : "District Name",
        blockName        : "Block Name",
        villageName      : "Village Name",
        failedRemark     : "Failed Data Remark"
      }
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

  getData(inputGetData){
  }
  getStateName(stateID){
    axios
    .get("/api/states/get/"+stateID)
    .then((response)=> {
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
            "stateName"        : a.stateName,
            "districtName"     : a.districtName,
            "blockName"        : a.blockName,
            "cityName"         : a.cityName,
          }
        })
        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
          "stateName"        : a.stateName,
          "districtName"     : a.districtName,
          "blockName"        : a.blockName,
          "villageName"      : a.villageName,
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
                      Village Bulk Upload
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                      <BulkUpload 
                        url="/api/villages/post/bulkinsert" 
                        data={{"countryID" : this.state.countryID ? this.state.countryID : "" }}
                        uploadedData={this.uploadedData} 
                        fileurl="https://lupiniassureit.s3.ap-south-1.amazonaws.com/master/templates/Create-Beneficiaries.xlsx"
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
export default VillageBulkUpload
