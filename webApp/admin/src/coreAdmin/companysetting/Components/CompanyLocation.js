import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';

import axios from 'axios';
import InputMask  from 'react-input-mask';

import "../css/CompanySetting.css";
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
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
const numberRegex = RegExp(/[0-9]+(?:-[0-9]+)?(,[0-9]+(?:-[0-9]+)?)*/);
class CompanyLocation extends Component{

  constructor(props) {
    super(props);
    this.state = {
      EditLocId             : props.locId ? props.locId : "", 
      companyLocation       : "Head Office",
      Emailid               : "",
      companycontact        : "", 
      companyaltcontact     : "",
      companybuildingblock  : "",
      companylandmark       : "",
      companyCountry        : "",
      companyState          : "",
      companyArea           : "",
      companyDist           : "",
      taluka                : "",
      companyCity           : "",
      companyPincode        : "",
      submitVal             : true,
      pincodeArea           : "",
     
     companyArea1           : "",

      allPosts : null,
        allLoc   : null,
        editlocId : null,

        required : "",

      formerrors :{
        companylocation     : "",
        companyMobile       : " ",
        companyArea         : " ",
        pincodeArea        : "",

       /* companyArea1         : " ",*/

        country             : " ",
        district            : " ",
        state               : " ",
        taluka              : " ",
        blockName           : "",
        city                : " ",
        pincode             : " ",
    

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
       formerrors.companylocation = companylocation.test(value)  && value.length>0 ? '' : "Please Enter valid Input";
       break;

       case 'companyMobile' :

       formerrors.companyMobile = companycontact.test(value)? '' : "Please enter a valid Contact Number ";
       break;

       case 'companyArea' : 
        formerrors.companyArea = companybuilding.test(value)   && value.length>0? '' : "Please Enter valid Input";
       break;

      /* case 'companyArea1' : 
       
          formerrors.companyArea1 = numberRegex.test(value)   && value.length>0? '' : "Please Enter valid Input";
          
         break;*/

       case 'blockName' : 
        formerrors.blockName = value.length>0? '' : "Please Enter valid Block Name";
       break;
       
       
      case 'country' : 
      formerrors.country = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;
    
      case 'state' : 
        formerrors.state = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;
    
      case 'district' : 
        formerrors.district = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;

      case 'taluka' : 
        formerrors.taluka = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;

      case 'city' : 
        formerrors.city = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;

      case 'pincode' : 
        formerrors.pincode = companypincodeRegex.test(value)  && value.length>0 ? '' : "Invalid Pincode";
      break;

      /*case 'pincodeArea' : 
        formerrors.pincodeArea = numberRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;*/


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



  componentWillReceiveProps(nextProps){
    // this.setState({
    //   'templateType'    : nextProps.data.templateType,
    //   'templateName'    : nextProps.data.templateName,
    //   'subject'     : nextProps.data.subject,
    //   'content'     : nextProps.data.content,
    // });

   

  }
   
  componentDidMount(){
    $('.subjectRow').css({'display':'none'});
    
    $('.subjectRowError').css({'display':'none'});
    axios
      .get('/api/tgkSpecificcompanysettings/list')
      .then(
        (res)=>{
          console.log('res', res);
          const postsdata = res.data;
          console.log('postsdata',postsdata);
          this.setState({
            allPosts : postsdata,
          });


        let locationArray =[];
        if(this.state.allPosts!=null){

        
         locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
        }else{
           locationArray = "no data";
        }
        
          this.setState({
            allLoc : locationArray,
          });
          console.log("locationArray", locationArray);
        console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);


        }
      )
      .catch((error)=>{

        console.log("error = ",error);
        // alert("Something went wrong! Please check Get URL.");
         });        

  }
  submitCompanyLocation=(event)=>{
    event.preventDefault();
    // var sessionVar = Session.get('location');
   // var companyId : 5;


      


    var companyLocationFormValue ={
      Location                  : this.state.companyLocation,
      companyId                 : 1,
      // companyEmailid            : this.state.Emailid,
      contactnumber             : this.state.companycontact,
      // companyaltcontact         : this.state.companyaltcontact,
      blockname                 : this.state.companybuildingblock,
      landmark                  : this.state.companylandmark,
      companyCountry            : this.state.companyCountry,
      companyState              : this.state.companyState,
      companyDistrict           : this.state.companyDist,
      companytaluka             : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode,
      areaName                  : this.state.companyArea,
      pincodesCovered           :  this.state.pincodeArea,
      
    
    }//close array

    var companyLocationFormValueupdate ={
      companyId                 : 1,
      locationID                : this.state.editlocId,
      Location                  : this.state.companyLocation,
      // companyEmailid            : this.state.Emailid,
      contactnumber             : this.state.companycontact,
      // companyaltcontact         : this.state.companyaltcontact,
      blockname                 : this.state.companybuildingblock,
      landmark                  : this.state.companylandmark,
      companyCountry            : this.state.companyCountry,
      companyState              : this.state.companyState,
      companyDistrict           : this.state.companyDist,
      companytaluka             : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode,
      areaName                  : this.state.companyArea,
      pincodesCovered           :  this.state.pincodeArea,
      
    
    }

    console.log("companyLocationFormValue ____________________",companyLocationFormValue);
    console.log("this.state.formerrors",formValid(this.state.formerrors));

  if(this.state.companycontact!="" && this.state.companyCountry!="" && this.state.companyState!= "" 
    && this.state.companyDist!= "" && this.state.taluka != ""       && this.state.companyCity!= ""
    && this.state.companyPincode != "" && this.state.companyArea != ""
     && this.state.companybuildingblock != "" && this.state.companyLocation != "" ){
      console.log("submitVal state",this.state.submitVal);



      if(this.state.submitVal == true)
      {

        if(this.state.companyLocation  === 'Head Office' || this.state.companyLocation  === 'Sales Agent Office' )
        {
           $('.subjectRowError').css({'display':'none'});
         
            axios.patch('/api/tgkSpecificcompanysettings/location/add',companyLocationFormValue)
              .then( (response)=> {
                // handle success
                console.log(response);
                swal("Location Added Successfully", "", "success");
                this.setState({
                  companyLocation         :"",
                  companycontact          :"",
                  companybuildingblock    :"",
                  companylandmark         :"",
                  companyCountry          :"",
                  companyState            :"",
                  companyDist             :"",
                  taluka                  :"",
                  companyCity             :"",
                  companyPincode          :"",
                  companyArea             :"",
                  pincodeArea             :"",
                  areaName                :"",
                });


                        // here for table

                          axios
                        .get('/api/tgkSpecificcompanysettings/list')
                        .then(
                          (res)=>{
                            console.log('res', res);
                            const postsdata = res.data;
                            console.log('postsdata',postsdata);
                            this.setState({
                              allPosts : postsdata,
                            });
                          let locationArray =[];
                          if(this.state.allPosts!=null){
                           locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
                          }else{
                             locationArray = "no data";
                          }
                            this.setState({
                              allLoc : locationArray,
                            });
                          //   console.log("locationArray", locationArray);
                          // console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);
                          }
                        )
                        .catch((error)=>{
                          console.log("error = ",error);
                          // alert("Something went wrong! Please check Get URL.");
                           });        

                    })
                    .catch(function (error) {
                      // handle error
                      console.log(error);
                    })
          

      // here close of if head & sale
      }else if(this.state.companyLocation  === 'Field Agent Office'){
            

            if(this.state.pincodeArea == "")
            {
              $('.subjectRowError').css({'display':'block'});
            }else{
               $('.subjectRowError').css({'display':'none'});

                  axios.patch('/api/tgkSpecificcompanysettings/location/add',companyLocationFormValue)
              .then( (response)=> {
                // handle success
                console.log(response);
                swal("Location Added Successfully", "", "success");

                this.setState({
                  companyLocation         :"",
                  companycontact          :"",
                  companybuildingblock    :"",
                  companylandmark         :"",
                  companyCountry          :"",
                  companyState            :"",
                  companyDist             :"",
                  taluka                  :"",
                  companyCity             :"",
                  companyPincode          :"",
                  companyArea             :"",
                  pincodeArea             :"",
                  areaName                :"",
                });
                        // here for table
                          axios
                        .get('/api/tgkSpecificcompanysettings/list')
                        .then(
                          (res)=>{
                            console.log('res', res);
                            const postsdata = res.data;
                            console.log('postsdata',postsdata);
                            this.setState({
                              allPosts : postsdata,
                            });
                          let locationArray =[];
                          if(this.state.allPosts!=null){
                           locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
                          }else{
                             locationArray = "no data";
                          }
                            this.setState({
                              allLoc : locationArray,
                            });
                          //   console.log("locationArray", locationArray);
                          // console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);
                          }
                        )
                        .catch((error)=>{
                          console.log("error = ",error);
                          // alert("Something went wrong! Please check Get URL.");
                           });        
                    })
                    .catch(function (error) {
                      // handle error
                      console.log(error);
                    })
            }
        console.log("pincode covererd",this.state.pincodeArea);
                
      }

    // here close submit value true
    }else{

        console.log("here value of edit ",companyLocationFormValueupdate);

        if(this.state.companyLocation  === 'Head Office' || this.state.companyLocation  === 'Sales Agent Office' )
        {
          // here axios
           $('.subjectRow').css({'display':'none'});

           axios.patch('/api/tgkSpecificcompanysettings/location/edit',companyLocationFormValueupdate)
        .then( (response)=> {
          // handle success
          console.log(response);
          swal("Location Updated Successfully", "", "success");

          this.setState({
            companyLocation         :"",
            companycontact          :"",
            companybuildingblock    :"",
            companylandmark         :"",
            companyCountry          :"",
            companyState            :"",
            companyDist             :"",
            taluka                  :"",
            companyCity             :"",
            companyPincode          :"",
            companyArea             :"",
            pincodeArea             :"",
            areaName                :"",
            submitVal               : false,
          });


                  // here for table

                    axios
                    .get('/api/tgkSpecificcompanysettings/list')
                    .then(
                      (res)=>{
                        console.log('res', res);
                        const postsdata = res.data;
                        console.log('postsdata',postsdata);
                        this.setState({
                          allPosts : postsdata,
                        });


                      let locationArray =[];
                      if(this.state.allPosts!=null){

                      
                       locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
                      }else{
                         locationArray = "no data";
                      }
                      
                        this.setState({
                          allLoc : locationArray,
                          submitVal               : false,
                        });
                      //   console.log("locationArray", locationArray);
                      // console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);

                      }
                    )
                    .catch((error)=>{

                      console.log("error = ",error);
                      // alert("Something went wrong! Please check Get URL.");
                       });        

        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })

        }else if(this.state.companyLocation  === 'Field Agent Office'){
            

            if(this.state.pincodeArea == "")
            {
              $('.subjectRowError').css({'display':'block'});
            }else{
               $('.subjectRowError').css({'display':'none'});

               // here axiox


           axios.patch('/api/tgkSpecificcompanysettings/location/edit',companyLocationFormValueupdate)
        .then( (response)=> {
          // handle success
          console.log(response);
          swal("Location Updated Successfully", "", "success");

          this.setState({
            companyLocation         :"",
            companycontact          :"",
            companybuildingblock    :"",
            companylandmark         :"",
            companyCountry          :"",
            companyState            :"",
            companyDist             :"",
            taluka                  :"",
            companyCity             :"",
            companyPincode          :"",
            companyArea             :"",
            pincodeArea             :"",
            areaName                :"",
            submitVal               : false,
          });
           $('.subjectRow').css({'display':'none'});

                  // here for table

                    axios
                    .get('/api/tgkSpecificcompanysettings/list')
                    .then(
                      (res)=>{
                        console.log('res', res);
                        const postsdata = res.data;
                        console.log('postsdata',postsdata);
                        this.setState({
                          allPosts : postsdata,
                        });


                      let locationArray =[];
                      if(this.state.allPosts!=null){

                      
                       locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
                      }else{
                         locationArray = "no data";
                      }
                      
                        this.setState({
                          allLoc : locationArray,
                        });
                      //   console.log("locationArray", locationArray);
                      // console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);

                      }
                    )
                    .catch((error)=>{

                      console.log("error = ",error);
                      // alert("Something went wrong! Please check Get URL.");
                       });        

        })
        .catch(function (error) {
          // handle error
          console.log("updated already",error);

        })

             
          }
       
       }
       
        // update axios
      }
      
  } else{
    swal("Please enter mandatory fields", "", "warning");
    console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
  }
}

selectType(event){
    event.preventDefault();
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    },()=>{
      if(this.state.companyLocation  === 'Head Office' || this.state.companyLocation  === 'Sales Agent Office' ){
        $('.subjectRow').css({'display':'none'});
         
      }else if(this.state.companyLocation  === 'Field Agent Office'){
        $('.subjectRow').css({'display':'block'});
       
      }
    });
    
  }

