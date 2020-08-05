import React, { Component } from 'react';
import BulkUploadComponent from './BulkUploadComponent';
import axios from 'axios';
import $ from 'jquery';

class StateBulkUpload extends Component{
constructor(props) {
    super(props);
    this.state = {
    "inputFileData" : [],
    dbdata          : []
    }
    this.fileInput = React.createRef();
    this.getFileDetails = this.getFileDetails.bind(this);
  }
  componentDidMount(){
    
    //this.setState({countryID : "5e05dc0ab1dafa99a3688be3"})
    /*axios
        .get("http://localhost:5006/api/states/get/schema/states")
        .then((response)=> {
        if (response) {
          this.setState({dbdata:response.data.fields});
        }
        })
        .catch((error)=> { 
          this.setState({
            "inputFileData" : []
          })      
        })*/
    var dbdata = [];
    dbdata.push({name: "districtName", type: "string", label:"District Name" })
    this.setState({
      dbdata: dbdata
    })
    //console.log('dbdata',this.state.dbdata);    
    
    axios
    .get("http://localhost:5006/api/countries/get/list")
    .then((response)=> {
      this.setState({ countryArray : response.data })
    })
    .catch((error)=> { 
          
    })

    axios
    .get("http://localhost:5006/api/states/get/list/in")
    .then((response)=> {
      this.setState({ statesArray : response.data })
    })
    .catch((error)=> { 
          
    })
  }
  uploadedData(){

  }
  getFileDetails(fileName){
    axios
    .get(this.state.fileDetailUrl+fileName)
    .then((response)=> {
      $('.fullpageloader').hide();  
      if(response&&response.data) {
        this.setState({
          fileDetails:response.data,
          failedRecordsCount : response.data.failedRecords.length,
          goodDataCount : response.data.goodrecords.length
        });
        var tableData = response.data.goodrecords.map((a, i)=>{
          return{
            "projectCategoryType" : a.projectCategoryType        ? a.projectCategoryType    : '-',
            "projectName"         : a.projectName        ? a.projectName    : '-',
            "date"                : a.date     ? a.date : '-',
            "place"               : a.district + ", " + a.block + ", " + a.village ,
            "sectorName"          : a.sectorName     ? a.sectorName : '-',
            "activityName"        : a.activityName     ? a.activityName : '-',
            "subactivityName"     : a.subactivityName     ? a.subactivityName : '-',
            "unit"                : a.unit     ? a.unit : '-',
            "unitCost"            : a.unitCost     ? a.unitCost : '-',
            "quantity"            : a.quantity     ? a.quantity : '-',
            "totalcost"           : a.totalcost     ? a.totalcost : '-',
            "numofBeneficiaries"  : a.numofBeneficiaries     ? a.numofBeneficiaries : '-',
            "LHWRF"               : a.LHWRF     ? a.LHWRF : '-',
            "NABARD"              : a.NABARD     ? a.NABARD : '-',
            "bankLoan"            : a.bankLoan     ? a.bankLoan : '-',
            "govtscheme"          : a.govtscheme     ? a.govtscheme : '-',
            "directCC"            : a.directCC     ? a.directCC : '-',
            "indirectCC"          : a.indirectCC     ? a.indirectCC : '-',
            "other"               : a.other     ? a.other : '-',
            "remark"              : a.remark     ? a.remark : '-',
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
            "projectCategoryType" : a.projectCategoryType        ? a.projectCategoryType    : '-',
            "projectName"         : a.projectName        ? a.projectName    : '-',
            "date"                : a.date     ? a.date : '-',
            "place"               : a.district + ", " + a.block + ", " + a.village ,
            "sectorName"          : a.sectorName     ? a.sectorName : '-',
            "activityName"        : a.activityName     ? a.activityName : '-',
            "subactivityName"     : a.subactivityName     ? a.subactivityName : '-',
            "unit"                : a.unit     ? a.unit : '-',
            "unitCost"            : a.unitCost     ? a.unitCost : '-',
            "quantity"            : a.quantity     ? a.quantity : '-',
            "numofBeneficiaries"  : a.numofBeneficiaries     ? a.numofBeneficiaries : '-',
            "LHWRF"               : a.LHWRF     ? a.LHWRF : '-',
            "NABARD"              : a.NABARD     ? a.NABARD : '-',
            "bankLoan"            : a.bankLoan     ? a.bankLoan : '-',
            "govtscheme"          : a.govtscheme     ? a.govtscheme : '-',
            "directCC"            : a.directCC     ? a.directCC : '-',
            "indirectCC"          : a.indirectCC     ? a.indirectCC : '-',
            "other"               : a.other     ? a.other : '-',
            "remark"              : a.remark     ? a.remark : '-',
            "failedRemark"        : a.failedRemark     ? a.failedRemark : '-',
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
  handleChange(event){
    this.setState({countryID: event.currentTarget.value})
  }
  handleChangeState(event){
    this.setState({stateID: event.currentTarget.value})
  }
  render() {
    const SheetJSFT = [
      "xlsx",
      "xls",
      "csv"
    ]
    return (
    <div className="container-fluid">
      <div className="row">
      <br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
         
          <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6">
            <h4>Bulk Upload</h4>  
            <hr/>    
          </div>

          <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6" style={{textAlign:"end"}}>
            <label>Select Country</label>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 NOpadding">
            <select className="form-control col-lg-3 col-md-3 col-sm-6 col-xs-6" onChange={this.handleChange.bind(this)}>
              <option disabled selected >Select Country</option>
              { this.state.countryArray && this.state.countryArray.map((data,ind)=>{
                  return(<option value={data._id} >{data.countryName}</option>);
                })
              }
            </select>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6" style={{textAlign:"end"}}>
            <label>Select State</label>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 NOpadding">
            <select className="form-control col-lg-3 col-md-3 col-sm-6 col-xs-6" onChange={this.handleChangeState.bind(this)}>
              <option disabled selected >Select State</option>
              { this.state.statesArray && this.state.statesArray.map((data,ind)=>{
                  return(<option value={data._id} >{data.stateName}</option>);
                })
              }
            </select>
          </div>
          
        </div>

      </div>
      <br/>
        <BulkUploadComponent url="http://localhost:5006/api/districts/post/bulkinsert" 
        data={{ "countryID" : this.state.countryID, "stateID" : this.state.stateID }} 
        uploadedData={this.uploadedData} 
        fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Activity+Submission.xlsx"
        dbdata={this.state.dbdata}
        fileDetailUrl="http://localhost:5006/api/states/get/filedetails/"
        getFileDetails={this.getFileDetails}
        fileDetails={this.state.fileDetails}        />
        
    </div>
    )
  }
}
export default StateBulkUpload;