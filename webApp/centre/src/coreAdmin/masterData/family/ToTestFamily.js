import React, { Component }   from 'react';
import $                      from 'jquery';
import validate               from 'jquery-validation';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import Datetime               from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureITTable.jsx";
import Loader                 from "../../../common/Loader.js";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";
import 'react-table/react-table.css';
import "./Family.css";

class Family extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "familyID"             :"",
      "nameOfFamilyHead"     :"",
      "uID"                  :"",
      "category"             :"",
      "LHWRFCentre"          :"",
      "district"             :"-- Select --",
      "block"                :"-- Select --",
      "village"              :"-- Select --",
      "casteFilter"          :"all",
      "districtFilter"       :"all",
      "blockFilter"          :"all",
      "villageFilter"        :"all",
      "specialCategoryFilter":"all",
      "landCategoryFilter"   :"all",
      "incomeCategoryFilter" :"all",
      "searchText"           :"all",
      "contact"              :"",       
      "surnameOfFH"          :"",
      "firstNameOfFH"        :"",
      "date"                 :"",
      "shown"                : true,
      "FHYearOfBirth"        :"",
      "listofDistrict"       :[],
      "listofBlocks"         :[],
      "listofVillages"       :[],
      "tableData"            : [],
      "downloadData"         : [],
      fields: {},
      errors: {},
      "tableObjects"         : {
        apiLink               : '/api/families/',
        editUrl               : '/family',      
        paginationapply       : true,
        paginationApply       : false,
        searchApply           : true,
        downloadApply         : true,
      },
      "tableHeading"          : {
        familyID              : "Family ID",
        surnameOfFH           : "Surname",
        firstNameOfFH         : "First Name",
        middleNameOfFH        : "Middle Name",
        isUpgraded            : "Upgraded",        
        // nameOfFH              : "Name of Family Head",
        FHGender              : "Gender",
        FHYearOfBirth         : "Birth Year",
        uidNumber             : "UID Number",
        contactNumber         : "Contact Number",
        caste                 : "Caste",
        landCategory          : "Land holding Category",        
        incomeCategory        : "Income Category",        
        specialCategory       : "Special Category",        
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
        actions               : 'Action',
      },            
      "downloadtableHeading"          : {
        familyID              : "Family ID",
        surnameOfFH           : "Surname",
        firstNameOfFH         : "FirstName",
        middleNameOfFH        : "MiddleName",
        FHGender              : "Gender",
        FHYearOfBirth         : "Birth Year",
        uidNumber             : "UID Number",
        contactNumber         : "Contact Number",
        caste                 : "Caste",
        landCategory          : "Land holding Category",        
        incomeCategory        : "Income Category",        
        specialCategory       : "Special Category",        
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
      },            
      "startRange"            : 0,
      "limitRange"            : 10000,
    }
  }
  componentWillReceiveProps(nextProps){
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
        "searchText"      : this.state.searchText,
        "startRange"      : this.state.startRange,
        "limitRange"      : this.state.limitRange
      }  
      this.getData(inputGetData);
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
 
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getLength(this.state.center_ID);
      // console.log(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
        "searchText"      : this.state.searchText,
        "startRange"      : this.state.startRange,
        "limitRange"      : this.state.limitRange
      }
      // console.log("Did", inputGetData);
      this.getData(inputGetData);
    }); 

  }

  getLength(center_ID){
    axios.get('/api/families/count/'+center_ID)
    .then((response)=>{
      // console.log('response=================',response)
      this.setState({
        dataCount : response.data.dataCount
      },()=>{
      })
    })
    .catch(function(error){
    });
  }
  getData(inputGetData){ 
    // console.log("inputGetData",inputGetData);
    this.setState({
      propsdata : inputGetData
    },()=>{
      // console.log("propsdata",this.state.propsdata)
    })
    if (inputGetData){
      $(".fullpageloader").show();
      // axios.post('/api/families/list/'+center_ID,data)
      axios.post('/api/families/get/family/list',inputGetData)
      .then((response)=>{
        $(".fullpageloader").hide();
        // console.log('response', response);
        var newTableData = response.data.map((a, i)=>{
          return {
            _id                   : a._id,
            familyID              : "<div class= 'noWrapText'>" + a.familyID + "</div>",
            surnameOfFH           : a.surnameOfFH,
            firstNameOfFH         : a.firstNameOfFH,
            middleNameOfFH        : a.middleNameOfFH,
            isUpgraded            : a.isUpgraded,
            FHGender              : a.FHGender,
            FHYearOfBirth         : a.FHYearOfBirth,
            uidNumber             : a.uidNumber,
            contactNumber         : a.contactNumber,
            caste                 : a.caste,
            landCategory          : a.landCategory,
            incomeCategory        : a.incomeCategory,
            specialCategory       : a.specialCategory,
            dist                  : a.dist,
            block                 : a.block,
            village               : a.village,
          }
        })
        if(inputGetData.appendArray){
          this.setState({
            tableData    : this.state.tableData.concat(newTableData),
            downloadData : this.state.downloadData.concat(newTableData)
          })              
        }else{
          this.setState({
            tableData    : newTableData,
            downloadData : newTableData
          })                            
        }
      })    
      .catch(function(error){      
        console.log("error"+error);
      }); 
    }
  }

  render() {     
    var hidden = {
      display: this.state.shown ? "none" : "block"
    } 
    var displayBlock = {
      display: this.state.shown ? "block" : "none"
    }
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
                      Family Management
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                   
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <IAssureTable 
                          tableName            = "Family"
                          id                   = "Family"
                          downloadtableHeading ={this.state.downloadtableHeading}
                          downloadData         ={this.state.downloadData}
                          tableHeading         ={this.state.tableHeading}
                          twoLevelHeader       ={this.state.twoLevelHeader} 
                          dataCount            ={this.state.dataCount}
                          tableData            ={this.state.tableData}
                          getData              ={this.getData.bind(this)}
                          tableObjects         ={this.state.tableObjects} 
                          filterData           ={this.state.propsdata}
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
export default Family