  editLoc(event){

        event.preventDefault();
      var id = event.target.id;
      console.log("id of edit location",id);
      
      this.setState({
        editlocId:id,
        submitVal:false,
      });   

        var FormValue ={
          companyId : 1,
          locationID : id,
        }

        console.log("here r formValues",FormValue);

          axios.post('/api/tgkSpecificcompanysettings/companysettinglocation/',FormValue)
        .then( (response)=> {
          // handle success
          console.log("here loaction res+++++++++++++++++++++++++++",response);
         
          var maindata = response.data.data[0].companyLocationsInfo[0];
          console.log("main res---------------------", maindata);

          this.setState({
            companyLocation         : maindata.Location ,
            companycontact          : maindata.contactnumber,
            companybuildingblock    : maindata.blockname,
            companylandmark         : maindata.landmark,
            companyCountry          : maindata.companyCountry,
            companyState            : maindata.companyState,
            companyDist             : maindata.companyDistrict,
            taluka                  : maindata.companytaluka,
            companyCity             : maindata.companyCity,
            companyPincode          : maindata.companyPincode,
            companyArea             : maindata.areaName,
            pincodeArea             : maindata.pincodesCovered,
          });

          if(maindata.Location  === 'Head Office' || maindata.Location  === 'Sales Agent Office' ){
            $('.subjectRow').css({'display':'none'});
             
          }else if(maindata.Location  === 'Field Agent Office'){
            $('.subjectRow').css({'display':'block'});
           
          }

        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });



      // axiox for get data
      // set to all state

      // this.props.selectedUser(this.state.editlocId);
      // here i got id

      
      }

