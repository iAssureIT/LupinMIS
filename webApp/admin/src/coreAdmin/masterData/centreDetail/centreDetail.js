import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";

import 'bootstrap/js/tab.js';
import 'react-table/react-table.css';
import "./centreDetail.css";

      
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
            tabtype : "location",

      fields: {},
      errors: {}
    }
    this.changeTab = this.changeTab.bind(this); 
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
     "typeOfCentre"              :this.refs.typeOfCentre.value,
      "nameOfCentre"             :this.refs.nameOfCentre.value,
      "address"                  :this.refs.address.value,
      "state"                    :this.refs.state.value,
      "district"                 :this.refs.district.value,
      "pincode"                  :this.refs.pincode.value,
      "centreInchargeName"       :this.refs.centreInchargeName.value,
      "centreInchargeContact"    :this.refs.centreInchargeContact.value,
      "centreInchargeEmail"      :this.refs.centreInchargeEmail.value,
      "MISCoordinatorName"       :this.refs.MISCoordinatorName.value,
      "MISCoordinatorContact"    :this.refs.MISCoordinatorContact.value,
      "MISCoordinatorEmail"      :this.refs.MISCoordinatorEmail.value,
      "districtCovered"          :this.refs.districtCovered.value,
      "blockCovered"             :this.refs.blockCovered.value,
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  /*  if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }*/
  }

  componentWillReceiveProps(nextProps){
    console.log('nextProps',nextProps);
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
  isTextKey(evt)
  {
   var charCode = (evt.which) ? evt.which : evt.keyCode
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
    var id2 = this.state.uID;
/*    if (this.validateForm()) {
*/    var centreDetail= 
    {
     "typeOfCentre"              :this.refs.typeOfCentre.value,
      "nameOfCentre"             :this.refs.nameOfCentre.value,
      "address"                  :this.refs.address.value,
      "state"                    :this.refs.state.value,
      "district"                 :this.refs.district.value,
      "pincode"                  :this.refs.pincode.value,
      "centreInchargeName"       :this.refs.centreInchargeName.value,
      "centreInchargeContact"    :this.refs.centreInchargeContact.value,
      "centreInchargeEmail"      :this.refs.centreInchargeEmail.value,
      "MISCoordinatorName"       :this.refs.MISCoordinatorName.value,
      "MISCoordinatorContact"    :this.refs.MISCoordinatorContact.value,
      "MISCoordinatorEmail"      :this.refs.MISCoordinatorEmail.value,
    };
    console.log("centreDetail",centreDetail);
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

    this.setState({
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
      fields:fields
    });
    axios
    .post('https://jsonplaceholder.typicode.com/posts',{centreDetail})
    .then(function(response){
      console.log(response);
    })
    .catch(function(error){
      console.log(error);
    });
    console.log("academicValues =>",centreDetail);
    centreDetailArray.push(centreDetail);
    alert("Data inserted Successfully!")
/*    }
*/
  }

    componentDidMount() {
       axios
      .post('https://jsonplaceholder.typicode.com/Get')
      .then(function(response){
        console.log(response);
      })
    }

    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
    console.log("tabtype",this.state.tabtype);
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
                           <h4 className="pageSubHeader">Centre Details</h4>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">Select Type of Centre</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" value={this.state.typeOfCentre} ref="typeOfCentre" name="typeOfCentre" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option  className="" >Development Centre</option>
                                  <option  className="" >CSR Centre</option>
                                 {/* <option>Post-Graduate</option>
                                  <option>Under Graduate</option>
                                  <option>10+2</option>
                                  <option>10th</option>*/}
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.typeOfCentre}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of Centre</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
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
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.address}  name="address" placeholder="" ref="address"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.CollegeName}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">State</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                                <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option  className="" >Maharastra</option>
                                  <option  className="" >Utterpradesh</option>
                                  {/*<option>Post-Graduate</option>
                                  <option>Under Graduate</option>
                                  <option>10+2</option>
                                  <option>10th</option>*/}
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.state}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">District</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox"  value={this.state.district}  ref="district" name="district"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option  className="" >Pune</option>
                                  <option  className="" >Mumbai</option>
                                  
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.district}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                             <label className="formLable">Pincode</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
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
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
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
                                <input type="text"   className="form-control inputBox nameParts"   value={this.state.centreInchargeContact} name="centreInchargeContact" placeholder="" ref="centreInchargeContact"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centreInchargeContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of Center Incharge</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts" name="centreInchargeEmail"  value={this.state.centreInchargeEmail} placeholder=""ref="centreInchargeEmail" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
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
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.MISCoordinatorContact}  name="MISCoordinatorContact" placeholder="" ref="MISCoordinatorContact"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of MIS Coordinator</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts"  value={this.state.MISCoordinatorEmail}  name="MISCoordinatorEmail" placeholder=""ref="MISCoordinatorEmail"  onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorEmail}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="col-lg-12 ">
                           <hr />
                        </div>
                        <div className="col-lg-12 ">
                           <h5 className="pageSubHeader">Add Villages</h5>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">District Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.districtCovered}  ref="districtCovered" name="districtCovered"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Maharastra</option>
                                  <option>Maharastra</option>
                                  <option>Maharastra</option>
                                  
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.districtCovered}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">Block Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blockCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.blockCovered}  ref="blockCovered" name="blockCovered"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Pune</option>
                                  <option>Pune</option>
                                  <option>Pune</option>
                                 
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.blockCovered}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight mt ">
                            <div className=" col-md-3  col-lg-3 col-sm-12 col-xs-12 ">
                              <label className="formLable faintCoolor">Villages Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                <div className="row"> 
                                  <div className="col-lg-12 noPadding">  
                                   <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 1</label>
                                  </div>
                                  <div className="col-lg-12 noPadding">  
                                    <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 2</label>
                                  </div>
                                </div>  
                              </div>
                            </div>
                            <div className=" col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                              <label className="formLable faintCoolor"></label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                <div className="row"> 
                                  <div className="col-lg-12 noPadding">  
                                   <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 1</label>
                                  </div>
                                  <div className="col-lg-12 noPadding">  
                                    <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 2</label>
                                  </div>
                                </div>  
                              </div>
                            </div>
                            <div className=" col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                              <label className="formLable faintCoolor"></label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt ">
                                <div className="row"> 
                                  <div className="col-lg-12 noPadding">  
                                   <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 1</label>
                                  </div>
                                  <div className="col-lg-12 noPadding">  
                                    <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 2</label>
                                  </div>
                                </div>  
                              </div>
                            </div>
                            <div className=" col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                              <label className="formLable faintCoolor"></label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                <div className="row"> 
                                  <div className="col-lg-12 noPadding">  
                                   <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 1</label>
                                  </div>
                                  <div className="col-lg-12 noPadding">  
                                    <div className="actionDiv">
                                      <div className="centreDetailContainer col-lg-1">
                                        <input type="checkbox" name="check1" id="sameCheck" />
                                      <span className="centreDetailCheck"></span>
                                      </div>
                                    </div>                            
                                    <label className="centreDetaillistItem"> Village 2</label>
                                  </div>
                                </div>  
                              </div>
                            </div>
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                            
                          </div> 
                        </div><br/>
                        <div className="col-lg-12">
                          <br/><button className=" col-lg-2 btn submit pull-right"onClick={this.SubmitAcademics.bind(this)}> Add </button>
                        </div>                        
                        <div className="col-lg-12 ">
                           <hr />
                        </div>
                        <div className="col-lg-12 ">
                          <h5 className="">List of Villages</h5>
                        </div>                  
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >  
                          <ReactTable 
                            data      = {dataM}
                            columns     = {columnsM}
                            sortable    = {true}
                            defaultPageSiz  = {5}
                            minRows     = {3} 
                            className       = {"-striped -highlight"}
                            showPagination  = {true}
                          />
                        </div> 
                        <div className="col-lg-12">
                          <br/><button className=" col-lg-2 btn submit mt pull-right"onClick={this.SubmitAcademics.bind(this)}> Submit </button>
                        </div>                          
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >  
                          <ReactTable 
                            data      = {data}
                            columns     = {columns}
                            sortable    = {true}
                            defaultPageSiz  = {5}
                            minRows     = {3} 
                            className       = {"-striped  mt -highlight"}
                            showPagination  = {true}
                          />
                        </div> 
                      </form>
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