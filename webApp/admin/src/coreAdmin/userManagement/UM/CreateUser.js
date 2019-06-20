
import React, { Component }      from 'react';
import InputMask                 from 'react-input-mask';
import $ from "jquery";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
axios.defaults.baseURL = 'http://localhost:3006';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class CreateUser extends Component {


  constructor(props) {
    super(props);
    this.state = {

    };
  }


    componentDidMount() {}  

    createUser(event){
    event.preventDefault();
    const formValues = {
        "firstname"    : this.refs.firstname.value,
        "lastname"     : this.refs.lastname.value,
        "email"        : this.refs.signupEmail.value,
        "mobNumber"    : this.refs.mobNumber.value,
        "pwd"          : "user123",
        "role"         : "User",
        "status"       : "Active"
      }

    axios.post('/users', formValues)
      .then( (res)=>{
        console.log(res);
        if(res.status == 201){
          // alert("Data inserted Successfully!")
          this.refs.firstname.value = '';
          this.refs.lastname.value  = '';
          this.refs.Email.value  = '';
          this.refs.mobNumber.value = '';
        }
      })
      .catch((error)=>{
        console.log("error = ",error);
        // alert("Something went wrong! Please check Get URL.");
      });
  

    }

    /*fun(formValues){  
    console.log('formValues',formValues);
    var allPosts = this.state.allPosts;
    allPosts.push(formValues);
    this.setState({
      allPosts : allPosts
    });
  }
*/
    render() {

       return (
            <div>
                        <div className="modal fade" id="CreateUserModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog modal-lg " role="document">
                            <div className="modal-content modalContent ummodallftmg ummodalmfdrt col-lg-12 ">
                              <div className="modal-header userHeader">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="exampleModalLabel">Add New User</h4>
                              </div>
                             <div className="modal-body">
                              <div className="hideModal">
                               {/* <section className="viewContent">*/}
                                    <div className="">
                                      <div className="">
                                          <div className="">                                        
                                            <section className="">                                          
                                                    <div className="box-body">
                                                        <div className="">
                                                          <form id="signUpUser" onSubmit={this.createUser.bind(this)}>
                                                              <div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                                               <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                                                    <label className="">First Name <label className="requiredsign">*</label></label>
                                                                    <span className="blocking-span">
                                                                        <input type="text" style={{textTransform:'capitalize'}} className="form-control UMname inputText tmsUserAccForm has-content" id="firstname" ref="firstname" name="firstname"/>
                                                                    </span>
                                                                </div>

                                                               <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                                                    <label className="">Last Name <label className="requiredsign">*</label></label>
                                                                    <span className="blocking-span row">
                                                                       <input type="text"className="form-control UMname inputText tmsUserAccForm has-content" id="lastname" ref="lastname" name="lastname" />
                                                                    </span>
                                                                </div>

                                                                <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent">
                                                                    <label className="">Email ID <label className="requiredsign">*</label></label>
                                                                    <span className="blocking-span col-lg-12 col-md-12 col-xs-12 col-sm-12 emailfixdomain">
                                                                      <input type="text" className="formFloatingLabels form-control" ref="signupEmail" name="signupEmail" id="signupEmail"/>
                                                                    </span>
                                                                </div>

                                                                <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent">
                                                                    <label className="">Mobile Number <label className="requiredsign">*</label></label>
                                                                    <span className="blocking-span">
                                                                       <InputMask mask="99999-99999" pattern="^(0|[1-9][0-9-]*)$"   className= "form-control UMname inputText tmsUserAccForm has-content" ref="mobNumber" name="mobNumber" id="mobNumber"/>
                                                                    </span>
                                                                </div>

                                                                <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                                                    <input className="col-lg-2 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn btnSubmit outlinebox" type="submit" value="REGISTER" />
                                                               </div>   

                                                              </div> 
                                                          </form>
                                                        </div>  
                                                    </div>
                                                
                                          </section>
                                        </div>
                                      </div>
                                    </div>
                                  
                               {/* </section>*/}
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