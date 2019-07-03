import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css';
import "./centreDetail.css";
axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
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
      "shown"                    : true,
      tabtype                     : "location",
      fields                      : {},
      errors                      : {},
      listofStates                : [],
      listofDistrict              : [],
      listofBlocks                : [],
      listofVillages              : [],
      selectedVillages            : [],
      twoLevelHeader              : {
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
      tableHeading                : {
        type                      : "Type of Center",
        centerName                : "Name of Center",
        address                   : "Address",
        centreInchargeName        : 'Name',
        centreInchargeContact     : 'Contact',
        centreInchargeEmail       : 'Email',
        MISCoordinatorName        : 'Name',
        MISCoordinatorContact     : 'Contact',
        MISCoordinatorEmail       : 'Email',
        actions                   : 'Action',
      },
      startRange : 0,
      limitRange : 1,
      // dataCount  : 0,
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
  }

  componentWillReceiveProps(nextProps){
    // console.log('nextProps',nextProps);
    if(nextProps.BasicInfoId){
       if(nextProps.BasicInfoId.academicsInfo&&nextProps.BasicInfoId.academicsInfo.length>0){
        this.setState({
         academicData:nextProps.BasicInfoId.academicsInfo
        })
      }
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
  SubmitAcademics(event){
    event.preventDefault();
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
      "address"                   : this.refs.address.value,
      "state"                     : this.refs.state.value,
      "district"                  : this.refs.district.value,
      "pincode"                   : this.refs.pincode.value,
      "districtsCovered"          : districtsCovered,
      "blocksCovered"             : blocksCovered,
      "villagesCovered"           : this.state.selectedVillages,
      "centreInchargeName"        : this.refs.centreInchargeName.value,
      "centreInchargeContact"     : this.refs.centreInchargeContact.value,
      "centreInchargeEmail"       : this.refs.centreInchargeEmail.value,
      "MISCoordinatorName"        : this.refs.MISCoordinatorName.value,
      "MISCoordinatorContact"     : this.refs.MISCoordinatorContact.value,
      "MISCoordinatorEmail"       : this.refs.MISCoordinatorEmail.value,
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

    console.log('centreDetail',centreDetail);
    axios.post('/api/centers',centreDetail)
    .then(function(response){
      swal({
        title : response.data,
        text  : response.data
      });
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
    $('input[type=checkbox]').attr('checked', true);
  }

  componentDidMount() {
    var data = {
      limitRange : 0,
      startRange : 1,
    }
      // axios({
      //   method: 'get',
      //   url: '/api/states',
      // }).then((response)=> {
      //   this.setState({
      //       listofStates : response.data,
      //   });
      // }).catch(function (error) {
      //   console.log('error', error);
      // });


      axios({
        method: 'get',
        url: '/api/centers/list',
      }).then((response)=> {
        console.log('tableData', response.data);
        var tableData = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});
          console.log('tableData ======', tableData);
        this.setState({
          dataCount : tableData.length,
          tableData : tableData.slice(this.state.startRange, this.state.limitRange),
        });
      }).catch(function (error) {
        console.log('error', error);
      });

      var listofStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh','Maharastra'];
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
    // console.log('selectedState ',selectedState);
    this.setState({
      state : selectedState
    },()=>{
      if(this.state.state == 'Maharastra'){
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
      }else{
        var index = selectedVillages.findIndex(v => v.village === id);
        // console.log('index', index);
        selectedVillages.splice(selectedVillages.findIndex(v => v.village === id), 1);
        this.setState({
          selectedVillages : selectedVillages
        },()=>{
          console.log('selectedVillages',this.state.selectedVillages);
        });
      }
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
        FamilyID: "Maharastra",
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
        console.log('dataCount', this.state.dataCount, 'tableData', this.state.tableData);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
              <section className="content">
                <div className="">
                   <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
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
                              <label className="formLable">Select Type of Center</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
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
                              <label className="formLable">Name of Centre</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.nameOfCentre}  name="nameOfCentre" placeholder="" ref="nameOfCentre"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.nameOfCentre}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                             <label className="formLable">Address</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.address}  name="address" placeholder="" ref="address"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.CollegeName}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">State</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                                <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.selectState.bind(this)} >
                                  <option  className="hidden" value="">--Select State--</option> 
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
                              <label className="formLable">District</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox"  value={this.state.district}  ref="district" name="district"  onChange={this.handleChange.bind(this)} >
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
                              <div className="errorMsg">{this.state.errors.district}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                             <label className="formLable">Pincode</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.pincode}  name="pincode" placeholder="" ref="pincode"  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.pincode}</div>
                            </div>
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of Center Incharge</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.centreInchargeName} name="centreInchargeName" placeholder="" ref="centreInchargeName"    onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.CollegeName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of Center Incharge</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"   value={this.state.centreInchargeContact} name="centreInchargeContact" placeholder="" ref="centreInchargeContact"  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centreInchargeContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of Center Incharge</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts" name="centreInchargeEmail"  value={this.state.centreInchargeEmail} placeholder="" ref="centreInchargeEmail" value={this.state.UniversityName} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centreInchargeEmail}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of MIS Coordinator</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.MISCoordinatorName}  name="MISCoordinatorName" placeholder="" ref="MISCoordinatorName"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of MIS Coordinator</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.MISCoordinatorContact}  name="MISCoordinatorContact" placeholder="" ref="MISCoordinatorContact"  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of MIS Coordinator</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts"  value={this.state.MISCoordinatorEmail}  name="MISCoordinatorEmail" placeholder=""ref="MISCoordinatorEmail"  onChange={this.handleChange.bind(this)}/>
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
                                return(
                                  <div key={index} className="col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                                    <div className="row"> 
                                      <div className="col-lg-12 noPadding">  
                                       <div className="actionDiv">
                                          <div className="centreDetailContainer col-lg-1">
                                            <input type="checkbox" id={village} checked={this.state[village]} onChange={this.selectVillage.bind(this)}/>
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
                          <table className="table">
                            <thead>
                              <tr>
                                <th>District</th>
                                <th>Block</th>
                                <th>Villages</th>
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
                                  </tr>
                                );
                              })
                              :
                              <tr><td className="textAlignCenter" colSpan="3">Nothing to Display</td></tr>
                            }
                            </tbody>
                          </table> 
                        </div>     
                        <div className="col-lg-12">
                          <br/><button className=" col-lg-2 btn submit mt pull-right"onClick={this.SubmitAcademics.bind(this)}> Submit </button>
                        </div>                          
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          tableData={this.state.tableData}
                          dataCount={this.state.dataCount}
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