      deleteLoc(event){
        event.preventDefault();
      var id = event.target.id;
      console.log("id of deleteLoc",id);
      var formValues={
        companyId  : 1,
        locationID : id,
      }
      const token = '';

      axios.patch('/api/tgkSpecificcompanysettings/location/remove',formValues)
        .then( (response)=> {
          // handle success
          console.log("this is response===>>>",response);
          swal("Location deleted successfully","", "success");

              axios
              .get('/api/tgkSpecificcompanysettings/list')
              .then(
                (res)=>{
                  console.log('res', res);
                  const postsdata = res.data;
                  console.log('postsdata',postsdata);
                  this.setState({
                    allPosts : postsdata,
                  });


                let locationArray =[];
                if(this.state.allPosts!=null){

                
                 locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
                }else{
                   locationArray = "no data";
                }
                
                  this.setState({
                    allLoc : locationArray,
                  });
                  console.log("locationArray", locationArray);
                console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);


                }
              )
              .catch((error)=>{

                console.log("error = ",error);
                // alert("Something went wrong! Please check Get URL.");
                 });        


          
        }).catch(function (error) {
          // handle error
          console.log(error);
         
        })
        .finally(function () {
          // always executed
        });

      

      }

  render(){
    
    
    
    const {formerrors} = this.state;
    return(
        <div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
             {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header">
                <h4 className="lettersp MasterBudgetTitle">Location Details</h4>
              </div>*/}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Location Details TGKSpecific</h4>
              </div>
               <hr className="compySettingHr" />
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <form id="companyLocationForm" className="companyLocationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Company Location</label><span className="astrick">*</span>
                           
                              <select className="form-control" value={this.state.companyLocation} onChange={this.selectType.bind(this)} ref ="companyLocation" id="companyLocation" name="companyLocation" data-text="companylocation">
                                                    <option  disabled> --select-- </option>
                                                    <option value="Head Office" > Head Office </option>
                                                    <option value="Sales Agent Office" > Sales Agent Office </option>
                                                    <option value="Field Agent Office" > Field Agent Office </option>
                                                     
                                                </select>
                           {/* <input value={this.state.companyLocation} onChange={this.handleChange} data-text="companylocation" type="text" title="Please enter valid location" id="companyLocation" name="companyLocation" className="form-control CLcompanyLocation inputValid" required/>
                           */} {this.state.formerrors.companylocation &&(
                              <span className="text-danger">{formerrors.companylocation}</span> 
                            )}
                        </div>
                    </div> 
                  </div>

                  
                 
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Contact Number</label><span className="astrick">*</span>
                              <InputMask  mask="9999999999"  id="companycontact" value={this.state.companycontact} onChange={this.handleChange} data-text="companyMobile"  type="text" name="companycontact" title="Please enter valid number" className="form-control companyNo inputValid " required/>
                            {this.state.formerrors.companyMobile &&(
                              <span className="text-danger">{formerrors.companyMobile}</span> 
                            )}
                        </div>
                    </div> 
                  </div>
                </div>

                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Block Name/Building</label><span className="astrick">*</span>
                            <input value={this.state.companybuildingblock} onChange={this.handleChange} data-text="blockName" type="text" id="companybuildingblock" title="Please enter valid address" name="companybuildingblock" className="form-control CLcompanyAddress inputValid " required/>
                            {this.state.formerrors.blockName &&(
                              <span className="text-danger">{formerrors.blockName}</span> 
                            )}
                        </div>
                    </div> 
                  </div>



                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Area Name</label><span className="astrick">*</span>
                             <input value={this.state.companyArea} onChange={this.handleChange} type="text" data-text="companyArea" id="companyArea" ref="companyArea" name="companyArea" className="form-control CLcompanylandmark inputValid" />
                               {this.state.formerrors.companyArea &&(
                              <span className="text-danger">{formerrors.companyArea}</span> 
                            )}
                        </div>
                    </div> 
                  </div>
                  

                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm marbtm30">

                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Near by Landmark</label>
                             <input value={this.state.companylandmark} onChange={this.handleChange} type="text" id="companylandmark"  name="companylandmark" className="form-control CLcompanylandmark inputValid" />
                        </div>
                    </div> 
                  </div>


                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding  subjectRow  ">
                      <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                         <label className="control-label statelabel locationlabel" >Pincodes Covered</label><span className="astrick">*</span>
                           
                       <textarea rows="2" cols="37" className="form-control" data-text="companyArea1" id="pincodeArea" name="pincodeArea" ref="pincodeArea" value={this.state.pincodeArea} onChange={this.handleChange}  >
                        </textarea>
                       {/* <input value={this.state.companyArea1} onChange={this.handleChange} type="text" data-text="companyArea1" id="companyArea" ref="companyArea" name="companyArea" className="form-control CLcompanylandmark inputValid" />
                        */}       
                         {/*this.state.formerrors.companyArea1 &&(*/
                                        <span className="text-danger subjectRowError">Please enter at least one pincode</span> 
                                      /*)*/}
                        </div>  
                      </div>
                    </div>

                </div>

                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  {/* <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
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
                  </div> */}

                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            Country
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyCountry" 
                            data-text="country"
                            className="form-control areaStaes"
                            value={this.state.companyCountry}
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.country &&(
                            <span className="text-danger">{formerrors.country}</span> 
                          )}

                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            State
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyState" 
                            data-text="state"
                            className="form-control areaStaes"
                            value={this.state.companyState}

                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.state &&(
                            <span className="text-danger">{formerrors.state}</span> 
                          )}

                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            District
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyDist" 
                            data-text="district"
                            className="form-control areaStaes"
                            value={this.state.companyDist}

                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.district &&(
                            <span className="text-danger">{formerrors.district}</span> 
                          )}

                      </div>  
                    </div>

                  </div>
                  <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                    {/* <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
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
                    </div> */}
                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
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
                            className="form-control areaStaes"
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.taluka &&(
                            <span className="text-danger">{formerrors.taluka}</span> 
                          )}

                      </div>  
                    </div>


                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
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

                            className="form-control areaStaes"
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.city &&(
                            <span className="text-danger">{formerrors.city}</span> 
                          )}

                      </div>  
                    </div>


                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
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
                            className="form-control areaStaes"
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.pincode &&(
                            <span className="text-danger">{formerrors.pincode}</span> 
                          )}

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


          <div className="tablebox row">  
                    <div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 zeropadd">
                      <table className="table iAssureITtable-bordered table-striped table-hover">
                        <thead className="tempTableHeader">
                          <tr className="">
                            <th className="umDynamicHeader srpadd textAlignCenter"> Company Location </th>
                            <th className="umDynamicHeader srpadd textAlignCenter"> Contact Number </th>
                            <th className="umDynamicHeader srpadd textAlignCenter"> Block Name </th>
                            <th className="umDynamicHeader srpadd textAlignCenter"> District </th>
                            <th className="umDynamicHeader srpadd textAlignCenter"> City </th>
                            <th className="umDynamicHeader srpadd textAlignCenter"> Location Code </th>
                            <th className="umDynamicHeader srpadd textAlignCenter"> Actions </th>

                          </tr>
                        </thead>
                        <tbody>
                        { this.state.allLoc != null ?
                          this.state.allLoc[0].map( (locData, index)=>{
                          /*console.log('locData of 0 here',locData);*/
                           return( 
                            <tr>
                            
                                <td className="textAlignLeft">{locData.Location}</td>
                                <td className="textAlignLeft">{locData.contactnumber}</td>
                                <td className="textAlignLeft">{locData.blockname}</td>
                                <td className="textAlignLeft">{locData.companyDistrict}</td>
                                <td className="textAlignLeft">{locData.companyCity}</td>
                                <td className="textAlignLeft">{locData.officeLocationid}</td>

                                <td className="roleTextCenter">         
                                {/*data-toggle="modal" title="Delete" data-target={`#${locData._id}-edit`}  */} 
                                  <i className="fa fa-pencil editTcon editIcon pointerCls"   title="Edit" id={locData._id} onClick={this.editLoc.bind(this)} ></i>
                                  &nbsp;&nbsp;
                                  <i className="deleteIcon roleDelete  redFont fa fa-trash delIcon mar0 detailsCenter"  id="" title="Edit Department Name" data-toggle="modal" title="Delete" data-target={`#${locData._id}-rm`} ></i>
                                </td>

                                <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${locData._id}-rm`}  role="dialog">
                                            <div className=" modal-dialog adminModal adminModal-dialog">
                                                 <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                        <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
                                              <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
                                                <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
                                                  <span aria-hidden="true">&times;</span>
                                                </button>
                                              </div>
                                            </div>
                                                      <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                                         <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this location?</h4>
                                                      </div>
                                                      
                                                      <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                           <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                                                           </div>
                                                           <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                <button id={locData._id} onClick={this.deleteLoc.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
                                                           </div>
                                                      </div>
                                                 </div>
                                            </div>
                                       </div>


                                       <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${locData._id}-edit`}  role="dialog">
                                            <div className=" modal-dialog adminModal adminModal-dialog">
                                                 <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                        <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
                                              <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
                                                <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
                                                  <span aria-hidden="true">&times;</span>
                                                </button>
                                              </div>
                                            </div>
                                                      <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                      
                                                      <label className="textAlignLeft">Location </label>
                                          <input type="text" ref="roleName" className="form-control rolesField" required/>
                                        
                                                      </div>
                                                      
                                                      <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                           <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                                                           </div>
                                                           <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                <button id={locData._id} onClick={this.editLoc.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">SUBMIT</button>
                                                           </div>
                                                      </div>
                                                 </div>
                                            </div>
                                       </div>


                                <div id="edit" className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" role="dialog">
                                  <div className="modal-dialog adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12" role="document">
                                    <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                      <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel1">Edit Role</h4>
                                        <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                                                      <button type="button" className="adminCloseButton" data-dismiss="modal" data-target="edit">&times;</button>
                                                  </div>
                                      </div>
                                      <div className="modal-body addressModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                      <form className="editroles">
                                        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12 col-sm-12 paddingLeftz addRoleMarginBtm">
                                          <label className="textAlignLeft">Location </label>
                                          <input type="text" ref="roleName" className="form-control rolesField" required/>
                                        </div>
                                        <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <div className="form-group col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-xs-12 col-sm-12">
                                            <label>&nbsp;</label>
                                              <button type="button" id="" className="btn adminFinish-btn" data-dismiss="modal">Edit Role</button>
                                          </div>
                                        </div>
                                      </form>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                            </tr>
                          
                          )
                          
                          })
                        
                        :
                        null
                      }
                        </tbody>
                      </table>
                    </div>
                    </div>

      </div>


      );
  }

 }

export default CompanyLocation;
