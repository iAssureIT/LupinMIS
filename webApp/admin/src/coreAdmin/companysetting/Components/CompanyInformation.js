import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';
// import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import InputMask  from 'react-input-mask';
import AddImgPublicCompanySetting          from "../../addFile/AddImgPublicCompanySetting.js";
import validate               from 'jquery-validation';

import "../../../API";
// import ImageUpload from '../../ImageUpload/ImageUpload.js';

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const companymobileRegex  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companyAddressRegex = RegExp(/^[a-zA-Z0-9\s,'/.-]*$/);
const companywebsiteRegex = RegExp(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
class CompanyInformation extends Component{
   constructor(props) {
    super(props);
    this.state = {
      companyId               : "",
      companyName             : "",
      companyContactNumber    : "",
      companyAltContactNumber : "",
      companyEmail            : "",
      companyAddressLine1     : "",
      defaultPassword         : "",
      companyDist             : "",
      companyPincode          : "",
      companyCity             : "",
      companyState            : "",
      companyCountry          : "",
      companyLogo             : "",
      logoFilename            : "",
      taluka                  : "",
      companywebsite          : "",
      data                    : [],
      submitVal               : true,
      imgArrayWSaws           : [],
      logoFilename               : "",    
      logo_Image              :"",
      "configData" : {
        dirName         : 'CompanySetting',
        deleteMethod    : 'delete',
        apiLink         : '/api/caseStudies/delete/',
        pageURL         : '/caseStudyy',
      },
      formerrors :{
        firstcompanyname : "",
        companyMobile : " ",
        companyEmailID  : " ",
        companyAddress : " ",
        companywebsitename : " ",

        country : " ",
        district : " ",
        state : " ",
        taluka : " ",

        city : " ",
        pincode : " ",
      },
      subscription : {
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    console.log("localStorage.token = ",localStorage.getItem("token"));
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
 
   /* $.validator.addMethod("regxContact", function(value, element, regexpr) { 
      return value===regexpr;
    }, "This field value is similar as contact number.");*/
    $("#companyInformationForm").validate({
      rules: {
        companyName: {
          required: true,
        },
        companyContactNumber: {
          required: true,
        },
        companyAltContactNumber: {
          // regxContact: this.refs.companyContactNumber.value
        },
        companyEmail: {
          required: true,
        },
        companywebsite: {
          required: true,
        },
        companyAddressLine1: {
          required: true,
        },
        companyCountry: {
          required: true,
        },
        companyState: {
          required: true,
        },
        companyDist: {
          required: true,
        },
        taluka: {
          required: true,
        },
        companyCity: {
          required: true,
        },
        companyPincode: {
          required: true,
        },
      }
    });
    var companyId = 1;
    axios.get('/api/companysettings/'+ companyId)
    .then( (res)=>{      
      console.log("here company data",res.data);
      this.setState({
        companyName : res.data.companyName,
        companyId   : 1,
        companyContactNumber : res.data.companyContactNumber,
        companyAltContactNumber : res.data.companyMobileNumber,
        companyEmail            : res.data.companyEmail, 
        companywebsite          : res.data.companywebsite, 
        companyAddressLine1     : res.data.companyaddress,
        companyDist             : res.data.district,
        companyPincode          : res.data.pincode,
        companyCity             : res.data.city,
        companyState            : res.data.state,
        companyCountry          : res.data.country,
        taluka                  : res.data.taluka,
        submitVal               : false,
        defaultPassword         : res.data.defaultPassword, 
        logoFilename            : res.data.logoFilename, 
        companyLogo             : res.data.companyLogo, 
      },()=>{
          console.log("1. companyLogo = ", this.state.companyLogo);
      });
      console.log("this.this.state.companyName",this.state.companyName)
    })
    .catch((error)=>{
      console.log("error = ",error);
      // alert("Something went wrong! Please check Get URL.");
    });
  }
 

  componentWillReceiveProps(nextProps) {
    if(nextProps.get && nextProps.get.length != 0){

     this.setState({
                companyName             : this.state.companyName,
                companyContactNumber    : this.state.companyContactNumber,
                companyAltContactNumber : this.state.companyAltContactNumber,
                companyEmail            : this.state.companyEmail,
                companywebsite          : this.state.companywebsite,
                companyaddress          : this.state.companyAddressLine1,
                country                 : this.state.companyCountry,
                state                   : this.state.companyState,
                district                : this.state.companyDist,
                city                    : this.state.companyCity,
                pincode                 : this.state.companyPincode,
                taluka                  : this.state.taluka,
                logoFilename            : this.state.logoFilename,
                companyLogo             : this.state.companyLogo,
                defaultPassword         : this.state.defaultPassword
     });
    }

    this.handleChange = this.handleChange.bind(this);
  }

  submitCompanyInformation=(event)=>{
    event.preventDefault();
   
    var companyInfoFormValue = {

      companyName             : this.state.companyName,
      companyContactNumber    : this.state.companyContactNumber,
      companyMobileNumber     : this.state.companyAltContactNumber,
      companyEmail            : this.state.companyEmail,
      companyAltEmail         : "",
      companywebsite          : this.state.companywebsite,
      companyaddress          : this.state.companyAddressLine1,
      logoFilename            : this.state.logoFilename,
      companyLogo             : this.state.companyLogo,
      country                 : this.state.companyCountry,
      state                   : this.state.companyState,
      district                : this.state.companyDist,
      city                    : this.state.companyCity,
      pincode                 : this.state.companyPincode,
      taluka                  : this.state.taluka,
      defaultPassword         : this.state.defaultPassword
    }//close array

     var companyInfoFormValueUpdate = {

      companyId               : 1,
      companyName             : this.state.companyName,
      companyContactNumber    : this.state.companyContactNumber,
      companyMobileNumber     : this.state.companyAltContactNumber,
      companyEmail            : this.state.companyEmail,
      companyAltEmail         : "",
      companywebsite          : this.state.companywebsite,
      companyaddress          : this.state.companyAddressLine1,
      logoFilename            : this.state.logoFilename,
      companyLogo             : this.state.companyLogo,
      country                 : this.state.companyCountry,
      state                   : this.state.companyState,
      district                : this.state.companyDist,
      city                    : this.state.companyCity,
      pincode                 : this.state.companyPincode,
      taluka                  : this.state.taluka,
      defaultPassword         : this.state.defaultPassword
    }
  
  if($("#companyInformationForm").valid()){  
    if(this.state.submitVal == true){
        axios.post('/api/companysettings',companyInfoFormValue)
        .then( (response)=> { 
          // handle success
          console.log("this is response===>>>",response);
        
           swal({
                    title: "Company Information submitted Successfully",
                    text: "Company Information submitted Successfully",
                  });
          this.setState({
        
          companyName             : "",
          companyContactNumber    : "",
          companyAltContactNumber : "",
          companyEmail            : "",
          companyAddressLine1     : "",
          companyDist             : "",
          companyPincode          : "",
          companyCity             : "",
          companyState            : "",
          companyCountry          : "",
          companyLogo             : "",
          logoFilename            : "",
          taluka                  : "",
          companywebsite          : "",
          defaultPassword         : "",
          },()=>{
            // this.getCompanySettingsData()
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          swal({
            title: "Company Information submition failed!",
            text: "Company Information submition failed!",
          });
        })
        .finally(function () {
          // always executed
        });
    }else{
      // upate function

      console.log("update axios = ",companyInfoFormValueUpdate);
      axios.patch('/api/companysettings/information',companyInfoFormValueUpdate)
        .then( (response)=> {
          // handle success
          console.log("this is response===>>>",response);
          swal({
            title: "Company Information Updated Successfully",
            text: "Company Information Updated Successfully",
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
             swal({
                    title: "Company Information updation failed!",
                    text: "Company Information updation failed!",
                  });

        });
    }
  }

      

  
  }
  handleChange(event){

    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    } );
  }
  getLogo(logo, filename){
    this.setState({
      "companyLogo" : logo,
      "logoFilename" : filename,
    },()=>{
      console.log("logoFilename",this.state.logoFilename);
      console.log("companyLogo",this.state.companyLogo)
    })

  }
  
  deleteimagelogoDirect(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this image?",
          text: "Once deleted, you will not be able to recover this image!",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("abc","Your image is deleted!");
              this.setState({
                companyLogo : ""
              })
            } else {
            swal("abc","Your image is safe!");
          }
        });
  }

  render(){
    const {formerrors} = this.state;
    console.log("companyLogo",this.state.companyLogo)

    return(
      <div className="">
        <form id="companyInformationForm"  >
          <div className="">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">  
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h4 className="basicinfotxt"><i className="fa fa-info-circle fonticons" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Basic Info</h4>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
               
                <div className="col-lg-6 col-lg-offset-6 col-md-6 col-sm-12 col-xs-12 csImageWrapper">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    {this.state.companyLogo 
                      ? 
                        // <img src={this.state.companyLogo} className="imageC"/>
                      <div className=" padTopC">
                        <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="formLable col-lg-12 col-md-12 col-sm-12 col-xs-12 row">Logo <span className="astrick">*</span></h5>
                        </div>
                        <div className="containerC">
                          <label id="logoImage" className="pull-right custFaTimes1" title="Delete image" onClick={this.deleteimagelogoDirect.bind(this)}>X</label>
                          <img src={this.state.companyLogo} alt="logo_Lupin" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageC"/>
                        </div>
                      </div>
                      :
                        <AddImgPublicCompanySetting
                            getLogo={this.getLogo.bind(this)}
                            configData = {this.state.configData} 
                            logo  = {this.state.logo} 
                            fileType   = "Image" 
                          />   
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    Organization Name
                  </label>
                  <span className="astrick">*</span>                        
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyName" 
                    data-text="firstcompanyname"
                    className="form-control areaStaes inputBox-main"
                    title="Please enter alphanumeric only"
                    value={this.state.companyName} />                        
                  {this.state.formerrors.firstcompanyname &&(
                    <span className="text-danger">{formerrors.firstcompanyname}</span> 
                  )} 
                </div>  
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >Organization ID</label><span className="astrick"></span>
                  <input id="companyId" value={this.state.companyId} onChange={this.handleChange.bind(this)} type="text" name="companyId" ref="companyId" className="form-control areaStaes inputBox-main" title="Company ID" autoComplete="off" disabled />
                </div>  
              </div>               
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >Contact Number</label><span className="astrick">*</span>
                  {/* <input className="form-control areaStaes inputBox-main" data-text="companyMobile" title="Please enter valid mobile number only" id="companyContactNumber" type="text" name="companyContactNumber" ref="companyContactNumber" value={this.state.companyContactNumber} aria-required="true" onChange={this.handleChange.bind(this)} required /> */}
                  <InputMask  mask="9999999999"  data-text="companyMobile" name="companyContactNumber" id="companyContactNumber" value={this.state.companyContactNumber}  ref="companyContactNumber" onChange={this.handleChange}  className="form-control areaStaes inputBox-main" required />
                  {this.state.formerrors.companyMobile &&(
                    <span className="text-danger">{formerrors.companyMobile}</span> 
                  )}
                </div> 
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >Alternate Contact Number</label>
                  <InputMask  mask="9999999999" className="form-control areaStaes inputBox-main" id="companyAltContactNumber" type="text" name="companyAltContactNumber" ref="companyAltContactNumber" value={this.state.companyAltContactNumber} aria-required="true" onChange={this.handleChange.bind(this)} />
                </div> 
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >Organization EmailID</label><span className="astrick">*</span>
                  <input className="form-control areaStaes inputBox-main" 
                    title="Please enter valid email address" 
                    id="companyEmail" type="text"
                    data-text="companyEmailID" 
                    name="companyEmail" ref="companyEmail" 
                    value={this.state.companyEmail} aria-required="true"
                    onChange={this.handleChange.bind(this)} required/>

                  {this.state.formerrors.companyEmailID &&  (
                    <span className="text-danger">{formerrors.companyEmailID}</span> 
                  )}
               </div> 
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >Organization Website</label><span className="astrick">*</span>
                  <input className="form-control areaStaes inputBox-main" title="Please enter valid webside address"   data-text="companywebsitename"  id="companywebsite" type="text" name="companywebsite" ref="companywebsite" value={this.state.companywebsite} aria-required="true" onChange={this.handleChange.bind(this)} required/>
                  {this.state.formerrors.companywebsitename &&(
                      <span className="text-danger">{formerrors.companywebsitename}</span> 
                  )}
                </div> 
              </div>
              {/*<div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >Default Password</label><span className="astrick">*</span>
                  <input className="form-control areaStaes inputBox-main" title="Please enter valid Password"   data-text="password"  id="defaultPassword" type="text" name="defaultPassword" ref="defaultPassword" value={this.state.defaultPassword} aria-required="true" onChange={this.handleChange.bind(this)} required/>
                  {this.state.formerrors.password &&(
                      <span className="text-danger">{formerrors.password}</span> 
                  )}
                </div> 
              </div>*/}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <h4 className="basicinfotxt"><i className="fa fa-map-marker fonticons" aria-hidden="true"></i>&nbsp;&nbsp;Address</h4>
          </div>
          <div className="basicinfocmpset"> 
            <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 compForm">
              {/* <div className="form-group valid_box col-lg-12 col-md-4 col-sm-12 col-xs-12">
                  <label className="control-label statelabel locationlabel" >Organisation Address</label><span className="astrick">*</span>
                  <input className="form-control areaStaes inputBox-main" title="Please enter valid address" id="companyAddressLine1" type="text" name="companyAddressLine1" ref="companyAddressLine1" value={this.state.companyAddressLine1} aria-required="true" onChange={this.handleChange.bind(this)} required/>
                  {this.state.formerrors.country &&(
                        <span className="text-danger">{formerrors.country}</span> 
                      )}
              </div>  */}
              <div className="form-group valid_box col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                  Organization Address
                  </label>
                  <span className="astrick">*</span>                          
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyAddressLine1" 
                    data-text="companyAddress"
                    className="form-control areaStaes inputBox-main"
                    title="Please enter alphanumeric only"
                    value={this.state.companyAddressLine1} />                          
                  {this.state.formerrors.companyAddress &&(
                    <span className="text-danger">{formerrors.companyAddress}</span> 
                  )}
                </div>  
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
              {/* <div className="form-group valid_box col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                    <label className="control-label statelabel locationlabel" >Country<span className="astrick">*</span></label>
                    <select className="stateselection countrySelect form-control" title="Please select country" id="companyCountry" value={this.state.companyCountry}  ref="companyCountry" name="companyCountry" onChange={this.handleChange} required>
                    <option value="">-Select-</option>
                
                    </select>
              </div>
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-xs-12 col-sm-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >State<span className="astrick">*</span></label>
                  <select className="stateselection stateSelect form-control" title="Please select state" id="companyState" value={this.state.companyState}  ref="companyState" name="companyState" onChange={this.handleChange} required>
                    <option value="">-Select-</option>
                  
                    </select> 
                </div> 
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-xs-12 col-sm-12">
                <div className="form-group">
                      <label className="control-label statelabel locationlabel" >District<span className="astrick">*</span></label>
                     <select className="stateselection districtSelect form-control" title="Please select district" id="companyDist" value={this.state.companyDist}  ref="companyDist" name="companyDist" onChange={this.handleChange} required>
                     <option value="">-Select-</option>
                  
                    </select> 
                </div>
              </div> */}
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    Country
                  </label>
                  <span className="astrick">*</span>                          
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyCountry" 
                    data-text="country"
                    className="form-control areaStaes inputBox-main"
                    value={this.state.companyCountry}
                    title="Please enter alphanumeric only" />                          
                  {this.state.formerrors.country &&(
                    <span className="text-danger">{formerrors.country}</span> 
                  )}
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    State
                  </label>
                  <span className="astrick">*</span>
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyState" 
                    data-text="state"
                    className="form-control areaStaes inputBox-main"
                    value={this.state.companyState}

                    title="Please enter alphanumeric only" />
                  
                  {this.state.formerrors.state &&(
                    <span className="text-danger">{formerrors.state}</span> 
                  )}
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    District
                  </label>
                  <span className="astrick">*</span>
                  
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyDist" 
                    data-text="district"
                    className="form-control areaStaes inputBox-main"
                    value={this.state.companyDist}

                    title="Please enter alphanumeric only" />
                  
                  {this.state.formerrors.district &&(
                    <span className="text-danger">{formerrors.district}</span> 
                  )}
                </div>  
              </div>
            </div>
            <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 compForm">
              {/* <div className="form-group valid_box col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                          <label className="control-label statelabel locationlabel" >Taluka<span className="astrick">*</span></label>
                         <select className="stateselection talukaSelect form-control" title="Please select taluka" id="taluka" value={this.state.taluka}  ref="taluka" name="taluka" onChange={this.handleChange} required>
                        <option value="">-Select-</option>
                    
                        </select>  
                    </div>
                  </div>
                  <div className="form-group valid_box col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >City<span className="astrick">*</span></label>
                       <select className="stateselection villageSelect form-control" title="Please select city" id="companyCity" value={this.state.companyCity}  ref="companyCity" name="companyCity" onChange={this.handleChange} required>
                      <option value="">-Select-</option>
                     
                      </select> 
                    </div>
                  </div>
                  <div className="form-group valid_box col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                      <label className="control-label statelabel locationlabel" >Pin Code<span className="astrick">*</span></label>
                      <select className="stateselection  form-control" title="Please select pincode" id="companyPincode" value={this.state.companyPincode} ref="companyPincode" name="companyPincode" onChange={this.handleChange} required>
                      <option value="">-Select-</option>
                    
                      </select>
                    </div>
                  </div> */}

              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    Taluka
                  </label>
                  <span className="astrick">*</span>
                  
                  <input
                    onChange={this.handleChange} 
                    type="text" name="taluka" 
                    data-text="taluka"
                    value={this.state.taluka}
                    className="form-control areaStaes inputBox-main"
                    title="Please enter alphanumeric only" />
                  
                  {this.state.formerrors.taluka &&(
                    <span className="text-danger">{formerrors.taluka}</span> 
                  )}
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    City
                  </label>
                  <span className="astrick">*</span>
                  
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyCity" 
                    data-text="city"
                    value={this.state.companyCity}

                    className="form-control areaStaes inputBox-main"
                    title="Please enter alphanumeric only" />
                  
                  {this.state.formerrors.city &&(
                    <span className="text-danger">{formerrors.city}</span> 
                  )}
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="control-label statelabel locationlabel" >
                    Pincode
                  </label>
                  <span className="astrick">*</span>
                  
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyPincode" 
                    data-text="pincode"
                    value={this.state.companyPincode}
                    className="form-control areaStaes inputBox-main"
                    title="Please enter alphanumeric only" />
                  
                  {this.state.formerrors.pincode &&(
                    <span className="text-danger">{formerrors.pincode}</span> 
                  )}
                </div>  
              </div>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
            <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit pull-right" id="btnCheck"  onClick={this.submitCompanyInformation.bind(this)}>
              {this.state.submitVal
                ?
                  "Submit"
                : 
                  "Update"
              }  
            </button>
          </div>
        </form>         
      </div>
    );
  }
 }

 export default CompanyInformation;