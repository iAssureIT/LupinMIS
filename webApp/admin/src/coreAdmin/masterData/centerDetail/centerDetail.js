import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import validate               from 'jquery-validation';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./centerDetail.css";
 
var centerDetailArray  = [];
class centerDetail extends Component{  
  constructor(props){
    super(props);
    this.state = {
      "typeOfCenter"             :"--Select Center--",
      "nameOfCenter"             :"",
      "address"                  :"",
      "state"                    :"--Select State--",
      "district"                 :"--Select District--",
      "pincode"                  :"",
      "centerInchargeName"       :"",
      "centerInchargeContact"    :"",
      "centerInchargeEmail"      :"",
      "MISCoordinatorName"       :"",
      "MISCoordinatorContact"    :"",
      "MISCoordinatorEmail"      :"",
      "districtCovered"          :"--Select District--",
      "blocksCovered"            :"--Select Block--",
      "centerDetailArray"        :[],
      "array"                    :[],
      "shown"                    : true,
      "tabtype"                  : "location",
      "fields"                   : {},
      "errors"                   : {},
      "listofStates"             : [],
      "listofDistrict"           : [],
      "listofBlocks"             : [],
      "listofVillages"           : [],
      "editlistofVillages"       : [],
      "selectedVillages"         : [],
      "stateCode"                : [],
      "twoLevelHeader"           : {
        apply                    : false,
        firstHeaderData          : [
                                      {
                                          heading : '',
                                          mergedColoums : 4
                                      },
                                      {
                                          heading : 'Center Incharge',
                                          mergedColoums : 3
                                      },
                                      {
                                          heading : 'MIS Coordinator',
                                          mergedColoums : 3
                                      },
                                    ]
      },
      "tableHeading"                : {
        type                      : "Center Type",
        centerName                : "Center Name",
        places                    : "Address",
        centerInchargeDetail      : "Center Incharge Details",
        misCoordinatorDetail      : "MIS Coordinator Details",
        numberofVillage           : "No of Villages",
        actions                   : 'Action',
      },
      "tableObjects"              : {
        deleteMethod              : 'delete',
        apiLink                   : '/api/centers/',
        paginationApply           : false,
        searchApply               : false,
        editUrl                   : '/center-details/'
      },
      "startRange"                : 0,
      "limitRange"                : 10000,
      "editId"                    : this.props.match.params ? this.props.match.params.id : ''
    }
    this.changeTab = this.changeTab.bind(this); 
  }
  handleclick(event){
  }
  handleChange(event){
    event.preventDefault();
    if(event.currentTarget.name==='district'){
      this.refs.pincode.value = '' 
    }
    this.setState({
      "typeOfCenter"             : this.refs.typeOfCenter.value,
      "nameOfCenter"             : this.refs.nameOfCenter.value,
      "address"                  : this.refs.address.value,
      "state"                    : this.refs.state.value,
      "district"                 : this.refs.district.value,
      "pincode"                  : this.refs.pincode.value,
      "centerInchargeName"       : this.refs.centerInchargeName.value,
      "centerInchargeContact"    : this.refs.centerInchargeContact.value,
      "centerInchargeEmail"      : this.refs.centerInchargeEmail.value,
      "MISCoordinatorName"       : this.refs.MISCoordinatorName.value,
      "MISCoordinatorContact"    : this.refs.MISCoordinatorContact.value,
      "MISCoordinatorEmail"      : this.refs.MISCoordinatorEmail.value,
      "districtCovered"          : this.refs.districtCovered.value,
      "blocksCovered"            : this.refs.blocksCovered.value,
    });    
  }
  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  isTextKey(evt)  {
   var charCode = (evt.which) ? evt.which : evt.keyCode;
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  Submit(event){
    event.preventDefault();
    if($("#Academic_details").valid()){
      var selectedVillages = this.state.selectedVillages;
      var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');
      var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
      var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});
      var id2 = this.state.uID;
      var centerDetail= 
      {
        "type_ID"                   : this.refs.typeOfCenter.value,
        "centerName"                : this.refs.nameOfCenter.value,
        "address"                   : {
          "addressLine"           : this.refs.address.value,
          "state"                 : this.refs.state.value.split('|')[0],
          "district"              : this.refs.district.value,
          "pincode"               : this.refs.pincode.value,
          "stateCode"             : this.refs.state.value.split('|')[1],
        },
        "districtsCovered"          : districtsCovered,
        "blocksCovered"             : blocksCovered,
        "villagesCovered"           : this.state.selectedVillages,
        "centerInchargeName"        : this.refs.centerInchargeName.value,
        "centerInchargeMobile"      : this.refs.centerInchargeContact.value,
        "centerInchargeEmail"       : this.refs.centerInchargeEmail.value,
        "misCoordinatorName"        : this.refs.MISCoordinatorName.value,
        "misCoordinatorMobile"      : this.refs.MISCoordinatorContact.value,
        "misCoordinatorEmail"       : this.refs.MISCoordinatorEmail.value,
      };

      // console.log("centerDetail",centerDetail);
      axios.post('/api/centers',centerDetail)
      .then((response)=>{
      // console.log('response',response);
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log('error',error);
      });

      this.setState({
        "typeOfCenter"              : "--Select Center--",
        "nameOfCenter"              : "",
        "address"                   : "",
        "state"                     : "--Select State--",
        "district"                  : "--Select District--",
        "pincode"                   : "",
        "centerInchargeName"        : "",
        "centerInchargeContact"     : "",
        "centerInchargeEmail"       : "",
        "MISCoordinatorName"        : "",
        "MISCoordinatorContact"     : "",
        "MISCoordinatorEmail"       : "",
        "districtCovered"           : "--Select District--",
        "blocksCovered"              : "--Select Block--",
        "selectedVillages"          : [],
        "listofDistrict"            : [],
        "listofBlocks"              : [],
        "listofVillages"            : [],
      });
      selectedVillages.map((a ,i)=>{this.setState({[a.village] : false})});
    }else{
      $('.error:first').focus()
    }
  }
  Update(event){
    event.preventDefault();
    if($("#Academic_details").valid()){
      var selectedVillages = this.state.selectedVillages;
      var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');
      var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
      var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});
      // console.log("blocksCovered",blocksCovered);
      // console.log("districtsCovered",districtsCovered);
      
      var centerDetail = {
        "center_ID"                : this.state.editId,
        "centerName"               : this.refs.nameOfCenter.value,
        "type_ID"                  : this.refs.typeOfCenter.value,
        "address"                  : {
          "addressLine"           : this.refs.address.value,
          "state"                 : this.refs.state.value.split('|')[0],
          "district"              : this.refs.district.value,
          "pincode"               : this.refs.pincode.value,
          "stateCode"             : this.refs.state.value.split('|')[1],
        },
        "districtsCovered"          : districtsCovered,
        "blocksCovered"             : blocksCovered,
        "villagesCovered"           : this.state.selectedVillages,
        "centerInchargeName"        : this.refs.centerInchargeName.value,
        "centerInchargeMobile"      : this.refs.centerInchargeContact.value,
        "centerInchargeEmail"       : this.refs.centerInchargeEmail.value,
        "misCoordinatorName"        : this.refs.MISCoordinatorName.value,
        "misCoordinatorMobile"      : this.refs.MISCoordinatorContact.value,
        "misCoordinatorEmail"       : this.refs.MISCoordinatorEmail.value,
      };
  
      // console.log('centerDetail', centerDetail);
      axios.patch('/api/centers',centerDetail)
      .then((response)=>{
        // console.log('response',response);
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });

      this.setState({
        "typeOfCenter"              : "--Select Center--",
        "nameOfCenter"              : "",
        "address"                   : "",
        "state"                     : "--Select State--",
        "district"                  : "--Select District--",
        "pincode"                   : "",
        "centerInchargeName"        : "",
        "centerInchargeContact"     : "",
        "centerInchargeEmail"       : "",
        "MISCoordinatorName"        : "",
        "MISCoordinatorContact"     : "",
        "MISCoordinatorEmail"       : "",
        "districtCovered"           : "--Select District--",
        "blocksCovered"              : "--Select Block--",
        "selectedVillages"          : [],
        "listofDistrict"            : [],
        "listofBlocks"              : [],
        "listofVillages"            : [],
        "editlistofVillages"        : [],
      });
      selectedVillages.map((a ,i)=>{this.setState({[a.village] : false})});
      this.props.history.push('/center-details');
      this.setState({
        "editId"              : "",
      });
    }
  }
