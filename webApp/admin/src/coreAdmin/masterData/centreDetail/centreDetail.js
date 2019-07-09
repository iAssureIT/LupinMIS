import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css';
import "./centreDetail.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
      
var centreDetailArray  = [];
class centreDetail extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "typeOfCentre"             :"",
      "nameOfCentre"             :"",
      "address"                  :"",
      "state"                    :"",
      "district"                 :"",
      "pincode"                  :"",
      "centreInchargeName"       :"",
      "centreInchargeContact"    :"",
      "centreInchargeEmail"      :"",
      "MISCoordinatorName"       :"",
      "MISCoordinatorContact"    :"",
      "MISCoordinatorEmail"      :"",
      "districtCovered"          :"",
      "blockCovered"             :"",
      "centreDetailArray"        :[],
      "array"                    :[],
      "shown"                    : true,
      "tabtype"                     : "location",
      "fields"                      : {},
      "errors"                      : {},
      "listofStates"                : [],
      "listofDistrict"              : [],
      "listofBlocks"                : [],
      "listofVillages"              : [],
      "selectedVillages"            : [],
      "twoLevelHeader"              : {
        apply                     : true,
        firstHeaderData           : [
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
        type                      : "Type of Center",
        centerName                : "Name of Center",
        address                   : "Address",
        centerInchargename        : "Name",
        centerInchargemobile      : "Contact",
        centerInchargeemail       : "Email",
        misCoordinatorname        : "Name",
        misCoordinatormobile      : "Contact",
        misCoordinatoremail       : "Email",
        actions                   : 'Action',
      },
      "tableObjects"              : {
        apiLink                   : '/api/centers/',
        editUrl                   : '/centre-detail/'
      },
      "startRange"                  : 0,
      "limitRange"                  : 10,
      "editId"                      : this.props.match.params ? this.props.match.params.id : ''
    }
    this.changeTab = this.changeTab.bind(this); 
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
     "typeOfCentre"              : this.refs.typeOfCentre.value,
      "nameOfCentre"             : this.refs.nameOfCentre.value,
      "address"                  : this.refs.address.value,
      "state"                    : this.refs.state.value,
      "district"                 : this.refs.district.value,
      "pincode"                  : this.refs.pincode.value,
      "centreInchargeName"       : this.refs.centreInchargeName.value,
      "centreInchargeContact"    : this.refs.centreInchargeContact.value,
      "centreInchargeEmail"      : this.refs.centreInchargeEmail.value,
      "MISCoordinatorName"       : this.refs.MISCoordinatorName.value,
      "MISCoordinatorContact"    : this.refs.MISCoordinatorContact.value,
      "MISCoordinatorEmail"      : this.refs.MISCoordinatorEmail.value,
      "districtCovered"          : this.refs.districtCovered.value,
      "blockCovered"             : this.refs.blockCovered.value,
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
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
    if (this.validateForm() && this.validateFormReq()) {
      var academicArray=[];
      var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');

      var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
      var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});

      var id2 = this.state.uID;
        /*    if (this.validateForm()) {*/    
      var centreDetail= 
      {
        "type"                      : this.refs.typeOfCentre.value,
        "centerName"                : this.refs.nameOfCentre.value,
        "address"                   : {
            "addressLine"           : this.refs.address.value,
            "state"                 : this.refs.state.value,
            "district"              : this.refs.district.value,
            "pincode"               : this.refs.pincode.value,
        },
        "districtsCovered"          : districtsCovered,
        "blocksCovered"             : blocksCovered,
        "villagesCovered"           : this.state.selectedVillages,
        "centerInchargename"        : this.refs.centreInchargeName.value,
        "centerInchargemobile"      : this.refs.centreInchargeContact.value,
        "centerInchargeemail"       : this.refs.centreInchargeEmail.value,
        "misCoordinatorname"        : this.refs.MISCoordinatorName.value,
        "misCoordinatormobile"      : this.refs.MISCoordinatorContact.value,
        "misCoordinatoremail"       : this.refs.MISCoordinatorEmail.value,
      };
      // console.log("centreDetail",centreDetail);
      let fields = {};
      fields["typeOfCentre"] = "";
      fields["nameOfCentre"] = "";
      fields["address"] = "";
      fields["state"] = "";
      fields["district"] = "";
      fields["pincode"] = "";
      fields["centreInchargeName"] = "";
      fields["centreInchargeContact"] = "";
      fields["centreInchargeEmail"] = "";
      fields["MISCoordinatorName"] = "";
      fields["MISCoordinatorContact"] = "";
      fields["MISCoordinatorEmail"] = "";
      fields["districtCovered"] = "";
      fields["blockCovered"] = "";

      // console.log('centreDetail',centreDetail);
      axios.post('/api/centers',centreDetail)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
        this.getData(this.state.startRange, this.state.limitRange);
        
      })
      .catch(function(error){
        
      });

      this.setState({
        "typeOfCentre"              : "",
        "nameOfCentre"              : "",
        "address"                   : "",
        "state"                     : "",
        "district"                  : "",
        "pincode"                   : "",
        "centreInchargeName"        : "",
        "centreInchargeContact"     : "",
        "centreInchargeEmail"       : "",
        "MISCoordinatorName"        : "",
        "MISCoordinatorContact"     : "",
        "MISCoordinatorEmail"       : "",
        "districtCovered"           : "",
        "blockCovered"              : "",
        "selectedVillages"          : [],
        "listofDistrict"            : [],
        "listofBlocks"              : [],
        "listofVillages"            : [],
        "fields"                    : fields
      });
      $('input[type=checkbox]').attr('checked', false);
    }
  }
  Update(event){
  event.preventDefault();
   if(this.refs.address.value == ""){
      console.log('state validation');
      if (this.validateForm() && this.validateFormReq()){
        console.log('abc');
      }
    }else{
      var academicArray=[];
        var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');

        var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
        var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});

        var id2 = this.state.uID;
        var centreDetail = {
          "type"                      : this.refs.typeOfCentre.value,
          "centerName"                : this.refs.nameOfCentre.value,
          "address"                   : this.refs.address.value,
          "state"                     : this.refs.state.value,
          "district"                  : this.refs.district.value,
          "pincode"                   : this.refs.pincode.value,
          "districtsCovered"          : districtsCovered,
          "blocksCovered"             : blocksCovered,
          "villagesCovered"           : this.state.selectedVillages,
          "centerInchargename"        : this.refs.centreInchargeName.value,
          "centerInchargemobile"      : this.refs.centreInchargeContact.value,
          "centerInchargeemail"       : this.refs.centreInchargeEmail.value,
          "misCoordinatorname"        : this.refs.MISCoordinatorName.value,
          "misCoordinatormobile"      : this.refs.MISCoordinatorContact.value,
          "misCoordinatoremail"       : this.refs.MISCoordinatorEmail.value,
        };
        
        let fields = {};
        fields["typeOfCentre"] = "";
        fields["nameOfCentre"] = "";
        fields["address"] = "";
        fields["state"] = "";
        fields["district"] = "";
        fields["pincode"] = "";
        fields["centreInchargeName"] = "";
        fields["centreInchargeContact"] = "";
        fields["centreInchargeEmail"] = "";
        fields["MISCoordinatorName"] = "";
        fields["MISCoordinatorContact"] = "";
        fields["MISCoordinatorEmail"] = "";
        fields["districtCovered"] = "";
        fields["blockCovered"] = "";

        axios.patch('/api/centers',centreDetail, this.state.editId)
        .then(function(response){
          swal({
            title : response.data,
            text  : response.data
          });
          this.getData(this.state.startRange, this.state.limitRange);
        })
        .catch(function(error){
          
        });

        this.setState({
          "typeOfCentre"              : "",
          "nameOfCentre"              : "",
          "address"                   : "",
          "state"                     : "",
          "district"                  : "",
          "pincode"                   : "",
          "centreInchargeName"        : "",
          "centreInchargeContact"     : "",
          "centreInchargeEmail"       : "",
          "MISCoordinatorName"        : "",
          "MISCoordinatorContact"     : "",
          "MISCoordinatorEmail"       : "",
          "districtCovered"           : "",
          "blockCovered"              : "",
          "selectedVillages"          : [],
          "listofDistrict"            : [],
          "listofBlocks"              : [],
          "listofVillages"            : [],
          "fields"                    : fields
        });
        $('input[type=checkbox]').attr('checked', false);
    }
    // else{
       // var academicArray=[];
       //  var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');

       //  var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
       //  var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});

       //  var id2 = this.state.uID;
       //  var centreDetail = {
       //    "type"                      : this.refs.typeOfCentre.value,
       //    "centerName"                : this.refs.nameOfCentre.value,
       //    "address"                   : this.refs.address.value,
       //    "state"                     : this.refs.state.value,
       //    "district"                  : this.refs.district.value,
       //    "pincode"                   : this.refs.pincode.value,
       //    "districtsCovered"          : districtsCovered,
       //    "blocksCovered"             : blocksCovered,
       //    "villagesCovered"           : this.state.selectedVillages,
       //    "centerInchargename"        : this.refs.centreInchargeName.value,
       //    "centerInchargemobile"      : this.refs.centreInchargeContact.value,
       //    "centerInchargeemail"       : this.refs.centreInchargeEmail.value,
       //    "misCoordinatorname"        : this.refs.MISCoordinatorName.value,
       //    "misCoordinatormobile"      : this.refs.MISCoordinatorContact.value,
       //    "misCoordinatoremail"       : this.refs.MISCoordinatorEmail.value,
       //  };
        
       
       //  axios.put('/api/centers',centreDetail, this.state.editId)
       //  .then(function(response){
       //    swal({
       //      title : response.data,
       //      text  : response.data
       //    });
       //    this.getData(this.state.startRange, this.state.limitRange);
       //  })
       //  .catch(function(error){
          
       //  });

       //  this.setState({
       //    "typeOfCentre"              : "",
       //    "nameOfCentre"              : "",
       //    "address"                   : "",
       //    "state"                     : "",
       //    "district"                  : "",
       //    "pincode"                   : "",
       //    "centreInchargeName"        : "",
       //    "centreInchargeContact"     : "",
       //    "centreInchargeEmail"       : "",
       //    "MISCoordinatorName"        : "",
       //    "MISCoordinatorContact"     : "",
       //    "MISCoordinatorEmail"       : "",
       //    "districtCovered"           : "",
       //    "blockCovered"              : "",
       //    "selectedVillages"          : [],
       //    "listofDistrict"            : [],
       //    "listofBlocks"              : [],
       //    "listofVillages"            : [],
       //  });
       $('input[type=checkbox]').attr('checked', false);

      /*  for(var i=0;i<this.state.array.length;i++)
        {
        $( this.state.array ).prop( "checked", false );

        }
      */

    // }
    // this.props.history.push('/center-details');
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["typeOfCentre"]) {
        formIsValid = false;
        errors["typeOfCentre"] = "This field is required.";
      }     
      if (!fields["nameOfCentre"]) {
        formIsValid = false;
        errors["nameOfCentre"] = "This field is required.";
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
      if (!fields["centreInchargeName"]) {
        formIsValid = false;
        errors["centreInchargeName"] = "This field is required.";
      }          
      if (!fields["centreInchargeContact"]) {
        formIsValid = false;
        errors["centreInchargeContact"] = "This field is required.";
      }          
      if (!fields["centreInchargeEmail"]) {
        formIsValid = false;
        errors["centreInchargeEmail"] = "This field is required.";
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
  }
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (typeof fields["centreInchargeEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["centreInchargeEmail"])) {
          formIsValid = false;
          errors["centreInchargeEmail"] = "Please enter valid email-ID.";
        }
      }
      if (typeof fields["MISCoordinatorEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["MISCoordinatorEmail"])) {
          formIsValid = false;
          errors["MISCoordinatorEmail"] = "Please enter valid email-ID.";
        }
      }
      if (typeof fields["centreInchargeContact"] !== "undefined") {
        if (!fields["centreInchargeContact"].match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["centreInchargeContact"] = "Please enter valid mobile no.";
        }
      }
      if (typeof fields["MISCoordinatorContact"] !== "undefined") {
        if (!fields["MISCoordinatorContact"].match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["MISCoordinatorContact"] = "Please enter valid mobile no.";
        }
      }
         
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  componentDidMount() {
    console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      var tableDatas = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});
      var tableData = tableDatas.map((a, index)=>{
        return {
          "_id" : a._id,
          "type": a.type,
          "centerName": a.centerName,
          "address" : a.address.state,
          "centerInchargename": a.centerInchargename,
          "centerInchargemobile": a.centerInchargemobile,
          "centerInchargeemail": a.centerInchargeemail,
          "misCoordinatorname": a.misCoordinatorname,
          "misCoordinatormobile": a.misCoordinatormobile,
          "misCoordinatoremail": a.misCoordinatoremail
        }
      })
      this.setState({
        dataCount : tableData.length,
        tableData : tableData.slice(this.state.startRange, this.state.limitRange),
        editUrl   : this.props.match.params
      },()=>{
        
      });
    }).catch(function (error) {
      console.log('error', error);
    });

    var listofStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh','Maharashtra'];
    this.setState({
      listofStates : listofStates
    })
  }
  edit(id){
    $('input:checkbox').attr('checked','unchecked');
    axios({
      method: 'get',
      url: '/api/centers/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      editData.villagesCovered.map((data, i)=>{
        this.setState({
          [data.village] : true
        })
      })
      this.setState({
        "typeOfCentre"             : editData.type,
        "nameOfCentre"             : editData.centerName,
        "address"                  : editData.address.addressLine,
        "state"                    : editData.address.state,
        "district"                 : editData.address.district,
        "pincode"                  : editData.address.pincode,
        "centreInchargeName"       : editData.centerInchargename,
        "centreInchargeContact"    : editData.centerInchargemobile,
        "centreInchargeEmail"      : editData.centerInchargeemail,
        "MISCoordinatorName"       : editData.misCoordinatorname,
        "MISCoordinatorContact"    : editData.misCoordinatormobile,
        "MISCoordinatorEmail"      : editData.misCoordinatoremail,
        "selectedVillages"         : editData.villagesCovered,
        "districtCovered"          :"",
        "blockCovered"             :"",
        "villagesCovered"          : editData.villagesCovered,
      },()=>{
        
        if(this.state.state == 'Maharashtra'){
          var listofDistrict = ['Pune', 'Mumbai'];
          this.setState({
            listofDistrict : listofDistrict
          });
        }
        if(this.state.district == 'Pune'){
          var listofBlocks = ['Ambegaon', 'Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Mawal', 'Mulshi', 'Pune City', 'Purandhar', 'Shirur', 'Velhe'];
          this.setState({
            listofBlocks : listofBlocks
          });
        }
      });
    }).catch(function (error) {
    });
  }
  getData(startRange, limitRange){
      axios({
        method: 'get',
        url: '/api/centers/list',
      }).then((response)=> {
        var tableData = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});

        this.setState({
          tableData : tableData.slice(startRange, limitRange),
        });
      }).catch(function (error) {
        console.log('error', error);
      });

      var listofStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh','Maharashtra'];
      this.setState({
        listofStates : listofStates
      })
  }
  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }
  districtCoveredChange(event){
    event.preventDefault();
    var districtCovered = event.target.value;
    // console.log('districtCovered', districtCovered);
    this.setState({
      districtCovered: districtCovered
    },()=>{
      var listofBlocks = ['Ambegaon', 'Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Mawal', 'Mulshi', 'Pune City', 'Purandhar', 'Shirur', 'Velhe'];
      if(this.state.districtCovered == 'Pune'){          
        this.setState({
          listofBlocks : listofBlocks
        });
      }else{
        this.setState({
          listofBlocks : [],
          listofVillages:[]
        });
      }
    });
  }
  selectState(event){
    event.preventDefault();
    var selectedState = event.target.value;
    this.setState({
      state : selectedState
    },()=>{
      if(this.state.state == 'Maharashtra'){
        var listofDistrict = ['Pune', 'Mumbai'];
        this.setState({
          listofDistrict : listofDistrict
        });
      }else{
        this.setState({
          listofDistrict:[],
          listofVillages:[]
        });
      }
    });
    this.handleChange(event);
  }
  blockCoveredChange(event){
    event.preventDefault();
    var blockCovered = event.target.value;
    this.setState({
      blockCovered : blockCovered
    },()=>{
      var listofVillages = ['Magarpatta', 'Kharadi', 'Wagholi', 'Manjari'];
      if(this.state.blockCovered == 'Haveli'){
        this.setState({
          listofVillages : listofVillages
        })
      }else{
        this.setState({
          listofVillages : []
        })
      }        
    });
  }
  selectVillage(event){
    var selectedVillages = this.state.selectedVillages;

    var value = event.target.checked;
    var id    = event.target.id;

    this.setState({
      [id] : value
    },()=>{
      // console.log('village', this.state[id], id);
      if(this.state[id] == true){
        selectedVillages.push({
          district  : this.refs.districtCovered.value,
          block     : this.refs.blockCovered.value,
          village   : id
        });
        this.setState({
          selectedVillages : selectedVillages
        });
        console.log('selectedVillages', selectedVillages);
      }else{
        var index = selectedVillages.findIndex(v => v.village === id);
        // console.log('index', index);
        selectedVillages.splice(selectedVillages.findIndex(v => v.village === id), 1);
        this.setState({
          selectedVillages : selectedVillages
        },()=>{
          // console.log('selectedVillages',this.state.selectedVillages);
        });
      }
    });      
  }
  editVillage(event){
    event.preventDefault();
    var id = event.target.id;
    console.log('id',id);

    var selectedVillages = this.state.selectedVillages[id];
    console.log('selectedVillages', selectedVillages);
  }
  deleteVillage(event){
    event.preventDefault();
    var id = event.target.id;
    console.log('id',id);
    var selectedVillages = this.state.selectedVillages;
    // console.log('index', index);
    selectedVillages.splice(id, 1);
    this.setState({
      selectedVillages : selectedVillages
    },()=>{
      // console.log('selectedVillages',this.state.selectedVillages);
    });
  }
  changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
  }
  render() {
    const dataM = [{
        srno: 1,
        FamilyID: "Maharashtra",
        NameofBeneficiary: "Pune",
        BeneficiaryID: "Pimpri",
      }
    ]
    const columnsM = [ 
      {
        Header: 'Sr No',
        accessor: 'srno',
      },
      {
        Header: 'District',
        accessor: 'FamilyID', 
      }, {
        Header: 'Block',
        accessor: 'NameofBeneficiary', 
      }, {
        Header: 'Village',
        accessor: 'BeneficiaryID', 
      },
    ]
    const data = [{
        srno: 1,
        FamilyID: "L000001",
        NameofBeneficiary: "Priyanka Lewade",
        BeneficiaryID: "PL0001",
        },{
        srno: 2,
        FamilyID: "B000001",
        NameofBeneficiary: "Priyanka Bhanvase",
        BeneficiaryID: "PB0001",
      }
    ]
    const columns = [ 
        {
          Header: 'Sr No',
          accessor: 'srno',
          },
          {
          Header: 'Sector',
          accessor: 'NameofBeneficiary', 
          }, {
          Header: 'Activity',
          accessor: 'noMAp', 
          },{
          Header: 'Sub-Activity',
          accessor: 'noMAp', 
          },{
          Header: 'Quantity',
          accessor: 'noMAp', 
          },{
          Header: 'Amount',
          accessor: 'noMAp', 
          },{
          Header: 'Beneficiary',
          accessor: 'noMAp', 
          },{
          Header: "Financial Sharing",
          columns: [
          {
            Header: "LHWRF",
            accessor: "LHWRF"
          },
          {
            Header: "NABARD",
            accessor: "NABARD"
          },{
            Header: "Bank Loan",
            accessor: "BankLoan"
          },{
            Header: "Govt",
            accessor: "BankLoan"
          },{
            Header: "Direct Beneficiary",
            accessor: "BankLoan"
          },{
            Header: "Indirect Beneficiary",
            accessor: "BankLoan"
          },
        ]
        },
        {
        Header: 'Action',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-3">
              <div className="col-lg-6" onClick={() => this.deleteData(row.original)}>
            <i className="fa fa-trash"> </i>
              </div>
             
            </div>
            )     
          }
        ]
        // console.log('dataCount', this.state.dataCount, 'tableData', this.state.tableData);
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
                              <label className="formLable">Select Type of Center</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeOfCentre" >
                                <select className="custom-select form-control inputBox" value={this.state.typeOfCentre} ref="typeOfCentre" name="typeOfCentre" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--Select Center--</option>
                                  <option  className="" >Development Centre</option>
                                  <option  className="" >CSR Centre</option>
                                  <option  className="" >ADP</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.typeOfCentre}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of Centre</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="nameOfCentre" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.nameOfCentre}  name="nameOfCentre" placeholder="" ref="nameOfCentre"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.nameOfCentre}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                             <label className="formLable">Address</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="address" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.address}  name="address" placeholder="" ref="address" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.address}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">State</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                                <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.selectState.bind(this)} >
                                  <option  className="hidden" value="">--Select--</option> 
                                  {
                                    this.state.listofStates ?
                                    this.state.listofStates.map((state, index)=>{
                                      return(
                                        <option key={index} value={state}>{state}</option> 
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
                                <select className="custom-select form-control inputBox"  value={this.state.district}  ref="district" name="district"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--Select--</option>
                                  {
                                    this.state.listofDistrict ? 
                                    this.state.listofDistrict.map((district, index)=>{
                                      return(
                                        <option key={index} value={district}>{district}</option>
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
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="centreInchargeName" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.centreInchargeName} name="centreInchargeName" placeholder="" ref="centreInchargeName"  onKeyDown={this.isTextKey.bind(this)}   onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centreInchargeName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of Center Incharge</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="centreInchargeContact" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"   value={this.state.centreInchargeContact} name="centreInchargeContact" placeholder="" ref="centreInchargeContact" maxLength="10" onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centreInchargeContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of Center Incharge</label><span className="asterix">*</span>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="centreInchargeEmail" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox " name="centreInchargeEmail"  value={this.state.centreInchargeEmail} placeholder="" ref="centreInchargeEmail" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centreInchargeEmail}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of MIS Coordinator</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="MISCoordinatorName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.MISCoordinatorName}  name="MISCoordinatorName" placeholder="" ref="MISCoordinatorName"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
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
                        </div><br/>
                        <div className="col-lg-12 ">
                           <hr />
                        </div>
                        <div className="col-lg-12 ">
                           <h5 className="pageSubHeader">Villages Covered by this Center</h5>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">District Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.districtCovered}  ref="districtCovered" name="districtCovered"  onChange={this.districtCoveredChange.bind(this)} >
                                  <option  className="hidden" >--Select District--</option>
                                  {
                                    this.state.listofDistrict ? 
                                    this.state.listofDistrict.map((district, index)=>{
                                      return(
                                        <option key={index} value={district}>{district}</option>
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
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blockCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.blockCovered}  ref="blockCovered" name="blockCovered"  onChange={this.blockCoveredChange.bind(this)} >
                                  <option  className="hidden" >--Select Block--</option>
                                  {
                                    this.state.listofBlocks ? 
                                    this.state.listofBlocks.map((block, index)=>{
                                      return(
                                        <option key={index} value={block}>{block}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.blockCovered}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight mt ">
                          <label className="formLable faintCoolor col-lg-12 col-sm-12 col-xs-12">Villages Covered</label>                           
                            {
                              this.state.listofVillages?
                              this.state.listofVillages.map((village, index)=>{
                            /*  this.setState({
                                array : village,
                              })*/
                                return(
                                  <div key={index} className="col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                                    <div className="row"> 
                                      <div className="col-lg-12 noPadding">  
                                       <div className="actionDiv">
                                          <div className="centreDetailContainer col-lg-1">
                                            <input type="checkbox" id={village}  checked={this.state[village]?true:false} onChange={this.selectVillage.bind(this)}/>
                                            <span className="centreDetailCheck"></span>
                                          </div>
                                        </div>                            
                                        <label className="centreDetaillistItem"> {village}</label>
                                      </div>
                                    </div>  
                                  </div>
                                );
                              })
                              :
                              null
                            }
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                            
                          </div> 
                        </div><br/>             
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                           <hr />
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="">List of Villages</h5>                                     
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
                                    <td>{data.district}</td>
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
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
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
export default centreDetail