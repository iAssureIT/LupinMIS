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
      "caste"                :"",
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
      "middleNameOfFH"       :"",
      "incomeCategory"       :"",
      "FHGender"             :"",
      "landCategory"         :"",
      "specialCategory"      :"",
      "date"                 :"",
      "shown"                : true,
      "FHYearOfBirth"        :"",
      // "FHGender"             :"-- Select --",
      "listofDistrict"       :[],
      "listofBlocks"         :[],
      "listofVillages"       :[],
      fields: {},
      errors: {},
      "tableObjects"         : {
        apiLink               : '/api/families/',
        editUrl               : '/family',      
        paginationApply       : false,
        searchApply           : true,
        downloadApply         : true,
      },
      "tableHeading"          : {
        familyID              : "Family ID",
        nameOfFH              : "Name of Family Head",
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
      // "startRange"            : 0,
      // "limitRange"            : 10000,
      "editId"                : this.props.match.params ? this.props.match.params.id : '',    
      fileDetailUrl           : "/api/families/get/filedetails/",
      goodRecordsTable        : [],
      failedRecordsTable      : [],
      goodRecordsHeading :{
        familyID              : "Family ID",
        nameOfFH              : "Name of Family Head",
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
          nameOfFH              : "Name of Family Head",
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
    this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
    }
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerID    : center_ID,
      centerName   : centerName,
    },()=>{
      // console.log(this.state.centerID);
      this.getAvailableCenter(this.state.center_ID);
      this.getLength(this.state.center_ID);
      this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
      // console.log(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
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
      "middleNameOfFH"       :this.refs.middleNameOfFH.value, 
      "contactNumber"        :this.refs.contact.value, 
      "uidNumber"            :this.refs.uID.value, 
      "caste"                :this.refs.caste.value, 
      "landCategory"         :this.refs.landCategory.value, 
      "incomeCategory"       :this.refs.incomeCategory.value, 
      "specialCategory"      :this.refs.specialCategory.value, 
      "dist"                 :this.refs.district.value, 
      "block"                :this.refs.block.value, 
      "village"              :this.refs.village.value, 
      "FHYearOfBirth"        :(this.state.FHYearOfBirth).year(),
      "FHGender"             :this.refs.FHGender.value,
    };
    axios.post('/api/families',familyValues)
      .then((response)=>{
        if(response.data.message==="UID Already Exists"){
          console.log('response', response);
          this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
          swal({
            title : response.data.message,
            text  : response.data.message
          });  
          this.setState({
            "uID"                  :"",
          });
        }else{
          // console.log('response', response);
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
          this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        }
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
        "middleNameOfFH"       :this.refs.middleNameOfFH.value, 
        "contactNumber"        :this.refs.contact.value, 
        "uidNumber"            :this.refs.uID.value, 
        "caste"                :this.refs.caste.value, 
        "landCategory"         :this.refs.landCategory.value, 
        "incomeCategory"       :this.refs.incomeCategory.value, 
        "specialCategory"      :this.refs.specialCategory.value, 
        "dist"                 :this.refs.district.value, 
        "block"                :this.refs.block.value, 
        "village"              :this.refs.village.value, 
        "FHYearOfBirth"        :(this.state.FHYearOfBirth).year(),
        "FHGender"             :this.refs.FHGender.value,
      };
      axios.patch('/api/families/update', familyValues)
        .then((response)=>{
          if(response.data.message==="UID Already Exists"){
            // console.log('response', response);
            this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
            swal({
              title : response.data.message,
              text  : response.data.message
            });  
            this.setState({
              "uID"                  :"",
            });
          }else{
            this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.setState({
              "shown"               : true,
              "familyID"             :"",
              "uID"                  :"",
              "caste"                :"",
              "district"             :"-- Select --",
              "block"                :"-- Select --",
              "village"              :"-- Select --",
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
              "FHYearOfBirth"        :"",
              "date"                 :"",
              // "FHGender"             :"-- Select --",
            });
          }
        })
        .catch(function(error){
          console.log("error"+error);
        });
      this.props.history.push('/family');
      this.setState({
        "editId"               : "",
      });
    }    
  }
  getAvailableVillages(){
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
        // console.log('availableblockInCenter ==========',response);
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
        // console.log("availableblockInCenter",availableblockInCenter);
      }).catch(function (error) {
        console.log("error = ",error);
      });
  }
  edit(id){
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
          // console.log('editdistrict',this.state.district);
        });
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        this.setState({
          errors: errors
        });
        return formIsValid;
      }
    })
    .catch(function(error){ 
      console.log("error"+error);
    });
  }

  toglehidden(){   
    this.setState({
     shown: !this.state.shown
    });
  }
  uploadedData(data){
    this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter )
  }

  getLength(center_ID){
    axios.get('/api/families/count/'+center_ID)
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
      })
    })
    .catch(function(error){
      // console.log("error"+error);
    });
  }
  getData(centerID, casteFilter, districtFilter, blockFilter, villageFilter, specialCategoryFilter, landCategoryFilter, incomeCategoryFilter){ 
    var data = {
      "center_ID"       : centerID,
      "caste"           : casteFilter,
      "district"        : districtFilter,
      "blocks"          : blockFilter,
      "village"         : villageFilter, 
      "specialCategory" : specialCategoryFilter,
      "landCategory"    : landCategoryFilter,
      "incomeCategory"  : incomeCategoryFilter,
    }
    // console.log("data",data)
    this.setState({
      propsdata : data
    },()=>{
    console.log("propsdata",this.state.propsdata)
    })
    if (centerID){
    $(".fullpageloader").show();
      // axios.post('/api/families/list/'+center_ID,data)
      axios.post('/api/families/get/family/list',data)
      .then((response)=>{
        $(".fullpageloader").hide();
        console.log('response', response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                   : a._id,
            familyID              : a.familyID,
            nameOfFH              : a.nameOfFH,
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
        this.setState({
          propsdata : data,
          tableData : tableData
        })
      })    
      .catch(function(error){      
        console.log("error"+error);
      }); 
    }
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
          this.setState({
            listofDistrict  : availableDistInCenter,
            // address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
            // address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
            // districtsCovered : response.data[0].districtsCovered
          },()=>{
          // var stateCode =this.state.address.split('|')[0];
           // this.setState({
            // stateCode  : stateCode,
            // },()=>{
            // this.getDistrict(this.state.stateCode, this.state.districtsCovered);
            // });
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
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    this.setState({
      district       : district,
      districtFilter : district,
      blockFilter    : "all",
      villageFilter  : "all",
    },()=>{
      this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter )
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
          // console.log('availableblockInCenter ==========',response);
          function removeDuplicates(data, param, district){
            return data.filter(function(item, pos, array){
              return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
            })
          }
          var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
          this.setState({
            listofBlocks     : availableblockInCenter,
            block : '-- Select --',
          },()=>{
            // console.log('this.state.listofBlocks',this.state.listofBlocks);
            // console.log('this.state.block',this.state.block);
          })
        }).catch(function (error) {
          console.log("error = ",error);
        });
        // console.log('selectedDistrict,listofBlocks',this.state.selectedDistrict,this.state.listofVillages);
        // this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
  }
  // getBlock(stateCode, selectedDistrict){
  //   console.log("sd", stateCode,selectedDistrict);
  //   axios({
  //     method: 'get',
  //     // url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/'+stateCode+'/IN',
  //     url: 'http://locationapi.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
  //   }).then((response)=> {
  //       // console.log('response ==========', response.data);
  //       this.setState({
  //         listofBlocks : response.data
  //       },()=>{
  //       // console.log('listofBlocks', this.state.listofBlocks);
  //       })
  //   }).catch(function (error) {
  //     console.log('error', error);
  //   });
  // }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block          : block,
      blockFilter    : block,
      villageFilter  : "all",
    },()=>{
      this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter )
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
        this.setState({
          listofVillages   : availablevillageInCenter,
          village : "-- Select --"
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
      // console.log("block",block);
      // this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
    });
  }
  // getVillages(stateCode, selectedDistrict, block){
  //   // console.log(stateCode, selectedDistrict, block);
  //   axios({
  //     method: 'get',
  //     // url: 'http://locationapi.iassureit.com/api/cities/get/list/'+block+'/'+selectedDistrict+'/'+stateCode+'/IN',
  //     url: 'http://locationapi.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+block,
  //   }).then((response)=> {
  //       // console.log('response ==========', response.data);
  //       this.setState({
  //         listofVillages : response.data
  //       },()=>{
  //       // console.log('listofVillages', this.state.listofVillages);
  //       })
  //   }).catch(function (error) {
  //     console.log('error', error);
  //   });
  // }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village       : village,
      villageFilter : village
    },()=>{
      this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter )
      // console.log("village",village);
    });  
  } 
  getFileDetails(fileName){
      axios
      .get(this.state.fileDetailUrl+this.state.center_ID+"/"+fileName)
      .then((response)=> {
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
              "nameOfFH"        : a.nameOfFH        ? a.nameOfFH    : '-',
              "uidNumber"       : a.uidNumber     ? a.uidNumber : '-',
              "contactNumber"   : a.contactNumber     ? a.contactNumber : '-',
              "caste"           : a.caste     ? a.caste : '-',
              "landCategory"   : a.landCategory     ? a.landCategory : '-',
              "incomeCategory"      : a.incomeCategory     ? a.incomeCategory : '-',
              "specialCategory"   : a.specialCategory     ? a.specialCategory : '-',
              "dist" : a.dist ? a.dist : '-',
              "block" : a.block ? a.block : '-', 
              "village"   : a.village     ? a.village : '-'
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
            "familyID"        : a.familyID        ? a.familyID    : '-',
            "nameOfFH"       : a.nameOfFH        ? a.nameOfFH    : '-',
            "uidNumber"      : a.uidNumber     ? a.uidNumber : '-',
            "contactNumber"         : a.contactNumber     ? a.contactNumber : '-',
            "caste"   : a.caste     ? a.caste : '-',
            "landCategory"   : a.landCategory     ? a.landCategory : '-',
            "incomeCategory"      : a.incomeCategory     ? a.incomeCategory : '-',
            "specialCategory"   : a.specialCategory     ? a.specialCategory : '-',
            "dist" : a.dist ? a.dist : '-',
            "block" : a.block ? a.block : '-', 
            "village"   : a.village     ? a.village : '-',
            "failedRemark"   : a.failedRemark     ? a.failedRemark : '-'
            
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
                nameOfFH              : a.surnameOfFH+" "+a.firstNameOfFH+" "+a.middleNameOfFH,
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
    console.log("date",date);
    this.setState({
      FHYearOfBirth    : date,
      date             : date,
    },()=>{
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
      this.getData(this.state.centerID, this.state.casteFilter, this.state.districtFilter, this.state.blockFilter, this.state.villageFilter, this.state.specialCategoryFilter, this.state.landCategoryFilter, this.state.incomeCategoryFilter);
      // this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.caste, this.state.specialCategory, this.state.landCategory, this.state.incomeCategory, this.state.district, this.state.block, this.state.village);
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
                    <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manual">Manual</a></li>
                    <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulk">Bulk Upload</a></li>
                  </ul>

                  <div className="tab-content ">
                    <div id="manual"  className="tab-pane fade in active ">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt"> 
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-right">
                            <button type="button" className="btn addBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.toglehidden.bind(this)}>Add Family</button>
                        </div> 
                      </div>
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="createFamily" style={hidden}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box_Filter">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                              Create New Family
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Surname </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="surnameOfFHErr" >
                                <input type="text" className="form-control inputBox" ref="surnameOfFH" name="surnameOfFH" value={this.state.surnameOfFH}  onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.surnameOfFH}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">First Name </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="firstNameOfFHErr" >
                                <input type="text" className="form-control inputBox" ref="firstNameOfFH" name="firstNameOfFH" value={this.state.firstNameOfFH} onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.firstNameOfFH}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Middle Name </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="middleNameOfFHErr" >
                                <input type="text" className="form-control inputBox" ref="middleNameOfFH" name="middleNameOfFH" value={this.state.middleNameOfFH} onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.middleNameOfFH}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Gender</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="FHGenderErr" >
                                <select className="custom-select form-control inputBox" ref="FHGender" name="FHGender" value={this.state.FHGender} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option>Female</option>
                                  <option>Male</option>
                                  <option>Transgender</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Birth Year</label>
                              <div className="">
                                <Datetime 
                                  dateFormat="YYYY"
                                  name="FHYearOfBirth" 
                                  id="FHYearOfBirthErr"
                                  value={this.state.date}
                                  closeOnSelect={true}
                                  onChange={this.handleYear.bind(this)} 
                                  className="inputBox-main" 
                                />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uIDErr" >
                                <input type="number" className="form-control inputBox "  placeholder=""ref="uID" name="uID" value={this.state.uID}  maxLength = "12" onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.uID}</div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Contact Number </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="contactErr" >
                                <input type="number" className="form-control inputBox "  placeholder=""ref="contact" name="contact" value={this.state.contact}  maxLength="10" onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.contact}</div>
                            </div>  
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Caste</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="casteErr" >
                                <select className="custom-select form-control inputBox" ref="caste" name="caste" value={this.state.caste} onChange={this.handleChange.bind(this)}>
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option>General</option>
                                  <option>SC</option>
                                  <option>ST</option>
                                  <option>NT</option>
                                  <option>Other</option>                              
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.caste}</div>
                            </div>                      
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Land holding Category</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="landCategory" >
                                <select className="custom-select form-control inputBox"ref="landCategory" name="landCategory" value={this.state.landCategory} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option>Big Farmer</option>
                                  <option>Landless</option>
                                  <option>Marginal Farmer</option>
                                  <option>Small Farmer</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.landCategory}</div>
                            </div>                          
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Income Category </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="incomeCategory" >
                                <select className="custom-select form-control inputBox" ref="incomeCategory" name="incomeCategory" value={this.state.incomeCategory} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option>APL</option>
                                  <option>BPL</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.incomeCategory}</div>
                            </div>                          
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Special Category</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="specialCategory" >
                                <select className="custom-select form-control inputBox" ref="specialCategory" name="specialCategory" value={this.state.specialCategory} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option>Normal</option>
                                  <option>Differently Abled</option>
                                  <option>Veerangana</option>
                                  <option>Widow Headed</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.specialCategory}</div>
                            </div>            
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">District</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtErr" >
                                <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                                  <option selected='true' disabled="disabled" >-- Select --</option>
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
                              <div className="errorMsg">{this.state.errors.district}</div>
                            </div>
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Block</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blockErr" >
                                <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block?this.state.block:""} onChange={this.selectBlock.bind(this)} >
                                  <option selected='true'  disabled="disabled" >-- Select --</option>
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
                              <div className="errorMsg">{this.state.errors.block}</div>
                            </div>
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Village</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="villageErr" >
                              {/*console.log("this.state.village",this.state.village)*/}
                                <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village?this.state.village:""} onChange={this.selectVillage.bind(this)}  >
                                  <option selected='true' disabled="disabled" >-- Select --</option>
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
                              <div className="errorMsg">{this.state.errors.village}</div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <br/>
                              {
                                this.state.editId ? 
                                <button className=" col-lg-2 btn submit  pull-right" onClick={this.UpdateFamily.bind(this)}> Update </button>
                                :
                                <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitFamily.bind(this)}> Submit </button>
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
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box  ">
                              <label className="formLable">Caste</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="casteErr" >
                                <select className="custom-select form-control inputBox" ref="casteFilter" name="casteFilter" value={this.state.casteFilter} onChange={this.handleFilters.bind(this)}>
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  <option>General</option>
                                  <option>SC</option>
                                  <option>ST</option>
                                  <option>NT</option>
                                  <option>Other</option>                              
                                </select>
                              </div>
                            </div>                      
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Land holding Category</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="landCategory" >
                                <select className="custom-select form-control inputBox"ref="landCategoryFilter" name="landCategoryFilter" value={this.state.landCategoryFilter} onChange={this.handleFilters.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  <option>Big Farmer</option>
                                  <option>Landless</option>
                                  <option>Marginal Farmer</option>
                                  <option>Small Farmer</option>
                                </select>
                              </div>
                            </div>                          
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Income Category </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="incomeCategory" >
                                <select className="custom-select form-control inputBox" ref="incomeCategoryFilter" name="incomeCategoryFilter" value={this.state.incomeCategoryFilter} onChange={this.handleFilters.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  <option>APL</option>
                                  <option>BPL</option>
                                </select>
                              </div>
                            </div>                          
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Special Category</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="specialCategory" >
                                <select className="custom-select form-control inputBox" ref="specialCategoryFilter" name="specialCategoryFilter" value={this.state.specialCategoryFilter} onChange={this.handleFilters.bind(this)}  >
                                  <option selected='true' value="" disabled="disabled" >-- Select --</option>
                                  <option value="all">All</option>
                                  <option>Normal</option>
                                  <option>Differently Abled</option>
                                  <option>Veerangana</option>
                                  <option>Widow Headed</option>
                                </select>
                              </div>
                            </div>            
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">District</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtErr" >
                                <select className="custom-select form-control inputBox" ref="districtFilter" name="districtFilter" value={this.state.districtFilter} onChange={this.districtChange.bind(this)}  >
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
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Block</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blockErr" >
                                <select className="custom-select form-control inputBox" ref="blockFilter" name="blockFilter" value={this.state.blockFilter?this.state.blockFilter:""} onChange={this.selectBlock.bind(this)} >
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
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Village</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="villageErr" >
                                <select className="custom-select form-control inputBox" ref="villageFilter" name="villageFilter" value={this.state.villageFilter?this.state.villageFilter:""} onChange={this.selectVillage.bind(this)}  >
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
                          tableName = "Family"
                          id = "Family"
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
                    <div id="bulk" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm mt">
                          <BulkUpload 
                            url="/api/families/bulk_upload_families" 
                            data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID}} 
                            uploadedData={this.uploadedData} 
                            fileurl="https://lupiniassureit.s3.ap-south-1.amazonaws.com/master/templates/Create-Family.xlsx"
                            fileDetailUrl={this.state.fileDetailUrl}
                            getFileDetails={this.getFileDetails}
                            propsdata={this.state.propsdata}
                            getData={this.getData.bind(this)}
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
export default Family