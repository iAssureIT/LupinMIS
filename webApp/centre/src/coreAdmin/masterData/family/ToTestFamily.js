import React, { Component }   from 'react';
import $                      from 'jquery';
import validate               from 'jquery-validation';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import Datetime               from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
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
      "contact"              :"",       
      "surnameOfFH"          :"",
      "firstNameOfFH"        :"",
      "date"                 :"",
      "shown"                : true,
      "FHYearOfBirth"        :"",
      "listofDistrict"       :[],
      "listofBlocks"         :[],
      "listofVillages"       :[],
      fields: {},
      errors: {},
      "tableObjects"         : {
        apiLink               : '/api/families/',
        editUrl               : '/family',      
        paginationApply       : false,
        // searchApply           : true,
        downloadApply         : true,
      },
      "tableHeading"          : {
        familyID              : "Family ID",
        surnameOfFH           : "Surname",
        firstNameOfFH         : "FirstName",
        middleNameOfFH        : "MiddleName",
        // nameOfFH              : "Name of Family Head",
        isUpgraded            : "Upgraded",        
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
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
      // "startRange"            : 0,
      // "limitRange"            : 10000,
      "editId"                : this.props.match.params ? this.props.match.params.id : '',    
      fileDetailUrl           : "/api/families/get/filedetails/",
      goodRecordsTable        : [],
      failedRecordsTable      : [],
      goodRecordsHeading :{
        familyID              : "Family ID",
        surnameOfFH           : "Surname",
        firstNameOfFH         : "FirstName",
        middleNameOfFH        : "MiddleName",
        // nameOfFH              : "Name of Family Head",
        uidNumber             : "UID Number",
        contactNumber         : "Contact Number",
        caste                 : "Caste",
        landCategory          : "Land holding Category",        
        incomeCategory        : "Income Category",        
        specialCategory       : "Special Category",        
        dist                  : "District",
        block                 : "Block",
        village               : "Village"
      },
      failedtableHeading :{
        familyID              : "Family ID",
        surnameOfFH           : "Surname",
        firstNameOfFH         : "FirstName",
        middleNameOfFH        : "MiddleName",
        // nameOfFH              : "Name of Family Head",
        uidNumber             : "UID Number",
        contactNumber         : "Contact Number",
        caste                 : "Caste",
        landCategory          : "Land holding Category",        
        incomeCategory        : "Income Category",        
        specialCategory       : "Special Category",        
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
        failedRemark          :  "Failed Data Remark"
      }
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
    this.getSearchText = this.getSearchText.bind(this);
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);
      })
      if(nextProps){
        this.getLength();
      }    
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
      }  
      this.getData(inputGetData);
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getAvailableCenter(this.state.center_ID);
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
      }
      // console.log("Did", inputGetData);
      this.getData(inputGetData);
    }); 

    $.validator.addMethod("regxUID", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Aadhar Number.");
    $.validator.addMethod("regxcontact", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter a valid Contact Number.");
       $.validator.addMethod("regxsurnameOfFH", function(value, element, regexpr) {         
      return regexpr.test(value); 
    }, "Please enter a valid Surname.");
       $.validator.addMethod("regxfirstNameOfFH", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter a valid First Name.");
    //    $.validator.addMethod("regxmiddleNameOfFH", functio n(value, element, regexpr) {         
    //   return regexpr.test(value);
    // }, "Please enter a valid Middle Name.");
    $("#createFamily").validate({
      rules: {
        district: {
          required: true,
        },
        block: {
          required: true,
        },
        uID: {
          // required: true,
          regxUID: /^[_0-9]*((-|\s)*[_0-9]){12}$|^$/,
        },
        caste: {
          // required: true,
        },
        surnameOfFH: {
          required: true,
          regxsurnameOfFH:/^[A-za-z']+( [A-Za-z']+)*$/,

        },
        firstNameOfFH: {
          required: true,
          regxfirstNameOfFH:/^[A-za-z']+( [A-Za-z']+)*$/,

        },
        middleNameOfFH: {
          // required: true,
          // regxmiddleNameOfFH:/^[A-za-z']+( [A-Za-z']+)*$/,

        },
        village: {
          required: true,

        },
        contact: {
          // required: true,
          maxlength: 10,
          minlength: 10,
        // regxcontact: /^\+?\d+$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "district"){
          error.insertAfter("#districtErr");
        }
        if (element.attr("name") === "block"){
          error.insertAfter("#blockErr");
        }
        if (element.attr("name") === "uID"){
          error.insertAfter("#uIDErr");
        }
        if (element.attr("name") === "caste"){
          error.insertAfter("#casteErr");
        }
        if (element.attr("name") === "surnameOfFH"){
          error.insertAfter("#surnameOfFHErr");
        }
        if (element.attr("name") === "firstNameOfFH"){
          error.insertAfter("#firstNameOfFHErr");
        }
        if (element.attr("name") === "middleNameOfFH"){
          error.insertAfter("#middleNameOfFHErr");
        }
        if (element.attr("name") === "village"){
          error.insertAfter("#villageErr");
        }
        if (element.attr("name") === "contact"){
          error.insertAfter("#contactErr");
        }
      }
    });
  } 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "uID"                  :this.refs.uID.value, 
      "caste"                :this.refs.caste.value, 
      "surnameOfFH"          :this.refs.surnameOfFH.value, 
      "firstNameOfFH"        :this.refs.firstNameOfFH.value, 
      "middleNameOfFH"       :this.refs.middleNameOfFH.value, 
      "specialCategory"      :this.refs.specialCategory.value, 
      "landCategory"         :this.refs.landCategory.value, 
      "incomeCategory"       :this.refs.incomeCategory.value, 
      "district"             :this.refs.district.value, 
      "block"                :this.refs.block.value, 
      "village"              :this.refs.village.value, 
      "FHGender"             :this.refs.FHGender.value,
      "contact"              :this.refs.contact.value,
    });
  }
  isTextKey(evt){
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    } 
  }
  SubmitFamily(event){    
    event.preventDefault();
    if($('#createFamily').valid()){
      var familyValues={
      "family_ID"            :this.state.editId, 
      "center_ID"            :this.state.center_ID,
      "center"               :this.state.centerName,
      "familyID"             :this.state.familyID,
      "surnameOfFH"          :this.refs.surnameOfFH.value, 
      "firstNameOfFH"        :this.refs.firstNameOfFH.value, 
      "middleNameOfFH"       :this.refs.middleNameOfFH.value ? this.refs.middleNameOfFH.value : "-", 
      "contactNumber"        :this.refs.contact.value ? this.refs.contact.value : "-", 
      "uidNumber"            :this.refs.uID.value ? this.refs.uID.value : "-", 
      "caste"                :this.refs.caste.value ? this.refs.caste.value : "-", 
      "landCategory"         :this.refs.landCategory.value ? this.refs.landCategory.value : "-", 
      "incomeCategory"       :this.refs.incomeCategory.value ? this.refs.incomeCategory.value : "-", 
      "specialCategory"      :this.refs.specialCategory.value ? this.refs.specialCategory.value : "-", 
      "dist"                 :this.refs.district.value, 
      "block"                :this.refs.block.value, 
      "village"              :this.refs.village.value, 
      "FHYearOfBirth"        :this.state.FHYearOfBirth ? (this.state.FHYearOfBirth).year(): "-",
      "FHGender"             :this.refs.FHGender.value ? this.refs.FHGender.value : "-",
      };
      axios.post('/api/families',familyValues)
      .then((response)=>{
          console.log('response', response);
        if(response.data.message==="UID Already Exists"){
          swal({
            title : response.data.message,
            text  : response.data.message
          });  
          this.setState({
            "uID"                  :"",
          });
        }else{
          this.setState({
            "shown"               : true,
            "familyID"             :"",
            "dist"                 :"",
            "district"             :"-- Select --",
            "block"                :"-- Select --",
            "village"              :"-- Select --",
            "listofVillages"       :[],
            "listofBlocks"         :[],
            "uID"                  :"",
            "LHWRFCentre"          :"",
            "state"                :"",
            "contact"              :"",        
            "surnameOfFH"          :"",
            "firstNameOfFH"        :"",
            "middleNameOfFH"       :"",
            "caste"                :"-- Select --",
            "incomeCategory"       :"-- Select --",
            "landCategory"         :"-- Select --",
            "specialCategory"      :"-- Select --",
            "FHGender"             :"",
            "date"                 :"",
            "FHYearOfBirth"        :"",
            // "FHGender"             :"-- Select --",
          });
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        }
        var inputGetData = {
          "center_ID"       : this.state.center_ID,
          "caste"           : this.state.casteFilter,
          "district"        : this.state.districtFilter,
          "blocks"          : this.state.blockFilter,
          "village"         : this.state.villageFilter, 
          "specialCategory" : this.state.specialCategoryFilter,
          "landCategory"    : this.state.landCategoryFilter,
          "incomeCategory"  : this.state.incomeCategoryFilter,
        }
        this.getData(inputGetData);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }    
  }
  UpdateFamily(event){
    event.preventDefault();
    if($('#createFamily').valid()){
      var familyValues = {
        "family_ID"            :this.state.editId, 
        "center_ID"            :this.state.center_ID,
        "center"               :this.state.centerName,
        "familyID"             :this.state.familyID,
        "surnameOfFH"          :this.refs.surnameOfFH.value, 
        "firstNameOfFH"        :this.refs.firstNameOfFH.value, 
        "middleNameOfFH"       :this.refs.middleNameOfFH.value ? this.refs.middleNameOfFH.value : "-", 
        "contactNumber"        :this.refs.contact.value ? this.refs.contact.value : "-", 
        "uidNumber"            :this.refs.uID.value ? this.refs.uID.value : "-", 
        "caste"                :this.refs.caste.value ? this.refs.caste.value : "-", 
        "landCategory"         :this.refs.landCategory.value ? this.refs.landCategory.value : "-", 
        "incomeCategory"       :this.refs.incomeCategory.value ? this.refs.incomeCategory.value : "-", 
        "specialCategory"      :this.refs.specialCategory.value ? this.refs.specialCategory.value : "-", 
        "dist"                 :this.refs.district.value, 
        "block"                :this.refs.block.value, 
        "village"              :this.refs.village.value, 
        "FHYearOfBirth"        :this.state.FHYearOfBirth ? (this.state.FHYearOfBirth).year(): "-",
        "FHGender"             :this.refs.FHGender.value ? this.refs.FHGender.value : "-",
      };
      axios.patch('/api/families/update', familyValues)
        .then((response)=>{
          if(response.data.message==="UID Already Exists"){
            swal({
              title : response.data.message,
              text  : response.data.message
            });  
            this.setState({
              "uID"                  :"",
              "editId"               : "",
            });
          }else{
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.setState({
              "shown"               : true,
              "familyID"             :"",
              "uID"                  :"",
              "dist"                 :"",
              "caste"                :"-- Select --",
              "district"             :"-- Select --",
              "block"                :"-- Select --",
              "village"              :"-- Select --",
              "incomeCategory"       :"-- Select --",
              "landCategory"         :"-- Select --",
              "specialCategory"      :"-- Select --",
              "listofVillages"       :[],
              "listofBlocks"         :[],
              "LHWRFCentre"          :"",
              "state"                :"",
              "contact"              :"",        
              "surnameOfFH"          :"",
              "firstNameOfFH"        :"",
              "middleNameOfFH"       :"",
              "FHGender"             :"",
              "FHYearOfBirth"        :"",
              "date"                 :"",
              "editId"               : "",
              // "FHGender"             :"-- Select --",
            });
            this.props.history.push('/family');
          }          
          var inputGetData = {
            "center_ID"       : this.state.center_ID,
            "caste"           : this.state.casteFilter,
            "district"        : this.state.districtFilter,
            "blocks"          : this.state.blockFilter,
            "village"         : this.state.villageFilter, 
            "specialCategory" : this.state.specialCategoryFilter,
            "landCategory"    : this.state.landCategoryFilter,
            "incomeCategory"  : this.state.incomeCategoryFilter,
          }
          this.getData(inputGetData);
        })
        .catch(function(error){
          console.log("error"+error);
        });
    }    
  }
  getAvailableVillages(){
    axios({
      method: 'get',
      url: '/api/centers/'+this.state.center_ID,
      })
    .then((response)=> {
      function removeDuplicates(data, param, district, block){
        return data.filter(function(item, pos, array){
          return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
        })
      }
      var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.district,this.state.block);
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
      availablevillageInCenter.sort(dynamicSort("village"));
      this.setState({
        listofVillages   : availablevillageInCenter,
      })
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  getAvailableBlocks(){
    axios({
      method: 'get',
      url: '/api/centers/'+this.state.center_ID,
      }).then((response)=> {
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
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
        availableblockInCenter.sort(dynamicSort("block"));
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
  }
  edit(id){
    if(id && id !== undefined){
      axios({
        method: 'get',
        url: '/api/families/'+id,
      }).then((response)=> {
        console.log('editData',response);
        var editData = response.data[0];
        // console.log('editData',editData.center_ID);
        this.getAvailableCenter(editData.center_ID);
        this.getAvailableVillages();
        this.getAvailableBlocks();
        if(editData){
          this.setState({
            "familyID"              : editData.familyID,
            "surnameOfFH"           : editData.surnameOfFH,
            "firstNameOfFH"         : editData.firstNameOfFH,
            "middleNameOfFH"        : editData.middleNameOfFH,
            "FHGender"              : editData.FHGender, 
            "date"                  : editData.FHYearOfBirth, 
            "contact"               : editData.contactNumber,
            "uID"                   : editData.uidNumber,
            "caste"                 : editData.caste,
            "category"              : editData.familyCategory, 
            "incomeCategory"        : editData.incomeCategory,
            "landCategory"          : editData.landCategory,
            "specialCategory"       : editData.specialCategory,
            "district"              : editData.dist, 
            "block"                 : editData.block, 
            "village"               : editData.village, 
            "shown"                   : false,
          },()=>{
            this.getAvailableCenter(this.state.center_ID);
          });
          let fields = this.state.fields;
          let errors = {};
          let formIsValid = true;
          this.setState({
            errors: errors
          });
          return formIsValid;
        }else{
          this.setState({
            "shown"               : true,
            "familyID"             :"",
            "caste"                :"",
            "district"             :"-- Select --",
            "block"                :"-- Select --",
            "village"              :"-- Select --",
            "uID"                  :"",
            "LHWRFCentre"          :"",
            "state"                :"",
            "contact"              :"",        
            "surnameOfFH"          :"",
            "firstNameOfFH"        :"",
            "middleNameOfFH"       :"",
            "incomeCategory"       :"",
            "landCategory"         :"",
            "FHGender"             :"",
            "specialCategory"      :"",
            "date"                 :"",
            "FHYearOfBirth"        :"",
            // "FHGender"             :"-- Select --",
          });
        }    
      })
      .catch(function(error){ 
        console.log("error"+error);
      });
    }
  }
  toglehidden(){   
    this.setState({
     shown: !this.state.shown
    });
  }
  uploadedData(data){
    var inputGetData = {
      "center_ID"       : this.state.center_ID,
      "caste"           : this.state.casteFilter,
      "district"        : this.state.districtFilter,
      "blocks"          : this.state.blockFilter,
      "village"         : this.state.villageFilter, 
      "specialCategory" : this.state.specialCategoryFilter,
      "landCategory"    : this.state.landCategoryFilter,
      "incomeCategory"  : this.state.incomeCategoryFilter,
    }
    this.getData(inputGetData);
  }
  getLength(center_ID){
    axios.get('/api/families/count/'+center_ID)
    .then((response)=>{
      this.setState({
        dataCount : response.data.dataLength
      })
    })
    .catch(function(error){
    });
  }
  getData(inputGetData){ 
    console.log("inputGetData",inputGetData);
    this.setState({
      propsdata : inputGetData
    })
    if (inputGetData){
      $(".fullpageloader").show();
      // axios.post('/api/families/list/'+center_ID,data)
      axios.post('/api/families/get/family/list',inputGetData)
      .then((response)=>{
        $(".fullpageloader").hide();
        console.log('response', response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                   : a._id,
            familyID              : a.familyID,
            surnameOfFH           : a.surnameOfFH,
            firstNameOfFH         : a.firstNameOfFH,
            middleNameOfFH        : a.middleNameOfFH,
            isUpgraded            : a.isUpgraded,
            dist                  : a.dist,
            block                 : a.block,
            village               : a.village,
          }
        })
        this.setState({
          tableData : tableData,
          downloadData : tableData,
        })
      })    
      .catch(function(error){      
        console.log("error"+error);
      }); 
    }
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
  getAvailableCenter(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        // console.log('response',response);
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
              if(sortOrder === -1){
                return b[property].localeCompare(a[property]);
              }else{
                return a[property].localeCompare(b[property]);
              }        
            }
          }
          availableDistInCenter.sort(dynamicSort("district"));
          this.setState({
            listofDistrict  : availableDistInCenter,
          })
        }
      }).catch(function (error) {
        console.log("error"+error);
      });
  }
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    this.setState({
      district       : district,
    },()=>{
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
          var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
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
          availableblockInCenter.sort(dynamicSort("block"));
          this.setState({
            listofBlocks     : availableblockInCenter,
            block : '-- Select --',
          })
        }).catch(function (error) {
          console.log("error = ",error);
        });
      })
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block          : block,
    },()=>{
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.district,this.state.block);
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
        availablevillageInCenter.sort(dynamicSort("village"));
        this.setState({
          listofVillages   : availablevillageInCenter.sort(),
          village : "-- Select --"
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village       : village,
    });  
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
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
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
              if(sortOrder === -1){
                  return b[property].localeCompare(a[property]);
              }else{
                  return a[property].localeCompare(b[property]);
              }        
            }
          }
          availableblockInCenter.sort(dynamicSort("block"));
          console.log("availableblockInCenter",availableblockInCenter);
          this.setState({
            listofBlocks     : availableblockInCenter,
            block            : '-- Select --',
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
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
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
            if(sortOrder === -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
          }
        }
        availablevillageInCenter.sort(dynamicSort("village"));
        // console.log("availablevillageInCenter",availablevillageInCenter);
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
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
      }
      this.getData(inputGetData);
    });  
  } 
  getFileDetails(fileName){
      axios
      .get(this.state.fileDetailUrl+this.state.center_ID+"/"+fileName)
      .then((response)=> {
        console.log("response============",response)
      // $('.fullpageloader').hide();  
      if (response) {
        this.setState({
            fileDetails:response.data,
            failedRecordsCount : response.data.failedRecords.length,
            goodDataCount : response.data.goodrecords.length
        });

          var tableData = response.data.goodrecords.map((a, i)=>{
           
          return{
              "familyID"        : a.familyID        ? a.familyID    : '-',
              "surnameOfFH"     : a.surnameOfFH,
              "firstNameOfFH"   : a.firstNameOfFH,
              "middleNameOfFH"  : a.middleNameOfFH,
              // "nameOfFH"        : a.middleNameOfFH  ? a.surnameOfFH+' '+a.firstNameOfFH+' '+a.middleNameOfFH : a.surnameOfFH+' '+a.firstNameOfFH,
              "uidNumber"       : a.uidNumber     ? a.uidNumber : '-',
              "contactNumber"   : a.contactNumber     ? a.contactNumber : '-',
              "caste"           : a.caste     ? a.caste : '-',
              "landCategory"    : a.landCategory     ? a.landCategory : '-',
              "incomeCategory"  : a.incomeCategory     ? a.incomeCategory : '-',
              "specialCategory" : a.specialCategory     ? a.specialCategory : '-',
              "dist"            : a.dist ? a.dist : '-',
              "block"           : a.block ? a.block : '-', 
              "village"         : a.village     ? a.village : '-'
          }
        })
        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
            "familyID"          : a.familyID        ? a.familyID    : '-',
            "surnameOfFH"       : a.surnameOfFH,
            "firstNameOfFH"     : a.firstNameOfFH,
            "middleNameOfFH"    : a.middleNameOfFH,
            // "nameOfFH"        : a.middleNameOfFH  ? a.surnameOfFH+' '+a.firstNameOfFH+' '+a.middleNameOfFH : a.surnameOfFH+' '+a.firstNameOfFH,
            "uidNumber"         : a.uidNumber     ? a.uidNumber : '-',
            "contactNumber"     : a.contactNumber     ? a.contactNumber : '-',
            "caste"             : a.caste     ? a.caste : '-',
            "landCategory"      : a.landCategory     ? a.landCategory : '-',
            "incomeCategory"    : a.incomeCategory     ? a.incomeCategory : '-',
            "specialCategory"   : a.specialCategory     ? a.specialCategory : '-',
            "dist"              : a.dist ? a.dist : '-',
            "block"             : a.block ? a.block : '-', 
            "village"           : a.village     ? a.village : '-',
            "failedRemark"      : a.failedRemark     ? a.failedRemark : '-'
        }
        })
        this.setState({
            goodRecordsTable : tableData,
            failedRecordsTable : failedRecordsTable
        })
      }
      })
      .catch((error)=> { 
        console.log('error', error);
      }) 
  } 
  getSearchText(searchText){
    var searchText = searchText;
    // console.log('searchText',searchText)
    var formValues ={
      searchText : searchText,
    }
    if(searchText) {
      axios
      .post('/api/families/searchValue/'+this.state.center_ID,formValues)
      .then(
        (res)=>{
          // console.log('res', res);
          if(res.data.data&&res.data.data.length>0){
            var tableData = res.data.data.map((a, i)=>{
              return {
                _id                   : a._id,
                familyID              : a.familyID,
                surnameOfFH           : a.surnameOfFH,
                firstNameOfFH         : a.firstNameOfFH,
                middleNameOfFH        : a.middleNameOfFH,
                // nameOfFH              : a.surnameOfFH+" "+a.firstNameOfFH+" "+a.middleNameOfFH,
                FHGender              : a.FHGender,
                FHYearOfBirth         : a.FHYearOfBirth,
                uidNumber             : a.uidNumber,
                contactNumber         : a.contactNumber,
                caste                 : a.caste,
                incomeCategory        : a.incomeCategory,
                landCategory          : a.landCategory,
                specialCategory       : a.specialCategory,
                dist                  : a.dist,
                block                 : a.block,
                village               : a.village,
              }
            })
          }
        this.setState({
          tableData     : tableData,          
        })
      }).catch((error)=>{ 
        console.log('error',error)
        // swal("No results found","","error");
        this.setState({
          tableData     : [],          
        })
      });
    }
  }
  handleYear(date){
    // console.log("date",date);
    this.setState({
      FHYearOfBirth    : date,
      date             : date,
    });
  };
  handleFilters(event){
    event.preventDefault();
    this.setState({
      "casteFilter"                :this.refs.casteFilter.value, 
      "specialCategoryFilter"      :this.refs.specialCategoryFilter.value, 
      "landCategoryFilter"         :this.refs.landCategoryFilter.value, 
      "incomeCategoryFilter"       :this.refs.incomeCategoryFilter.value, 
      "districtFilter"             :this.refs.districtFilter.value, 
      "blockFilter"                :this.refs.blockFilter.value, 
      "villageFilter"              :this.refs.villageFilter.value, 
    },()=>{
      var inputGetData = {
        "center_ID"       : this.state.center_ID,
        "caste"           : this.state.casteFilter,
        "district"        : this.state.districtFilter,
        "blocks"          : this.state.blockFilter,
        "village"         : this.state.villageFilter, 
        "specialCategory" : this.state.specialCategoryFilter,
        "landCategory"    : this.state.landCategoryFilter,
        "incomeCategory"  : this.state.incomeCategoryFilter,
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
                      Family Management
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                   
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <IAssureTable 
                      // tableName = "Family"
                      // id = "Family"
                      downloadtableHeading={this.state.downloadtableHeading}
                      downloadData={this.state.downloadData}
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      data={this.state.propsdata}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}                          
                      getSearchText={this.getSearchText}
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