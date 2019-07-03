import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';

import axios from 'axios';

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const companycontact  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companylocation = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companybuilding = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
class CompanyLocation extends Component{
  constructor(props) {
    super(props);
    this.state = {
      companyLocation       : "",
      Emailid               : "",
      companycontact        : "", 
      companyaltcontact     : "",
      companybuildingblock  : "",
      companylandmark       : "",
      companyCountry        : "",
      companyState          : "",
      
      companyDist           : "",
      taluka                : "",
      companyCity           : "",
      companyPincode        : "",
      submitVal            : true,
      formerrors :{
        companylocation : "",
        companyMobile : " ",
        companyArea  : " ",

      },

    };
    this.handleChange = this.handleChange.bind(this);
    
  }
  // handleChange(event){
  //   const target = event.target;
  //   const name   = target.name;
  //   this.setState({
  //     [name]: event.target.value,
  //   });
  // }
  
  handleChange(event){
    // const target = event.target;
    // const {name , value}   = event.target;
    const datatype = event.target.getAttribute('data-text');
    const {name,value} = event.target;
    let formerrors = this.state.formerrors;
    
    console.log("datatype",datatype);
    switch (datatype){
     
      case 'companylocation' : 
       formerrors.companylocation = companylocation.test(value) ? '' : "Please Enter valid reuirement";
       break;

       case 'companyMobile' : 
       formerrors.companyMobile = companycontact.test(value) ? '' : "Please Enter Numbers only";
       break;

       case 'companyArea' : 
        formerrors.companyArea = companybuilding.test(value) ? '' : "Please Enter valid reuirement";
       break;
       
       default :
       break;

      //  case 'companyName' : 
      //  formerrors.companyName = value.length < 1 && value.lenght > 0 ? 'Minimum 1 Character required' : "";
      //  break;

    }
    // this.setState({formerrors,})
    this.setState({ formerrors,
      [name]:value
    } );
  }
   
  componentDidMount(){
   
  }
  submitCompanyLocation(event){
    event.preventDefault();
    // var sessionVar = Session.get('location');
  
    var companyLocationFormValue ={
      companyLocation           : this.state.companyLocation,
      companyEmailid            : this.state.Emailid,
      companycontact            : this.state.companycontact,
      companyaltcontact         : this.state.companyaltcontact,
      companybuildingblock      : this.state.companybuildingblock,
      companylandmark           : this.state.companylandmark,
      companyCountry            : this.state.companyCountry,
      companyState              : this.state.companyState,
      
      companyDist               : this.state.companyDist,
      taluka                    : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode,
  
    }//close array
    if(formValid(this.state.formerrors)){
    axios.patch(' http://apitgk3t.iassureit.com',{companyLocationFormValue})
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  }else{
    swal("Please enter mandatory fields", "", "warning");
    console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
  }
}

  render(){
    const {formerrors} = this.state;
    return(
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
             {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header">
                <h4 className="lettersp MasterBudgetTitle">Location Details</h4>
              </div>*/}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Location Details</h4>
              </div>
               <hr className="compySettingHr" />
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <form id="companyLocationForm" className="companyLocationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Company Location</label><span className="astrick">*</span>
                            <input value={this.state.companyLocation} onChange={this.handleChange} data-text="companylocation" type="text" title="Please enter valid location" id="companyLocation" name="companyLocation" className="form-control CLcompanyLocation inputValid" required/>
                            {this.state.formerrors.companylocation &&(
                              <span className="text-danger">{formerrors.companylocation}</span> 
                            )}
                        </div>
                    </div> 
                  </div>
                 
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Contact Number</label><span className="astrick">*</span>
                            <input id="companycontact" value={this.state.companycontact} onChange={this.handleChange} data-text="companyMobile"  type="text" name="companycontact" title="Please enter valid number" className="form-control companyNo inputValid " required/>
                            {this.state.formerrors.companyMobile &&(
                              <span className="text-danger">{formerrors.companyMobile}</span> 
                            )}
                        </div>
                    </div> 
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                
                  
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Block Name/Building</label><span className="astrick">*</span>
                            <input value={this.state.companybuildingblock} onChange={this.handleChange} data-text="companyArea" type="text" id="companybuildingblock" title="Please enter valid address" name="companybuildingblock" className="form-control CLcompanyAddress inputValid " required/>
                            {this.state.formerrors.companyArea &&(
                              <span className="text-danger">{formerrors.companyArea}</span> 
                            )}
                        </div>
                    </div> 
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Near by Landmark</label>
                             <input value={this.state.companylandmark} onChange={this.handleChange} type="text" id="companylandmark"  name="companylandmark" className="form-control CLcompanylandmark inputValid" />
                        </div>
                    </div> 
                  </div>
                  

                </div>

                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                  <div className="form-group">
                      <label className="control-label statelabel locationlabel" >Country<span className="astrick">*</span></label>
                      <select className="stateselection countrySelect form-control" title="Please select country" id="companyCountry" value={this.state.companyCountry}  ref="companyCountry" name="companyCountry" onChange={this.handleChange} required>
                      <option value="">-Select-</option>
                    
                      </select>
                  </div>
                  </div>
                  <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                      <label className="control-label statelabel locationlabel" >State<span className="astrick">*</span></label>
                      <select className="stateselection stateSelect form-control" title="Please select state" id="companyState" value={this.state.companyState}  ref="companyState" name="companyState" onChange={this.handleChange} required>
                        <option value="">-Select-</option>
                      
                        </select> 
                    </div> 
                  </div>
                  <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                          <label className="control-label statelabel locationlabel" >District<span className="astrick">*</span></label>
                         <select className="stateselection districtSelect form-control" title="Please select district" id="companyDist" value={this.state.companyDist}  ref="companyDist" name="companyDist" onChange={this.handleChange} required>
                         <option value="">-Select-</option>
                       
                        </select> 
                    </div>
                  </div>
                  </div>
                  <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                    <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Taluka<span className="astrick">*</span></label>
                           <select className="stateselection talukaSelect form-control" title="Please select taluka" id="taluka" value={this.state.taluka}  ref="taluka" name="taluka" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                         
                          </select>  
                      </div>
                    </div>
                    <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >City<span className="astrick">*</span></label>
                           <select className="stateselection villageSelect form-control" title="Please select city" id="companyCity" value={this.state.companyCity}  ref="companyCity" name="companyCity" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                          
                          </select> 
                      </div>
                    </div>
                    <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Pin Code<span className="astrick">*</span></label>
                          <select className="stateselection  form-control" title="Please select pincode" id="companyPincode" value={this.state.companyPincode} ref="companyPincode" name="companyPincode" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                        
                          </select>
                      </div>
                    </div>
                  </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  {/* <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck" onClick={this.submitCompanyLocation.bind(this)}>Submit</button> */}

                  <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck" onClick={this.submitCompanyLocation.bind(this)} >
                    {this.state.submitVal
                      ?
                        "Submit"
                      : 
                        "Update"
                    }  
                  </button>
                </div>
                </div>
              </form>
              
            </div>
        </div>
      </div>


      );
  }

 }

export default CompanyLocation;
