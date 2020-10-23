import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
// import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import Loader                 from "../../../common/Loader.js";
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import BulkUpload             from "../../../admin/bulkupload/BulkUpload.js";

class VillageBulkUpload extends Component{
  
  constructor(props){
    super(props);  
    this.state = {
      // "stateID"                : "all",
      // "districtID"             : "all",
      // "blockID"                : "all",
      "tableData"           :[],
      "shown"               : true,

      "startRange"        : 0,
      "limitRange"        : 50, 
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
      },
      "tableHeading"                : {
          stateCode         : "State Code",
          stateName         : "State Name",
          districtName      : "District",
          blockName         : "Block",
          cityName          : "Village",
          action            : 'Action',
      },
      "downloadtableHeading"                : {
          stateCode         : "State Code",
          stateName         : "State Name",
          districtName      : "District",
          blockName         : "Block",
          cityName          : "Village",
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/villages/',
        editUrl             : '/villagebulkupload/',
        downloadApply       : true,
        paginationApply     : false,
        searchApply         : false,
      },
      "editId"              : props.match.params ? props.match.params.villageID : '',
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
    this.getState();
    axios
    .get("/api/countries/get/list")
    .then((response)=> {
      // console.log('response',response);
      this.setState({ 
        countryArray : response.data, 
        countryID    : response.data[0]._id, 
      },()=>{        
        // var inputGetData = {
        //   "countryID"      : this.state.countryID,
        //   "stateID"        : this.state.stateID,
        //   "districtID"     : this.state.districtID,
        //   "blockID"        : this.state.blockID,
        //   "startRange"     : this.state.startRange,
        //   "limitRange"     : this.state.limitRange,
        // }   
        // this.getData(inputGetData); 
        this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID, this.state.startRange, this.state.limitRange, this.state.startRange, this.state.limitRange);
        // console.log('countryID',this.state.countryID);
      })
    })
    .catch((error)=> {     
    })
  }

  // getData(inputGetData){
  //   this.setState({
  //     propsdata : inputGetData
  //   },()=>{
   // console.log("propsdata",this.state.propsdata)
  //   })
    // if(inputGetData){
    getData(countryID, stateID, districtID, blockID, startRange, limitRange){
    // console.log(countryID, stateID, districtID, blockID);
    if(countryID && stateID && districtID && blockID){
      $(".fullpageloader").show();
      axios.get('/api/villages/get/villagelist/'+countryID+'/'+stateID+'/'+districtID+'/'+blockID)
      // axios.post('/api/villages/get/villagelist',inputGetData)
      .then((response)=>{
        $(".fullpageloader").hide();
        // console.log('response',response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id               : a._id,
            stateCode         : (a.stateCode),
            stateName         : this.camelCase(a.stateName),
            districtName      : this.camelCase(a.districtName),
            blockName         : this.camelCase(a.blockName),
            cityName          : this.camelCase(a.cityName),
          }
        })
        this.setState({
          tableData    : tableData,
          downloadData : tableData, 
          dataCount    : tableData.dataLength
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
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
      // var inputGetData = {
      //   "countryID"      : this.state.countryID,
      //   "stateID"        : this.state.stateID,
      //   "districtID"     : this.state.districtID,
      //   "blockID"        : this.state.blockID,
      //   "startRange"     : this.state.startRange,
      //   "limitRange"     : this.state.limitRange,
      // }   
      // this.getData(inputGetData); 
      this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID, this.state.startRange, this.state.limitRange);
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
      // var inputGetData = {
      //   "countryID"      : this.state.countryID,
      //   "stateID"        : this.state.stateID,
      //   "districtID"     : this.state.districtID,
      //   "blockID"        : this.state.blockID,
      //   "startRange"     : this.state.startRange,
      //   "limitRange"     : this.state.limitRange,
      // }   
      // this.getData(inputGetData); 
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID, this.state.startRange, this.state.limitRange);
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
      // var inputGetData = {
      //   "countryID"      : this.state.countryID,
      //   "stateID"        : this.state.stateID,
      //   "districtID"     : this.state.districtID,
      //   "blockID"        : this.state.blockID,
      //   "startRange"     : this.state.startRange,
      //   "limitRange"     : this.state.limitRange,
      // }   
      // this.getData(inputGetData); 
      // console.log(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID, this.state.startRange, this.state.limitRange)
      this.getData(this.state.countryID, this.state.stateID, this.state.districtID, this.state.blockID, this.state.startRange, this.state.limitRange);
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
                  <ul className="nav tabNav nav-pills col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-12 col-xs-12">
                    <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualState">List</a></li>
                    <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkState">Bulk Upload</a></li>
                  </ul> 
                  <div className="tab-content mt col-lg-12 col-md-12 col-xs-12 col-sm-12">

                    <div className="valid_box">
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
                    <div id="manualState" className="tab-pane fade in active ">
                        <IAssureTable
                          tableName = "Village"
                          id = "Village"
                          downloadtableHeading={this.state.downloadtableHeading}
                          downloadData={this.state.downloadData}
                          tableHeading={this.state.tableHeading}
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          data={this.state.propsdata}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
                    </div>
                    <div id="bulkState" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <BulkUpload 
                        url="/api/villages/post/bulkinsert" 
                        data={{"countryID" : this.state.countryID ? this.state.countryID : "" }}
                        uploadedData={this.uploadedData} 
                        fileurl="https://lupiniassureit.s3.ap-south-1.amazonaws.com/master/templates/Create-Village.xlsx"
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
