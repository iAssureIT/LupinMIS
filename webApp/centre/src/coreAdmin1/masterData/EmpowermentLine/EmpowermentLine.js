import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import ReactTable         from "react-table";

import 'react-table/react-table.css';

import "./EmpowermentLine.css";

class EmpowermentLine extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "QualificationLevel"  :"",
      "Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",
      academicData          :[],
      "uID"                 :"",
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {}
    }
        this.changeTab = this.changeTab.bind(this); 

  }
 
  handleChange(event){
    event.preventDefault();
   /* this.setState({
      "QualificationLevel"   : this.refs.QualificationLevel.value,          
      "Qualification"        : this.refs.Qualification.value,          
      "Specialization"       : this.refs.Specialization.value,
      "Mode"                 : this.refs.Mode.value, 
      "Grade"                : this.refs.Grade.value,
      "PassoutYear"          : this.refs.PassoutYear.value,
      "UniversityName"       : this.refs.UniversityName.value,
      "City"                 : this.refs.City.value,
      "CollegeName"          : this.refs.CollegeName.value,
      "State"                : this.refs.State.value,
      "Country"              : this.refs.Country.value,
    });*/
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
    if (this.validateForm()) {
    var academicValues= 
    {
    "QualificationLevel"   : this.refs.QualificationLevel.value,          
    "Qualification"        : this.refs.Qualification.value,          
    "Specialization"       : this.refs.Specialization.value,
    "Mode"                 : this.refs.Mode.value, 
    "Grade"                : this.refs.Grade.value,
    "PassoutYear"          : this.refs.PassoutYear.value,
    "UniversityName"       : this.refs.UniversityName.value,
    "City"                 : this.refs.City.value,
    "CollegeName"          : this.refs.CollegeName.value,
    "State"                : this.refs.State.value,
    "Country"              : this.refs.Country.value,
    };

    let fields = {};
    fields["QualificationLevel"] = "";
    fields["Qualification"] = "";
    fields["Specialization"] = "";
    fields["Mode"] = "";
    fields["Grade"] = "";
    fields["PassoutYear"] = "";
    fields["CollegeName"] = "";
    fields["UniversityName"] = "";
    fields["City"] = "";
    fields["State"] = "";
    fields["Country"] = "";
    this.setState({
      "QualificationLevel"  :"",
      "Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",
      fields:fields
    });
    axios
    .post('https://jsonplaceholder.typicode.com/posts',{academicValues})
    .then(function(response){
      console.log(response);
    })
    .catch(function(error){
      console.log(error);
    });
    console.log("academicValues =>",academicValues);
    academicArray.push(academicValues);
    console.log("add value",academicValues);      
    alert("Data inserted Successfully!")
    }

  }

    componentDidMount() {
     
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
        Header: ' ',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-3">
              <div className=" col-lg-offset-1 checkActivityContainer">
                <input type="checkbox" name="check1" id="sameCheck" />
              <span className="Activitycheckmark"></span>
              </div>
            </div>
            )     
          },
        {
        Header: 'Sr No',
        accessor: 'srno',
        },
        
        {
        Header: 'Family ID',
        accessor: 'FamilyID', 
        }, {
        Header: 'Name of Beneficiary',
        accessor: 'NameofBeneficiary', 
        }, {
        Header: 'Beneficiary ID',
        accessor: 'BeneficiaryID', 
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
                              Empowerment Line                           
                          </div>
                          <hr className="hr-head container-fluid row"/>
                        </div>
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                  {/*<div className="col-lg-12 ">
                     <h4 className="pageSubHeader">Activity Report</h4>
                  </div>*/}
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                    
                    <div className=" col-md-6 col-sm-6 col-xs-12 ">
                      <label className="formLable">Enter SDG Goal</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="Qualification" >
                        {/*<div className="input-group-addon inputIcon">
                          <i className="fa fa-graduation-cap fa"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox toUpper"  placeholder="" name="Qualification" ref="Qualification"  onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.Qualification}</div>
                    </div>
                    <div className=" col-md-6 col-sm-6 col-xs-12 ">
                      <label className="formLable">Sector</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                        <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  onChange={this.handleChange.bind(this)} >
                          <option  className="hidden" >--select--</option>
                          <option>Water Resource Foundation</option>
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                    </div>

                  </div> 
                </div><br/>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                    <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Activity </label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                        <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  onChange={this.handleChange.bind(this)} >
                          <option  className="hidden" >--select--</option>
                        {/*  <option>Post-Graduate</option>
                          <option>Under Graduate</option>
                          <option>10+2</option>
                          <option>10th</option>*/}
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                    </div>
                    <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Sub-Activity</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                        <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  onChange={this.handleChange.bind(this)} >
                          <option  className="hidden" >--select--</option>
                          {/*<option>Post-Graduate</option>
                          <option>Under Graduate</option>
                          <option>10+2</option>
                          <option>10th</option>*/}
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                    </div>
                    
                  </div> 
                </div><br/>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Unit Cost</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-building fa iconSize14"></i>
                        </div>*/}
                        <input type="text"   className="form-control inputBox nameParts" name="CollegeName" placeholder="" ref="CollegeName"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.CollegeName}</div>
                    </div>
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Quantity</label>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-university fa iconSize14"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.UniversityName}</div>
                    </div>
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Quantity</label>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-university fa iconSize14"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.UniversityName}</div>
                    </div>
                     
                  </div> 
                </div><br/>
                <div className="col-lg-12 ">
                   <h4 className="pageSubHeader">Financial Sharing</h4>
                </div>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">LHWRF</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="CollegeName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-building fa iconSize14"></i>
                        </div>*/}
                        <input type="text"   className="form-control inputBox nameParts" name="CollegeName" placeholder="" ref="CollegeName"  value={this.state.CollegeName}  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.CollegeName}</div>
                    </div>
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">NABARD</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-university fa iconSize14"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.UniversityName}</div>
                    </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Bank Loan</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-university fa iconSize14"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.UniversityName}</div>
                    </div>
                    
                  </div> 
                </div><br/>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Govt. Schemes</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-building fa iconSize14"></i>
                        </div>*/}
                        <input type="text"   className="form-control inputBox nameParts" name="CollegeName" placeholder="" ref="CollegeName"  value={this.state.CollegeName}  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.CollegeName}</div>
                    </div>
                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Direct Beneficiary Cont.</label>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-university fa iconSize14"></i>
                        </div>
                        */}<input type="text" className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.UniversityName}</div>
                    </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Indirect Beneficiary Cont.</label>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                        {/*<div className="input-group-addon inputIcon">
                         <i className="fa fa-university fa iconSize14"></i>
                        </div>
                        */}<input type="text" className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName" value={this.state.UniversityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                      </div>
                      <div className="errorMsg">{this.state.errors.UniversityName}</div>
                    </div>
                    
                  </div> 
                </div><br/>
                
                
            
                <div className="col-lg-12">
                  <br/><button className=" col-lg-2 btn submit pull-right"onClick={this.SubmitAcademics.bind(this)}> Submit</button>
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
export default EmpowermentLine