/*  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);

      if (!fields["typeOfCenter"]) {
        formIsValid = false;
        errors["typeOfCenter"] = "This field is required.";
      }     
      if (!fields["nameOfCenter"]) {
        formIsValid = false;
        errors["nameOfCenter"] = "This field is required.";
      }
      if (!fields["address"]) {
        formIsValid = false;
        errors["address"] = "This field is required.";
      }
      if (!fields["state"]) {
          formIsValid = false;
          errors["state"] = "This field is required.";
      }
      if (!fields["district"]) {
        formIsValid = false;
        errors["district"] = "This field is required.";
      }          
      if (!fields["pincode"]) {
        formIsValid = false;
        errors["pincode"] = "This field is required.";
      }          
      if (!fields["centerInchargeName"]) {
        formIsValid = false;
        errors["centerInchargeName"] = "This field is required.";
      }          
      if (!fields["centerInchargeContact"]) {
        formIsValid = false;
        errors["centerInchargeContact"] = "This field is required.";

      }          
      if (!fields["centerInchargeEmail"]) {
        formIsValid = false;
        errors["centerInchargeEmail"] = "This field is required.";
      }          
      if (!fields["MISCoordinatorName"]) {
        formIsValid = false;
        errors["MISCoordinatorName"] = "This field is required.";
      }          
      if (!fields["MISCoordinatorContact"]) {
        formIsValid = false;
        errors["MISCoordinatorContact"] = "This field is required.";
      }          
      if (!fields["MISCoordinatorEmail"]) {
        formIsValid = false;
        errors["MISCoordinatorEmail"] = "This field is required.";
      }          
      this.setState({
        errors: errors
      });
      return formIsValid;
  }*/
 /* validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
    
      if (typeof fields["centerInchargeEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/i);
        if (!pattern.test(fields["centerInchargeEmail"])) {
          formIsValid = false;
          errors["centerInchargeEmail"] = "Please enter valid Email.";
        }
      }
      if (typeof fields["MISCoordinatorEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/i);
        if (!pattern.test(fields["MISCoordinatorEmail"])) {
          formIsValid = false;
          errors["MISCoordinatorEmail"] = "Please enter valid Email.";
        }
      }
      if (typeof fields["centerInchargeContact"] !== "undefined") {
        if (!fields["centerInchargeContact"].match(/^[0-9]{10}$|^$/)) {
          formIsValid = false;
          errors["centerInchargeContact"] = "Please enter valid contact number";
        }
      }
      if (typeof fields["MISCoordinatorContact"] !== "undefined") {
        if (!fields["MISCoordinatorContact"].match(/^[0-9]{10}$|^$/)) {
          formIsValid = false;
          errors["MISCoordinatorContact"] = "Please enter valid contact number";
        }
      }
      if (typeof fields["pincode"] !== "undefined") {
        if (!fields["pincode"].match(/^[0-9]{6}$|^$/)) {
          formIsValid = false;
          errors["pincode"] = "Please enter valid Pincode.";
        }
      }
      if (typeof fields["nameOfCenter"] !== "undefined") {
        // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
        if (!fields["nameOfCenter"].match(/^[_A-z]*((-|\s)*[_A-z])*$|^$/)) {
          formIsValid = false;
          errors["nameOfCenter"] = "Please enter valid Center Name.";
        }
      }
      if (typeof fields["centerInchargeName"] !== "undefined") {
        // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
        if (!fields["centerInchargeName"].match(/^[_A-z]*((-|\s)*[_A-z])*$|^$/)) {
          formIsValid = false;
          errors["centerInchargeName"] = "Please enter valid Name.";
        }
      }
      if (typeof fields["MISCoordinatorName"] !== "undefined") {
        // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
        if (!fields["MISCoordinatorName"].match(/^[_A-z]*((-|\s)*[_A-z])*$|^$/)) {
          formIsValid = false;
          errors["MISCoordinatorName"] = "Please enter valid Name.";
        }
      }  
      this.setState({
        errors: errors
      });
      return formIsValid;
  }*/
  componentDidMount() {
    $.validator.addMethod("RegExpEmail", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Email.");

    $("#Academic_details").validate({
      rules: {
        typeOfCenter: {
          required: true,
        },
        nameOfCenter: {
          required: true,
        },
        address: {
          required: true,
        },
        state: {
          required: true,
        },
        district: {
          required: true,
        },
        pincode: {
          required: true,
        },
        centerInchargeName: {
          required: true,
        },
        centerInchargeContact: {
          required: true,
        },
        centerInchargeEmail: {
          required: true,
          RegExpEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,

        },
        MISCoordinatorName: {
          required: true,
        },
        MISCoordinatorContact: {
          required: true,
        },
        MISCoordinatorEmail: {
          required: true,
          RegExpEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,

        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "typeOfCenter"){
          error.insertAfter("#typeOfCenter");
        }
        if (element.attr("name") == "nameOfCenter"){
          error.insertAfter("#nameOfCenter");
        }
        if (element.attr("name") == "address"){
          error.insertAfter("#address");
        }
        if (element.attr("name") == "state"){
          error.insertAfter("#state");
        }
        if (element.attr("name") == "district"){
          error.insertAfter("#district");
        }
        if (element.attr("name") == "pincode"){
          error.insertAfter("#pincode");
        }
        if (element.attr("name") == "centerInchargeName"){
          error.insertAfter("#centerInchargeName");
        }
        if (element.attr("name") == "centerInchargeContact"){
          error.insertAfter("#centerInchargeContact");
        }
        if (element.attr("name") == "centerInchargeEmail"){
          error.insertAfter("#centerInchargeEmail");
        }
        if (element.attr("name") == "MISCoordinatorName"){
          error.insertAfter("#MISCoordinatorName");
        }
        if (element.attr("name") == "MISCoordinatorContact"){
          error.insertAfter("#MISCoordinatorContact");
        }
        if (element.attr("name") == "MISCoordinatorEmail"){
          error.insertAfter("#MISCoordinatorEmail");
        }
      }
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getState();
    this.getTypeOfCenter();
    this.getData(this.state.startRange, this.state.limitRange);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.id;
      if(nextProps.match.params.id){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);
        })
      }
      this.getLength();
    }
  }
  
  edit(id){
    if(id){
      $('label.error').html('')
      axios({
        method: 'get',
        url: '/api/centers/'+id,
      }).then((response)=> {
        if(response&&response.data[0]){ 
          var editData = response.data[0];
          editData.villagesCovered.map((data, i)=>{
            this.setState({
              [data.village] : true
            })
          })
          // console.log("editData",editData);

          this.setState({
            "typeOfCenter"             : editData.type_ID,
            "nameOfCenter"             : editData.centerName,
            "address"                  : editData.address.addressLine, 
            "state"                    : editData.address.state+'|'+editData.address.stateCode,
            "district"                 : editData.address.district,
            "pincode"                  : editData.address.pincode,
            "centerInchargeName"       : editData.centerInchargeName,
            "centerInchargeContact"    : editData.centerInchargeMobile,
            "centerInchargeEmail"      : editData.centerInchargeEmail,
            "MISCoordinatorName"       : editData.misCoordinatorName,
            "MISCoordinatorContact"    : editData.misCoordinatorMobile,
            "MISCoordinatorEmail"      : editData.misCoordinatorEmail,
            "selectedVillages"         : editData.villagesCovered,
            "districtCovered"          : "--Select District--",
            "blocksCovered"            : "--Select Block--",
            "villagesCovered"          : editData.villagesCovered,
            'stateCode'                : editData.address.stateCode
          },()=>{
            // console.log(this.state)
            this.getDistrict(editData.address.stateCode);
            this.getBlock(editData.address.stateCode, editData.address.district);
            // console.log(editData.address.stateCode, editData.address.district, editData.blocksCovered);
            // this.getVillages(editData.address.stateCode, editData.address.district, editData.blocksCovered);
            if(editData.villagesCovered&&editData.villagesCovered.length>0){
              var returnData = [...new Set(editData.villagesCovered.map(a => a.village))]
              if(returnData&&returnData.length>0){
                var array = returnData.map((data,index) => {
                  return {'cityName' : data};
                });
                this.setState({
                  listofVillages : array,
                  editlistofVillages : array
                })
              }
            }
          });      
        }
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  getLength(){
    axios.get('/api/centers/count')
    .then((response)=>{
      if(response&&response.data){
        this.setState({
          dataCount : response.data.dataLength
        })
      }
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getData(startRange, limitRange){
    // console.log('/api/centers/list/'+startRange+'/'+limitRange);
    axios.get('/api/centers/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      // console.log('response', response.data);
      if(response&&response.data&&response.data.length>0){
        var tableData = response.data.map((a, i)=>{
        return {
            _id                       : a._id,
            type                      : a.type,
            centerName                : a.centerName,
            places                    : a.address,
            centerInchargeDetail      : a.centerInchargeDetail,
            misCoordinatorDetail      : a.misCoordinatorDetail,
            numberofVillage           : a.numberofVillage,
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
  componentWillMount(){
  }
  getTypeOfCenter(){
    axios({
      method: 'get',
      url: '/api/typeofcenters/list',
    }).then((response)=> {
      if(response&&response.data){
        this.setState({
          listofTypes : response.data
        })
      }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  selectType(event){
    event.preventDefault();
    var selectedType = event.target.value;
    this.setState({
      typeOfCenter : selectedType,
    },()=>{
      var typeOfCenterID = this.state.typeOfCenter.split('|')[1];
      this.setState({
        typeOfCenterID :typeOfCenterID
      })
    });
    this.handleChange(event);
  }
  getState(){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/states/get/list/IN',
    }).then((response)=> {
      // console.log('response ==========', response.data);
      if(response&&response.data){
        this.setState({
          listofStates : response.data
        })
      }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  selectState(event){
    event.preventDefault();
    var selectedState = event.target.value;
    this.setState({
      state : selectedState,
    },()=>{
      var stateCode = this.state.state.split('|')[1];
      // console.log('state', stateCode);
      this.setState({
        stateCode :stateCode,
        pincode :'',
        district : '--Select District--',
        districtCovered : '--Select District--',
        blocksCovered : '--Select Block--',
        listofVillages : this.state.editlistofVillages
      },()=>{
        // console.log('stateCode',this.state.stateCode);
        this.getDistrict(this.state.stateCode);
      })
    });
    this.handleChange(event);
  }
  getDistrict(stateCode){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/districts/get/list/IN/'+stateCode,
    }).then((response)=> {
        // console.log('response ==========', response.data);
        if(response&&response.data){
          this.setState({
            listofDistrict : response.data,
          })
        }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  districtCoveredChange(event){    
    event.preventDefault();
    var districtCovered = event.target.value;
    // console.log('districtCovered', districtCovered);
    this.setState({
      districtCovered: districtCovered,
      blocksCovered : '--Select Block--',
    },()=>{
      var selectedDistrict = this.state.districtCovered.split('|')[0];
      // console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict,
        listofVillages : this.state.editlistofVillages
      },()=>{
        // console.log('selectedDistrict',this.state.selectedDistrict);
        this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
  }
  getBlock(stateCode, selectedDistrict){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
      // url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/'+stateCode+'/IN',
    }).then((response)=> {
      if(response&&response.data){
        // console.log('response ==========', response.data);
        this.setState({
          listofBlocks : response.data
        })
      }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    var blocksCovered = event.target.value;
    this.setState({
      blocksCovered : blocksCovered
    },()=>{
      // console.log("blocksCovered",blocksCovered);
      this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.blocksCovered);
    });
  }
  getVillages(stateCode, selectedDistrict, blocksCovered){
    // console.log('stateCode, selectedDistrict, blocksCovered',stateCode, selectedDistrict, blocksCovered);
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+blocksCovered,
      // url: 'http://locationapi.iassureit.com/api/cities/get/list/'+blocksCovered+'/'+selectedDistrict+'/'+stateCode+'/IN',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        if(response&&response.data[0]){
          if(this.state.editlistofVillages.length!==0){
            var listofVillages = response.data
            // console.log('listofVillages',listofVillages)
            this.state.editlistofVillages.map((data,index) => {
              var index = listofVillages.findIndex(v => v.cityName === data.cityName);
              // console.log('index',index)
              if(index<0){
                listofVillages.push({'cityName' : data.cityName});
              }
            });
            this.setState({
              listofVillages : listofVillages
            })
          }else{
            this.setState({
              listofVillages : response.data
            })
          }
        }
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectVillage(event){
    var selectedVillages = this.state.selectedVillages;
    var listofVillages = this.state.listofVillages;
    var value = event.target.checked;
    var id    = event.target.id;
    var cityName = $(event.currentTarget).parent().parent().siblings('label').html();
    this.setState({
      [id] : value
    },()=>{
      // console.log('village', this.state[id], id);
      if(this.state[id] === true){
        selectedVillages.push({
          district  : this.refs.districtCovered.value,
          block     : this.refs.blocksCovered.value,
          village   : id
        });
        this.setState({
          selectedVillages : selectedVillages,
        });
      }else{
        // console.log('listofVillages', listofVillages,cityName);
        var index = selectedVillages.findIndex(v => v.village === id);
        // console.log('index', index);
        selectedVillages.splice(selectedVillages.findIndex(v => v.village === id), 1);
        if(this.refs.districtCovered.value==='--Select District--'&&this.refs.blocksCovered.value==='--Select Block--'){
          listofVillages.splice(listofVillages.findIndex(v => v.cityName === cityName), 1);
        }
        this.setState({
          selectedVillages : selectedVillages,
          listofVillages : listofVillages
        });
      }
    });      
  }
  editVillage(event){
    event.preventDefault();
    var id = event.target.id;
    // console.log('id',id);
    var selectedVillages = this.state.selectedVillages[id];
    // console.log('selectedVillages', selectedVillages);
  }
  deleteVillage(event){
    event.preventDefault();
    var id = event.target.id;
    // console.log('id',id);
    var selectedVillages = this.state.selectedVillages;
    // console.log('index', index);
    selectedVillages.splice(id, 1);
    this.setState({
      selectedVillages : selectedVillages
    });
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
  getSearchText(searchText, startRange, limitRange){
    this.setState({
      tableData : []
    })
  }
  changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
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
                            Master Data                                     
                         </div>
                        <hr className="hr-head container-fluid row"/>
                      </div>
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                        <div className="col-lg-12 ">
                           <h4 className="pageSubHeader">Center Details</h4>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">Center Type</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeOfCenter" >
                                <select className="custom-select form-control inputBox" value={this.state.typeOfCenter} ref="typeOfCenter" name="typeOfCenter" onChange={this.selectType.bind(this)} >
                                  <option   disabled="disabled" selected="true" value="--Select Center--">--Select Center--</option>
                                  {
                                    this.state.listofTypes ?
                                    this.state.listofTypes.map((data, index)=>{
                                      return(
                                        <option key={index} value={data._id}>{data.typeofCenter}</option> 
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.typeOfCenter}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Center Name</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="nameOfCenter" >
                                <input type="text"   className="form-control inputBox "  value={this.state.nameOfCenter}  name="nameOfCenter" placeholder="" ref="nameOfCenter"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.nameOfCenter}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                             <label className="formLable">Address</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="address" >
                                <input type="text"   className="form-control inputBox "  value={this.state.address}  name="address" placeholder="" ref="address" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.address}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">State</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                                <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.selectState.bind(this)} >
                                  <option disabled="disabled" selected="true" value="--Select State--">--Select State--</option> 
                                  {
                                    this.state.listofStates ?
                                    this.state.listofStates.map((data, index)=>{
                                      return(
                                        <option key={index} value={this.camelCase(data.stateName)+'|'+data.stateCode}>{this.camelCase(data.stateName)}</option> 
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.state}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">District</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox"  value={this.state.district}  ref="district" name="district" onChange={this.handleChange.bind(this)} >
                                  <option disabled="disabled" selected="true" value="--Select District--" >--Select District--</option>
                                  {
                                    this.state.listofDistrict && this.state.listofDistrict.length > 0 ? 
                                    this.state.listofDistrict.map((data, index)=>{
                                      // console.log(data);
                                      return(
                                        <option key={index} value={this.camelCase(data.districtName)}>{this.camelCase(data.districtName)}</option>
                                      );
                                    })
                                    :
                                   null
                                  }                                
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.district}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                             <label className="formLable">Pincode</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="pincode" >
                                <input type="text"   className="form-control inputBox "  value={this.state.pincode}  name="pincode" placeholder="" ref="pincode" maxLength="6"  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.pincode}</div>
                            </div>
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of Center Incharge</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="centerInchargeName" >
                                <input type="text"   className="form-control inputBox "  value={this.state.centerInchargeName} name="centerInchargeName" placeholder="" ref="centerInchargeName"  onKeyDown={this.isTextKey.bind(this)}   onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centerInchargeName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of Center Incharge</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="centerInchargeContact" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox "   value={this.state.centerInchargeContact} name="centerInchargeContact" placeholder="" ref="centerInchargeContact" maxLength="10" onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centerInchargeContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of Center Incharge</label><span className="asterix">*</span>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="centerInchargeEmail" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox " name="centerInchargeEmail"  value={this.state.centerInchargeEmail} placeholder="" ref="centerInchargeEmail" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centerInchargeEmail}</div>
                            </div>
                          </div> 
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight mt">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of MIS Coordinator</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="MISCoordinatorName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox "  value={this.state.MISCoordinatorName}  name="MISCoordinatorName" placeholder="" ref="MISCoordinatorName"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of MIS Coordinator</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="MISCoordinatorContact" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox "  value={this.state.MISCoordinatorContact}  name="MISCoordinatorContact" placeholder="" ref="MISCoordinatorContact" maxLength="10" onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of MIS Coordinator</label><span className="asterix">*</span>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="MISCoordinatorEmail" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox "  value={this.state.MISCoordinatorEmail}  name="MISCoordinatorEmail" placeholder=""ref="MISCoordinatorEmail"  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorEmail}</div>
                            </div>
                          </div> 
                        </div>
                        <div className="col-lg-12 ">
                           <hr />
                        </div>
                        <div className="col-lg-12">
                           <h5 className="pageSubHeader">Area Covered</h5>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                              <label className="formLable">District Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.districtCovered}  ref="districtCovered" name="districtCovered" onChange={this.districtCoveredChange.bind(this)} >
                                  <option disabled="disabled" selected="true" value="--Select District--" >--Select District--</option>
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
                              <div className="errorMsg">{this.state.errors.districtCovered}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">Block Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blocksCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.blocksCovered}  ref="blocksCovered" name="blocksCovered"  onChange={this.selectBlock.bind(this)} >
                                  <option disabled="disabled" selected="true" value="--Select Block--" >--Select Block--</option>
                                  {
                                    this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                    this.state.listofBlocks.map((data, index)=>{
                                      return(
                                        <option key={index} value={this.camelCase(data.blockName)}>{this.camelCase(data.blockName)}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.blocksCovered}</div>
                            </div>
                          </div> 
                        </div>
                        {
                          this.state.listofVillages.length > 0 ?
                          <div className="row">
                            <div className=" col-lg-12 col-sm-12 col-xs-12 mt">
                              <h5 className="col-lg-12 col-sm-12 col-xs-12">Villages Covered</h5>                     
                            {
                              this.state.listofVillages?
                              this.state.listofVillages.map((data, index)=>{
                            /*  this.setState({
                                array : village,
                              })*/
                                return(
                                  <div key={index} className="col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                                    <div className="row"> 
                                      <div className="col-lg-12 noPadding">  
                                       <div className="actionDiv">
                                          <div className="centerDetailContainer col-lg-1">
                                            <input type="checkbox" id={data.cityName}  checked={this.state[data.cityName]?true:false} onChange={this.selectVillage.bind(this)}/>
                                            <span className="centerDetailCheck"></span>
                                          </div>
                                        </div>                            
                                        <label className="centerDetaillistItem"> {this.camelCase(data.cityName)}</label>
                                      </div>
                                    </div>  
                                  </div>
                                );
                              })
                              :
                              null
                            }
                          </div>
                        </div>
                        : 
                        this.state.districtCovered!=='--Select District--'&&this.state.blocksCovered!=='--Select Block--'?
                          <p className="mt col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          No villages found.</p>
                        :
                        null
                        }      
                                   
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                           <hr />
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="">Villages Covered</h5>                                     
                          <table className="table iAssureITtable-bordered table-striped table-hover">
                            <thead className="tempTableHeader">
                              <tr>
                                <th>District</th>
                                <th>Block</th>
                                <th>Villages</th>
                                {/*<th>Actions</th>*/}
                              </tr>
                            </thead>
                            <tbody>
                            {
                              this.state.selectedVillages && this.state.selectedVillages.length > 0 ? 
                              this.state.selectedVillages.map((data, index)=>{
                                return(
                                  <tr key={index}>
                                    <td>{data.district.split('|')[0]}</td>
                                    <td>{data.block}</td>
                                    <td>{data.village}</td>
                                    {/*<td>
                                      <i className="fa fa-pencil" id={index} onClick={this.editVillage.bind(this)}></i> &nbsp; &nbsp; 
                                      <i className="fa fa-trash redFont" id={index} onClick={this.deleteVillage.bind(this)}></i>
                                    </td>*/}
                                  </tr>
                                );
                              })
                              :
                              <tr><td className="textAlignCenter" colSpan="4">Nothing to Display</td></tr>
                            }
                            </tbody>
                          </table> 
                        </div>     
                        <div className="col-lg-12">
                        {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Submit.bind(this)}> Submit </button>
                        }
                        </div>                          
                      </form>
                      <div className="col-lg-12 ">
                         <hr className="hr-head"/>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                          getSearchText={this.getSearchText.bind(this)}
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
export default centerDetail
