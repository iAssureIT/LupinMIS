import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from 'moment';
import swal                   from 'sweetalert';
import validate               from 'jquery-validation';
import DatePicker           from "react-datepicker";
// import YearPicker from "react-year-picker";
import Datetime from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import Loader                 from "../../../common/Loader.js";
import CreateBeneficiary      from "./CreateBeneficiary.js";
import "./Beneficiary.css";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";

class Beneficiary extends Component{
  
  constructor(props){
    super(props);  
    this.state = {
      // "relation"            :"-- Select --",
      "tableData"                      :[],
      "selector"                      :{},
      "Check"                         :false,
      "districtFilter"                :"all",
      "blockFilter"                   :"all",
      "villageFilter"                 :"all",
      "searchText"                    :"all",
      "familyID"                      :"",  
      "beneficiaryID"                 :"",
      "uidNumberCheck"                :"",
      "firstNameOfBeneficiary"        :"",
      "middleNameOfBeneficiaryCheck"  :"",
      "firstNameOfBeneficiaryCheck"   :"",
      "middleNameOfBeneficiary"       :"",
      "surnameOfBeneficiary"          :"",
      "nameofbeneficiaries"           :"",
      "shown"               : true,
      "fields"              : {},
      "errors"              : {},
      "tableHeading"        : {
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        // nameofbeneficiaries : "Name of Beneficiary",
        surnameOfBeneficiary      : "Surname",
        firstNameOfBeneficiary    : "First Name",
        middleNameOfBeneficiary   : "Middle Name",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head",
        genderOfbeneficiary : "Gender",
        birthYearOfbeneficiary : "Birth Year",
        dist                : "District",
        block               : "Block",
        village             : "Village",
        actions             : 'Action',
      },
      "downloadtableHeading"        : {
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        surnameOfBeneficiary      : "Surname",
        firstNameOfBeneficiary    : "First Name",
        middleNameOfBeneficiary   : "Middle Name",
        // nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head",
        genderOfbeneficiary : "Gender",
        birthYearOfbeneficiary : "Birth Year",
        dist                : "District",
        block               : "Block",
        village             : "Village",
      },
      "tableObjects"        : {
        apiLink             : '/api/beneficiaries/',
        editUrl             : '/beneficiary',        
        paginationApply     : false,
        downloadApply       : true,
        searchApply         : true,
      },
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fileDetailUrl         : "/api/beneficiaries/get/filedetails/",
      goodRecordsTable      : [],
      failedRecordsTable    : [],
      goodRecordsHeading :{
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        surnameOfBeneficiary      : "Surname",
        firstNameOfBeneficiary    : "First Name",
        middleNameOfBeneficiary   : "Middle Name",
        // nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head"
      },
      failedtableHeading :{
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        surnameOfBeneficiary      : "Surname",
        firstNameOfBeneficiary    : "First Name",
        middleNameOfBeneficiary   : "Middle Name",
        // nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head",
        failedRemark        : "Failed Data Remark"
      }
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
  }
  handleChange(event){
    event.preventDefault();
    if(event.currentTarget.name==='familyID'){
      let id = $(event.currentTarget).find('option:selected').attr('data-id')
      axios.get('/api/families/'+id)
      .then((response)=>{
        // console.log('response families',response)
        this.setState({
          "surnameOfBeneficiary"          :response.data[0].surnameOfFH,
          "firstNameOfBeneficiaryCheck"   :response.data[0].firstNameOfFH,
          "uidNumberCheck"                :response.data[0].uidNumber,
          "middleNameOfBeneficiaryCheck"  :response.data[0].middleNameOfFH,
          "firstNameOfBeneficiary"    : "",
          "middleNameOfBeneficiary"   : "",
          "uidNumber"                 :"",
          "relation"                  : "-- Select --",
        })
      })
      .catch(function(error){ 
        console.log("error = ",error);
      });
    }
    this.setState({
      "familyID"                  : this.refs.familyID.value,          
      "surnameOfBeneficiary"      : this.refs.surnameOfBeneficiary.value,
      "firstNameOfBeneficiary"    : this.refs.firstNameOfBeneficiary.value,
      "middleNameOfBeneficiary"   : this.refs.middleNameOfBeneficiary.value,
      "uidNumber"                 : this.refs.uidNumber.value,
      "relation"                  : this.refs.relation.value,
      "genderOfbeneficiary"       : this.refs.genderOfbeneficiary.value,
    });
  } 
  SubmitBeneficiary(event){
    event.preventDefault();
    var id2 = this.state.uidNumber;
    if($('#createBeneficiary').valid()){
    var beneficiaryValue= 
    {
      "center_ID"                 : this.state.center_ID,
      "center"                    : this.state.centerName,
      "family_ID"                 : this.refs.familyID.value.split('|')[1],          
      "familyID"                  : this.refs.familyID.value.split('|')[0],             
      "surnameOfBeneficiary"      : this.refs.surnameOfBeneficiary.value,
      "firstNameOfBeneficiary"    : this.refs.firstNameOfBeneficiary.value,
      "middleNameOfBeneficiary"   : this.refs.middleNameOfBeneficiary.value ? this.refs.middleNameOfBeneficiary.value : "-",     
      "uidNumber"                 : this.refs.uidNumber.value ? this.refs.uidNumber.value : "-",
      "relation"                  : this.refs.relation.value ? this.refs.relation.value : "-",
      "birthYearOfbeneficiary"    : this.state.birthYearOfbeneficiary ? this.state.birthYearOfbeneficiary : "-",
      "genderOfbeneficiary"       : this.refs.genderOfbeneficiary.value ? this.refs.genderOfbeneficiary.value : "-",
    };
    this.setState({
      "shown"                    : true,
      "familyID"                 :"",
      "beneficiaryID"            :"",
      "surnameOfBeneficiary"     :"",   
      "firstNameOfBeneficiary"   :"",   
      "middleNameOfBeneficiary"  :"",   
      "uidNumber"                :"",   
      "relation"                 :"-- Select --",
      "genderOfbeneficiary"      :"-- Select --",
      "date"                     :"",   
      "birthYearOfbeneficiary"   :"",   
    });
    axios.post('/api/beneficiaries',beneficiaryValue)
      .then((response)=>{
        var inputGetData = {
          "center_ID"       : this.state.center_ID,
          "district"        : this.state.districtFilter,
          "blocks"          : this.state.blockFilter,
          "village"         : this.state.villageFilter, 
          "searchText"      : this.state.searchText, 
        }
        this.getData(inputGetData);   
        swal({
          title : response.data.message,
          text  : response.data.message,
        });
      })
      .catch((error)=>{
        console.log("error = ",error);
      });
    }
  }
  uploadedData(data){
    var inputGetData = {
      "center_ID"       : this.state.center_ID,
      "district"        : this.state.districtFilter,
      "blocks"          : this.state.blockFilter,
      "village"         : this.state.villageFilter, 
      "searchText"      : this.state.searchText, 
    }
    this.getData(inputGetData);
  }
  Update(event){
    event.preventDefault();
    if($('#createBeneficiary').valid()){
      var beneficiaryValue= 
      {
        "center_ID"             : this.state.center_ID,
        "center"                : this.state.centerName,
        "beneficiary_ID"        : this.state.editId,          
        "beneficiaryID"         : this.state.beneficiaryID,          
        "family_ID"             : this.refs.familyID.value.split('|')[1],          
        "familyID"              : this.refs.familyID.value.split('|')[0],           
        "surnameOfBeneficiary"      : this.refs.surnameOfBeneficiary.value,
        "firstNameOfBeneficiary"    : this.refs.firstNameOfBeneficiary.value,
        "middleNameOfBeneficiary"   : this.refs.middleNameOfBeneficiary.value ? this.refs.middleNameOfBeneficiary.value : "-",     
        "uidNumber"                 : this.refs.uidNumber.value ? this.refs.uidNumber.value : "-",
        "relation"                  : this.refs.relation.value ? this.refs.relation.value : "-",
        "birthYearOfbeneficiary"    : this.state.birthYearOfbeneficiary ? this.state.birthYearOfbeneficiary : "-",
        "genderOfbeneficiary"       : this.refs.genderOfbeneficiary.value ? this.refs.genderOfbeneficiary.value : "-",
      };
      // console.log('beneficiaryValue', beneficiaryValue);
      axios.patch('/api/beneficiaries/update',beneficiaryValue)
        .then((response)=>{
          var inputGetData = {
            "center_ID"       : this.state.center_ID,
            "district"        : this.state.districtFilter,
            "blocks"          : this.state.blockFilter,
            "village"         : this.state.villageFilter, 
            "searchText"      : this.state.searchText, 
          }
          this.getData(inputGetData);
          swal({
            title : response.data.message,
            text  : response.data.message,
          });
          
        })
        .catch((error)=>{
          console.log("error = ",error);
        });
      this.setState({
        "shown"                    : true,
        "familyID"                 :"",
        "nameofbeneficiaries"      :"",   
        "uidNumber"                :"",
        "surnameOfBeneficiary"     :"",   
        "firstNameOfBeneficiary"   :"",   
        "middleNameOfBeneficiary"  :"",   
        "date"                     :"",   
        "birthYearOfbeneficiary"   :"",   
        "relation"                 :"-- Select --",
        "genderOfbeneficiary"      :"",
        // "genderOfbeneficiary"      :"-- Select --",   
      });
      this.props.history.push('/beneficiary');
      this.setState({
        "editId"              : "",
      });
    }
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
    }    
    var inputGetData = {
      "center_ID"       : this.state.center_ID,
      "district"        : this.state.districtFilter,
      "blocks"          : this.state.blockFilter,
      "village"         : this.state.villageFilter, 
      "searchText"      : this.state.searchText, 
    }
    this.getData(inputGetData);
    if(nextProps){
      this.getLength();
    }  
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getAvailableFamilyId();
    const center_ID = localStorage.getItem("center_ID");
    // const token = localStorage.getItem("token");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    this.getLength(this.state.center_ID);
    this.getAvailableCenter(this.state.center_ID);
    var inputGetData = {
      "center_ID"       : this.state.center_ID,
      "district"        : this.state.districtFilter,
      "blocks"          : this.state.blockFilter,
      "village"         : this.state.villageFilter, 
      "searchText"      : this.state.searchText, 
    }
    this.getData(inputGetData);
    this.getAvailableFamilyId(this.state.center_ID);
    });    
 
    $.validator.addMethod("regxUIDNumber", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Aadhar Number.");
    $.validator.addMethod("regxsurnameOfBeneficiary", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Surname.");
    $.validator.addMethod("regxfirstNameOfBeneficiary", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid First Name.");
    // $.validator.addMethod("regxmiddleNameOfBeneficiary", function(value, element, regexpr) {         
    //   return regexpr.test(value);
    // }, "Please enter valid Middle Name.");

        $("#createBeneficiary").validate({
          rules: {
            uidNumber: {
              // required: true,
              regxUIDNumber: /^[_0-9]*((-|\s)*[_0-9]){12}$|^$/,
            },
            familyID: {
              required: true,
            },
            relation: {
              required: true,
            },
            surnameOfBeneficiary: {
              required: true,
              regxsurnameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,
            },
            firstNameOfBeneficiary: {
              required: true,
              regxfirstNameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,
            },
            middleNameOfBeneficiary: {
              // required: true,
               // regxmiddleNameOfBeneficiary: /^( [a-zA-Z ])*$/,
               // regxmiddleNameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,   
            },
          },
          errorPlacement: function(error, element) {
            if (element.attr("name") === "familyID"){
              error.insertAfter("#familyIDErr");
            }
            if (element.attr("name") === "relation"){
              error.insertAfter("#relationErr");
            }
            if (element.attr("name") === "surnameOfBeneficiary"){
              error.insertAfter("#surnameOfBeneficiaryErr");
            }
            if (element.attr("name") === "uidNumber"){
              error.insertAfter("#uidNumberErr");
            }
            if (element.attr("name") === "firstNameOfBeneficiary"){
              error.insertAfter("#firstNameOfBeneficiaryErr");
            }
            if (element.attr("name") === "middleNameOfBeneficiary"){
              error.insertAfter("#middleNameOfBeneficiaryErr");
            }
          }
        });
  }
  edit(id){
    if(id && id != undefined){
      axios({
      method: 'get',
      url: '/api/beneficiaries/'+id,
    })
    .then((response)=> {
      var editData = response.data[0];
      console.log('editData',response);
      if(editData){
        this.setState({
          "shown"                    : false,
          "beneficiaryID"            : editData.beneficiaryID,
          "familyID"                 : editData.familyID+"|"+editData.family_ID,          
          "surnameOfBeneficiary"     : editData.surnameOfBeneficiary,
          "firstNameOfBeneficiary"   : editData.firstNameOfBeneficiary,
          "middleNameOfBeneficiary"  : editData.middleNameOfBeneficiary,
          "uidNumber"                : editData.uidNumber,          
          "relation"                 : editData.relation,          
          "date"                     : editData.birthYearOfbeneficiary,          
          "genderOfbeneficiary"      : editData.genderOfbeneficiary,          
        },()=>{
          // console.log('edit===',this.state.birthYearOfbeneficiary);
        });      
      }
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    })
    .catch(function (error) {
      console.log("error = ",error);
    });
    }else{
      this.setState({
        "beneficiaryID"            : "",
        "familyID"                 : "",          
        "surnameOfBeneficiary"     : "",
        "firstNameOfBeneficiary"   : "",
        "middleNameOfBeneficiary"  : "",
        "uidNumber"                : "",      
        "relation"                 :"-- Select --",
        "genderOfbeneficiary"      :"",
        // "genderOfbeneficiary"      :"-- Select --",       
        "date"                     :"",   
        "birthYearOfbeneficiary"   :"",   
      });     
    }    
  }
  getLength(center_ID){
    /*  axios.get('/api/beneficiaries/count/'+center_ID)
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });*/
  }
  getData(inputGetData){
    this.setState({
      propsdata : inputGetData
    },()=>{
    // console.log("propsdata",this.state.propsdata)
    })
    if(inputGetData){
      $(".fullpageloader").show();
      axios.post('/api/beneficiaries/get/beneficiary/list', inputGetData)
      .then((response)=>{
        console.log('response', response);
        $('.fullpageloader').hide();  
        var tableData = response.data.map((a, i)=>{
          return {
            _id                       : a._id,
            beneficiaryID             : a.beneficiaryID,
            familyID                  : a.familyID,
            // nameofbeneficiaries       : a.nameofbeneficiaries,
            surnameOfBeneficiary      : a.surnameOfBeneficiary,
            firstNameOfBeneficiary    : a.firstNameOfBeneficiary,
            middleNameOfBeneficiary   : a.middleNameOfBeneficiary,
            uidNumber                 : a.uidNumber,
            relation                  : a.relation,
            genderOfbeneficiary       : a.genderOfbeneficiary,   
            birthYearOfbeneficiary    : a.birthYearOfbeneficiary,   
            dist                      : a.dist,
            block                     : a.block,
            village                   : a.village,
          }
        })
        this.setState({
          tableData : tableData,
          downloadData : tableData
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      }); 
    }      
  }
  getAvailableFamilyId(center_ID){
    if(center_ID){
      axios({
        method: 'get',
        url: '/api/families/list/'+center_ID,
      }).then((response)=> {
      // console.log("availableFamiliesresponse", response);
          this.setState({
            availableFamilies : response.data
          })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  getFileDetails(fileName){
      $(".fullpageloader").show();
      axios
      .get(this.state.fileDetailUrl+this.state.center_ID+"/"+fileName)
      .then((response)=> {
        $('.fullpageloader').hide();  
        if (response) {
          this.setState({
              fileDetails:response.data,
              failedRecordsCount : response.data.failedRecords.length,
              goodDataCount : response.data.goodrecords.length
          });
          var tableData = response.data.goodrecords.map((a, i)=>{
            return{
                "beneficiaryID"             : a.beneficiaryID        ? a.beneficiaryID    : '-',
                "familyID"                  : a.familyID        ? a.familyID    : '-',
                "surnameOfBeneficiary"      : a.surnameOfBeneficiary,
                "firstNameOfBeneficiary"    : a.firstNameOfBeneficiary,
                "middleNameOfBeneficiary"   : a.middleNameOfBeneficiary,
                // "nameofbeneficiaries"       : a.firstNameOfBeneficiary + " " + a.middleNameOfBeneficiary + " " + a.surnameOfBeneficiary ,
                "uidNumber"                 : a.uidNumber     ? a.uidNumber : '-',
                "relation"                  : a.relation     ? a.relation : '-',
            }
          })
          var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
              "beneficiaryID"             : a.beneficiaryID        ? a.beneficiaryID    : '-',
              "familyID"                  : a.familyID        ? a.familyID    : '-',
              "surnameOfBeneficiary"      : a.surnameOfBeneficiary,
              "firstNameOfBeneficiary"    : a.firstNameOfBeneficiary,
              "middleNameOfBeneficiary"   : a.middleNameOfBeneficiary,
              // "nameofbeneficiaries"       : a.firstNameOfBeneficiary + " " + a.middleNameOfBeneficiary + " " + a.surnameOfBeneficiary ,
              "uidNumber"                 : a.uidNumber     ? a.uidNumber : '-',
              "relation"                  : a.relation     ? a.relation : '-',
              "failedRemark"              : a.failedRemark     ? a.failedRemark : '-'
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
  getSearchText(searchText){
    var searchText = searchText;
    // console.log('searchText',searchText)
    var formValues ={
      searchText : searchText,
    }

    this.setState({
        searchText    : searchText        
    },()=>{      
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "searchText"      : this.state.searchText, 
      }
      this.getData(inputGetData);
    })
    // if(searchText) {
    //   axios
    //   .post('/api/beneficiaries/searchValue/'+this.state.center_ID, formValues)
    //   .then(
    //     (res)=>{
    //       // console.log('res', res);
    //       if(res.data.data&&res.data.data.length>0){
    //         var tableData = res.data.data.map((a, i)=>{
    //           return {
    //             _id                       : a._id,
    //             beneficiaryID             : a.beneficiaryID,
    //             familyID                  : a.familyID,
    //             surnameOfBeneficiary      : a.surnameOfBeneficiary,
    //             firstNameOfBeneficiary    : a.firstNameOfBeneficiary,
    //             middleNameOfBeneficiary   : a.middleNameOfBeneficiary,
    //             // nameofbeneficiaries       : a.surnameOfBeneficiary+" "+a.firstNameOfBeneficiary+" " +a.middleNameOfBeneficiary,
    //             uidNumber                 : a.uidNumber,
    //             relation                  : a.relation,
    //             genderOfbeneficiary       : a.genderOfbeneficiary,   
    //             birthYearOfbeneficiary    : a.birthYearOfbeneficiary,
    //           }
    //         })
    //       }
    //     this.setState({
    //       tableData     : tableData,          
    //     })
    //   }).catch((error)=>{ 
    //     console.log('error',error)
    //     // swal("No results found","","error");
    //     this.setState({
    //       tableData     : [],          
    //     })
    //   });
    // }
  }
  getUID(event) {
    /*  if(this.state.firstNameOfBeneficiary === this.state.firstNameOfBeneficiaryCheck )
    {
       
      var uidNumber = this.state.uidNumberCheck;
      var middleNameOfBeneficiaryCheck = this.state.middleNameOfBeneficiaryCheck;
      this.setState({
          uidNumber : uidNumber,
          relation  : "Self",
          middleNameOfBeneficiary : middleNameOfBeneficiaryCheck,
          Check     : false,
      })
          
    }

    else if(this.refs.firstNameOfBeneficiary.value == ""){
      this.setState({
          uidNumber : "",
          relation  : "-- Select --",
          middleNameOfBeneficiary : "",
          Check     : false,
      })

    }*/
  }
  toglehidden(){   
    this.setState({
     shown: !this.state.shown
    });
  }
  handleYear(date){
    this.setState({
      birthYearOfbeneficiary    : moment(date).format('YYYY'),
      date    : date,
    },()=>{
    });
  };
  handleFilters(event){
    event.preventDefault();
    this.setState({
      "districtFilter"             :this.refs.districtFilter.value, 
      "blockFilter"                :this.refs.blockFilter.value, 
      "villageFilter"              :this.refs.villageFilter.value, 
    },()=>{      
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "searchText"      : this.state.searchText, 
      }
      this.getData(inputGetData);
    });
  }
  getAvailableCenter(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        if(response.data){
          function removeDuplicates(data, param){
              return data.filter(function(item, pos, array){
                  return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
              })
          }
          var availableDistInCenter= removeDuplicates(response.data[0].villagesCovered, "district");
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
          availableDistInCenter.sort(dynamicSort("district"));
          this.setState({
            listofDistrict  : availableDistInCenter,
          },()=>{
          })
        }
      }).catch(function (error) {
        console.log("error"+error);
      });
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }  
  districtFilterChange(event){    
    event.preventDefault();
    var district = event.target.value;
    this.setState({
      districtFilter : district,
      blockFilter    : "all",
      villageFilter  : "all",
    },()=>{
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "searchText"      : this.state.searchText, 
      }
      this.getData(inputGetData);
      var selectedDistrict = this.state.district;
      this.setState({
        selectedDistrict :selectedDistrict,
        village : '-- Select --',
        block : '-- Select --',
        listofVillages :[]
      },()=>{
        axios({
          method: 'get',
          url: '/api/centers/'+this.state.center_ID,
          }).then((response)=> {
          function removeDuplicates(data, param, district){
            return data.filter(function(item, pos, array){
              return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
            })
          }
          var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.districtFilter);
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
          availableblockInCenter.sort(dynamicSort("block"));
          this.setState({
            listofBlocks     : availableblockInCenter,
            block : '-- Select --',
          },()=>{
            console.log("this.state.listofBlocks",this.state.listofBlocks);
          })
        }).catch(function (error) {
          console.log("error = ",error);
        });
      })
    });
  }
  selectFilterBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      blockFilter    : block,
      villageFilter  : "all",
    },()=>{
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "searchText"      : this.state.searchText, 
      }
      this.getData(inputGetData);
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.districtFilter,this.state.blockFilter);
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
        availablevillageInCenter.sort(dynamicSort("village"));
        this.setState({
          listofVillages   : availablevillageInCenter,
          village : "-- Select --"
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
  }
  selectFilterVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      villageFilter : village
    },()=>{
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "searchText"      : this.state.searchText, 
      }
      this.getData(inputGetData);
    });  
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
                      Beneficiary Management
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <ul className="nav tabNav nav-pills col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-12 col-xs-12">
                    <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualbenificiary">Manual</a></li>
                    <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkbenificiary">Bulk Upload</a></li>
                  </ul> 
                  <div className="tab-content ">
                    <div id="manualbenificiary"  className="tab-pane fade in active ">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt"> 
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-right">
                            <button type="button" className="btn addBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.toglehidden.bind(this)}>Add Beneficiary</button>
                        </div> 
                      </div>
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="createBeneficiary"  style={hidden}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box_Filter">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                              Create New Beneficiary
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Family ID</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="familyIDErr" >
                                <select className="custom-select form-control inputBox" value={this.state.familyID} ref="familyID" name="familyID" onChange={this.handleChange.bind(this)} >
                                  <option value="" className="hidden" >-- Select --</option>
                                  {
                                    this.state.availableFamilies && this.state.availableFamilies.length>0 ? this.state.availableFamilies.map((data, index)=>{
                                    // console.log(data)
                                      return(
                                        <option key={data._id} value={data.familyID+'|'+data._id} data-id={data._id}>{data.familyID}</option>
                                        );
                                    }) 
                                    : 
                                    null                            
                                  }
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Surname  </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="surnameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="surnameOfBeneficiary" name="surnameOfBeneficiary" value={this.state.surnameOfBeneficiary}  onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">First Name  </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="firstNameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="firstNameOfBeneficiary" name="firstNameOfBeneficiary" value={this.state.firstNameOfBeneficiary} onBlur={this.getUID.bind(this)}  onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Middle Name  </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="middleNameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="middleNameOfBeneficiary" name="middleNameOfBeneficiary" value={this.state.middleNameOfBeneficiary}    onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uidNumberErr" >
                                <input type="number" className="form-control inputBox "  placeholder=""ref="uidNumber" name="uidNumber" value={this.state.uidNumber} maxLength = "12" onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Relation with Family Head</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="relationErr" >
                                <select className="custom-select form-control inputBox" ref="relation" name="relation" value={this.state.relation} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' value="-" disabled="disabled" >-- Select --</option>
                                  <option>Self</option>
                                  <option>Wife</option>
                                  <option>Husband</option>
                                  <option>Son</option>
                                  <option>Daughter</option>
                                  <option>Father</option>
                                  <option>Mother</option>
                                  <option>Brother</option>
                                  <option>Sister</option>
                                  <option>Daughter-in-Law</option>
                                  <option>Son-in-Law</option>
                                  <option>Grandson</option>
                                  <option>Granddaughter</option>
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Gender</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="genderOfbeneficiaryErr" >
                                <select className="custom-select form-control inputBox" ref="genderOfbeneficiary" name="genderOfbeneficiary" value={this.state.genderOfbeneficiary} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' value="-" disabled="disabled" >-- Select --</option>
                                  <option>Female</option>
                                  <option>Male</option>
                                  <option>Transgender</option>
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Birth Year</label>
                              <div className="">
                                <Datetime 
                                  dateFormat="YYYY"
                                  name="birthYearOfbeneficiary" 
                                  id="birthYearOfbeneficiaryErr"
                                  value={this.state.date}
                                  closeOnSelect={true}
                                  onChange={this.handleYear.bind(this)} 
                                  className="inputBox-main" 
                                />
                              </div>
                            </div>

                            {/*<div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Birth Year</label>
                              <div className="inputBox-main">
                              {console.log('birthYearOfbeneficiary',this.state.birthYearOfbeneficiary)}
                              <YearPicker 
                                name="birthYearOfbeneficiary" 
                                id="birthYearOfbeneficiaryErr"
                                defaultValue={this.state.birthYearOfbeneficiary}
                                onChange={this.handleYear.bind(this)} 
                                className=""
                               />
                            </div>
                            </div>*/}

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                              {
                                this.state.editId ? 
                                <button className=" col-lg-2 btn submit pull-right" onClick={this.Update.bind(this)}> Update </button>
                                :
                                <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Submit </button>
                              }
                          </div> 
                        </div>
                        </div> 
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt" style={displayBlock}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box_Filter">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                              Filters for List
                            </div>           
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box">
                              <label className="formLable">District</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtErr" >
                                <select className="custom-select form-control inputBox" ref="districtFilter" name="districtFilter" value={this.state.districtFilter} onChange={this.districtFilterChange.bind(this)}  >
                                  <option selected='true' disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  {
                                    this.state.listofDistrict && this.state.listofDistrict.length > 0 ? 
                                    this.state.listofDistrict.map((data, index)=>{
                                      // console.log('this.state.listofDistrict',this.state.listofDistrict);
                                      return(
                                        <option key={index} value={(data.district).split('|')[0]}>{this.camelCase(data.district).split('|')[0]}</option>
                                      );
                                    })
                                    :
                                    null
                                  }                               
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box">
                              <label className="formLable">Block</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blockErr" >
                                <select className="custom-select form-control inputBox" ref="blockFilter" name="blockFilter" value={this.state.blockFilter?this.state.blockFilter:""} onChange={this.selectFilterBlock.bind(this)} >
                                  <option selected='true'  disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  {

                                    this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                    this.state.listofBlocks.map((data, index)=>{
                                      return(
                                        <option key={index} value={data.block}>{this.camelCase(data.block)}</option>
                                      );
                                    })
                                    :
                                    null
                                  }                              
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box">
                              <label className="formLable">Village</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="villageErr" >
                                <select className="custom-select form-control inputBox" ref="villageFilter" name="villageFilter" value={this.state.villageFilter?this.state.villageFilter:""} onChange={this.selectFilterVillage.bind(this)}  >
                                  <option selected='true' disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  {
                                    this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                                    this.state.listofVillages.map((data, index)=>{
                                      return(
                                        <option key={index} value={data.village}>{this.camelCase(data.village)}</option>
                                      );
                                    })
                                    :
                                    null
                                  } 
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
                          tableName = "Beneficiary"
                          id = "Beneficiary"
                          tableHeading={this.state.tableHeading}
                          downloadtableHeading={this.state.downloadtableHeading}
                          tableData={this.state.tableData}
                          downloadData={this.state.downloadData}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          data={this.state.propsdata}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                          getSearchText={this.getSearchText.bind(this)}
                        />
                      </div>
                    </div>
                    <div  id="bulkbenificiary" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                          <BulkUpload 
                            url="/api/beneficiaries/bulk_upload_beneficiary" 
                            data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID}}
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
                                
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default Beneficiary
