
import React, { Component }      from 'react';
import InputMask                 from 'react-input-mask';
import $ from "jquery";
import axios from 'axios';
import swal                      from 'sweetalert';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import './userManagement.css';

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const nameRegex     = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const mobileRegex   = RegExp(/^[0-9][0-9]{9}$/);
const emailRegex    = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
class CreateUser extends Component {


  constructor(props) {
    super(props);
    this.state = {
      show              : true,
      office            : null,
      allPosts          : null,
      firstname         : "",
      role              : "--select--",
      lastname          :"",
      signupEmail       : "",
      mobileNumber         : "",
      adminRolesListData: "",
      
      formerrors :{
         firstname    : "",
         lastname     :"",
         signupEmail  : "",
         mobileNumber    : "",
         role         : "",
      },

    };
    this.handleChange = this.handleChange.bind(this);
  }

 handleChange(event){
    const datatype = event.target.getAttribute('data-text');
    const {name,value} = event.target;
    let formerrors = this.state.formerrors;
    
    // console.log("value",value);
    switch (datatype){
      case 'firstname' : 
        formerrors.firstname = nameRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
        break;

      case 'lastname' : 
       formerrors.lastname = nameRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
       break;

      case 'mobileNumber' : 
       formerrors.mobileNumber = mobileRegex.test(value) && value.length>0 ? '' : "Please enter a valid Contact Number";
       break;

      case 'signupEmail' : 
       formerrors.signupEmail = emailRegex.test(value)  && value.length>0? "":"Please enter a valid Email ID";
       break;

      case 'role' : 
        formerrors.role =  value!== "--select--" ? "":"Please select role";
        break;

      case 'centerName' : 
        formerrors.role =  value!== "--select--" ? "":"Please select Center";
        break;
      
      default :
      break;

    }
    
    this.setState({ formerrors,
      [name]:value
    } );
  }


    componentDidMount() {
      this.getRole();
      this.getCenters();
      axios
      .get('/api/companysettings/list')
      .then(
        (res)=>{
          // console.log('res', res);
          const postsdata = res.data;
          // console.log('postsdata',postsdata);
          this.setState({
            allPosts : postsdata,
          });
          // console.log("allPosts___________________",this.state.allPosts);
          let locationArray =[];
          if(this.state.allPosts!==null){
            locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
          }else{
             locationArray = "no data";
          }
          this.setState({
            office : locationArray,
          });
          
        // here for list
                  var data = {
                                    "startRange"        : this.state.startRange,
                                    "limitRange"        : this.state.limitRange, 
                            }
                      axios.post('/api/users/userslist', data)
                      .then( (res)=>{      
                        // console.log("herer",res);
                        var tableData = res.data.map((a, i)=>{
                          return {
                                    _id             : a._id,
                                    fullName        : a.fullName,
                                    emailId         : a.emailId,
                                    mobileNumber       : a.mobileNumber, 
                                    status          : a.status, 
                                    roles           : a.roles,
                                    centerName      : a.centerName, 
                          }
                        })
                        this.setState({
                              completeDataCount : res.data.length,
                              tableData     : tableData,          
                            },()=>{
                              // console.log('tableData', this.state.tableData);
                            })
                      })
                      .catch((error)=>{
                        console.log("error = ",error);
                        // alert("Something went wrong! Please check Get URL.");
                      });


        }
      )
      .catch((error)=>{

        console.log("error = ",error);
        // alert("Something went wrong! Please check Get URL.");
         });  
    }  

    createUser(event){
      event.preventDefault();
      const formValues = {
          "firstName"       : this.state.firstname,
          "lastName"        : this.state.lastname,
          "emailId"         : this.state.signupEmail,
          "countryCode"     : "+91",
          "mobileNumber"    : this.state.mobileNumber,
          "pwd"             : "user123",
          
          "status"          : "Active",
          "roles"           :  this.state.role,
          "center_ID"       : this.refs.centerName.value.split('|')[1],
          "centerName"      : this.refs.centerName.value.split('|')[0],
        }

        if(this.state.firstname!=="" && this.state.lastname !=="" && this.state.signupEmail && this.state.mobileNumber && this.state.role !== "--select--"){
           axios.post('/api/users', formValues)
                .then( (res)=>{
                 
                     swal({
                    title: "User added successfully",
                    text: "User added successfully",
                  });
                    this.setState({
                      firstname   : "",
                      lastname    : "",
                      signupEmail : "",
                      mobileNumber   : "",
                      role        : "",
                      centerName  : ""
                    })
                    
                    // this.refs.office.value = "",
                    this.setState({show: false})

                    var data = {
                      "startRange"        : this.state.startRange,
                      "limitRange"        : this.state.limitRange, 
                    }
                                  
                    this.props.getData(0, 10);
                    var modal = document.getElementById("CreateUserModal");
                    modal.style.display = "none";
                    $('.modal-backdrop').remove();
                    this.props.history.push("/umlistofusers");       
                })
              .catch((error)=>{
                console.log("error = ",error);
                this.setState({show: false})
              });
        }else{ 
                  swal({
                    title: "Please enter mandatory fields",
                    text: "Please enter mandatory fields",
                  });
          console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }


    }

  getRole(){
    axios({
      method: 'get',
      url: '/api/roles/list',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          adminRolesListData : response.data
        },()=>{
        // console.log('adminRolesListData', this.state.adminRolesListData);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  getCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofCenters : response.data
        },()=>{
        // console.log('listofCenters', this.state.listofCenters);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  render() {
    const {formerrors} = this.state;
    return (
      <div>
        <div className="modal fade" id="CreateUserModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg " role="document">
            <div className="modal-content UMmodalContent ummodallftmg ummodalmfdrt  ">
              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close " data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="exampleModalLabel">Add New User</h4>
              </div>
              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="hideModal">
                  <div className="userBox-body">
                    <div className="">
                      <form id="signUpUser">
                        <div className="">
                          <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                            <div className="formLable">First Name <span className="requiredsign">*</span></div>
                            <span className="blocking-span">
                              <div className="input-group inputBox-main  new_inputbx " >
                                <div className="input-group-addon remove_brdr inputIcon">
                                  <i className="fa fa-user-circle fa "></i>
                                </div>  
                                <input type="text" style={{textTransform:'capitalize'}}
                                 className="form-control UMname inputBox form-control  has-content"
                                  id="firstname" ref="firstname" name="firstname" data-text="firstname" placeholder="First Name"  onChange={this.handleChange} 
                                  value={this.state.firstname}/>
                              </div>   
                            </span>
                            {this.state.formerrors.firstname &&(
                              <span className="text-danger">{this.state.formerrors.firstname}</span> 
                            )}
                          </div> 
                          <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <div className="formLable">Last Name <span className="requiredsign">*</span></div>
                            <span className="blocking-span ">
                              <div className="input-group inputBox-main  new_inputbx " >
                                <div className="input-group-addon remove_brdr inputIcon">
                                  <i className="fa fa-user-circle fa "></i>
                                </div>  
                                <input type="text"className="form-control UMname inputBox form-control  has-content" 
                                 id="lastname" ref="lastname" name="lastname" data-text="lastname" onChange={this.handleChange} 
                                 value={this.state.lastname} placeholder="Last Name" />
                              </div>   
                            </span>
                            {this.state.formerrors.lastname &&(
                              <span className="text-danger">{this.state.formerrors.lastname}</span> 
                            )}
                          </div>                                                      
                        </div>
                        <div className="valid_box">
                         <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                          <div className="formLable">Email ID <span className="requiredsign">*</span></div>
                            <span className="blocking-span col-lg-12 col-md-12 col-xs-12 col-sm-12 emailfixdomain">
                              <div className="input-group inputBox-main   " >
                               <div className="input-group-addon remove_brdr inputIcon">
                                <i className="fa fa-envelope"></i>
                              </div> 
                                <input type="text" className="formFloatingLabels form-control inputBox newinputbox" ref="signupEmail" name="signupEmail" id="signupEmail" data-text="signupEmail" onChange={this.handleChange}  value={this.state.signupEmail}
                                 placeholder="Email"/>                                                              
                             </div>   
                          </span>
                               {this.state.formerrors.signupEmail &&(
                                      <span className="text-danger">{this.state.formerrors.signupEmail}</span> 
                                    )}
                          </div>                                                     
                          <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <div className="formLable">Mobile Number <span className="requiredsign">*</span></div>
                            <span className="blocking-span ">
                              <div className="input-group inputBox-main  new_inputbx " >
                                <div className="input-group-addon remove_brdr inputIcon">
                                  <i className="fa fa-mobile"></i>
                                </div>  
                                <InputMask mask="9999999999" pattern="^(0|[1-9][0-9-]*)$" 
                                 className= "form-control UMname inputText form-control inputBox has-content"
                                  ref="mobileNumber" name="mobileNumber" id="mobileNumber" data-text="mobileNumber" placeholder="Mobile No"
                                   onChange={this.handleChange} value={this.state.mobileNumber}/>
                              </div>   
                            </span>
                            {this.state.formerrors.mobileNumber &&(
                              <span className="text-danger">{ this.state.formerrors.mobileNumber}</span> 
                            )}
                          </div>                                                      
                        </div>
                        <div className="valid_box">
                          <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
                            <div className="formLable mrgtop6">Role<span className="requiredsign"></span></div>
                            <div className="input-group inputBox-main" id="role">
                              <span className="input-group-addon inputIcon">
                                 <i className="fa fa-crosshairs InputAddOn fa"></i>
                              </span> 
                              <select className="form-control inputBox" value={this.state.role} onChange={this.handleChange} ref ="role" id="role" name="role" data-text="role">
                                <option  hidden> --Select-- </option>
                                {
                                    this.state.adminRolesListData && this.state.adminRolesListData.length > 0 ? 
                                    this.state.adminRolesListData.map((data, index)=>{
                                      // console.log(data);
                                      return(
                                        <option key={index} value={data.role}>{data.role}</option>
                                      );
                                    })
                                    :
                                    null
                                  }  
                              </select>
                            </div>
                             {this.state.formerrors.role &&(
                                <span className="text-danger">{ this.state.formerrors.role}</span> 
                              )}
                          </div>
                          <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
                            <div className="formLable mrgtop6">Center Name<span className="requiredsign"></span></div>
                            <div className="input-group inputBox-main" id="centerName">
                              <span className="input-group-addon inputIcon">
                                 <i className="fa fa-crosshairs InputAddOn fa"></i>
                              </span> 
                              <select className="form-control inputBox" value={this.state.centerName} ref ="centerName" id="centerName" name="centerName" data-text="centerName" onChange={this.handleChange} >
                                <option hidden> --Select-- </option>
                                  {
                                    this.state.listofCenters && this.state.listofCenters.length > 0 ? 
                                    this.state.listofCenters.map((data, index)=>{
                                      // console.log(data);
                                      return(
                                        <option key={index} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                                      );
                                    })
                                    :
                                    null
                                  }  
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <button className="col-lg-2 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn btnSubmit topMargin outlinebox" type="submit" onClick={this.createUser.bind(this)} id="CreateUserModal" >Register</button>
                        </div>    
                      </form>
                                {/*<form id="signUpUser" onSubmit={this.createUser.bind(this)}>
                                    <div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                     <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent valid_box">
                                          <div className="">First Name <div className="requiredsign">*</div></div>
                                          <span className="blocking-span">
                                              <input type="text" style={{textTransform:'capitalize'}} className="form-control UMname inputText tmsUserAccForm has-content" id="firstname" ref="firstname" name="firstname"/>
                                          </span>
                                      </div>

                                     <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent valid_box">
                                          <div className="">Last Name <div className="requiredsign">*</div></div>
                                          <span className="blocking-span row">
                                             <input type="text"className="form-control UMname inputText tmsUserAccForm has-content" id="lastname" ref="lastname" name="lastname" />
                                          </span>
                                      </div>

                                      <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent valid_box">
                                          <div className="">Email ID <div className="requiredsign">*</div></div>
                                          <span className="blocking-span col-lg-12 col-md-12 col-xs-12 col-sm-12 emailfixdomain">
                                            <input type="text" className="formFloatingLabels form-control" ref="signupEmail" name="signupEmail" id="signupEmail"/>
                                          </span>
                                      </div>

                                      <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent valid_box">
                                          <div className="">Mobile Number <div className="requiredsign">*</div></div>
                                          <span className="blocking-span">
                                             <InputMask mask="99999-99999" pattern="^(0|[1-9][0-9-]*)$"   className= "form-control UMname inputText tmsUserAccForm has-content" ref="mobileNumber" name="mobileNumber" id="mobileNumber"/>
                                          </span>
                                      </div>

                                      <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                          <input className="col-lg-2 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn btnSubmit outlinebox" type="submit" value="REGISTER" />
                                     </div>   

                                    </div> 
                                </form>*/}
                    </div>  
                  </div>  
                </div>
              </div>
            </div>                      
          </div>
        </div>
      </div>
    );
  } 
}


export default CreateUser;/*withTracker(props =>{

    return{
        usrcrt : props.usrcrt,  
    } 
})*//*(CreateUser);*/