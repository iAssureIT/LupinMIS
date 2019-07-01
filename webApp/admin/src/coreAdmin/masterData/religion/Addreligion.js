import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import axios from "axios";
import $ from "jquery";
import moment from 'moment';
import './Addreligion.css';

    class Addreligion extends Component {

      constructor(props){
        super(props);
        this.state = {
          'roleSett': '',
          'firstname':'',
          'startRange': 0,
          'limitRange':10,
          'counter': 1,
          'dataRange':10,
          'adminShowAll':'Admin',
          'negativeCounter' : 2,
          'usersListData' : false,
          'paginationArray': [],
          'department'  : 'all',
          'blockActive' : 'all',
          'roleListDropdown':'all',
          'resetPasswordConfirm' : '',
          'resetPassword': '',

          Religion       : '',
          Nationality         : '',
          ReligionId      : '',
          toggleUploadBtn : 'Bulk Upload',
          options       : 'manual',
          data      : '',


          fields: {},
           errors: {}


         
          }       
      }


      handleChange(event)
     {
      event.preventDefault();
      this.setState({
          "Religion"  : this.refs.Religion.value,          
       
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
    
 submitBasicInfo(event)
  {   
     event.preventDefault();
         if (this.validateForm()) {
          var religionValues= {
            "Religion" : this.refs.Religion.value,          
            
          }
      axios
          .post('http://jsonplaceholder.typicode.com/posts', { religionValues })
          .then( (res)=>{
            if(res.status == 201){
              // alert("Data inserted Successfully!")
            console.log(res);
              
            }
          })
          .catch();
       /*  contactArray.push(contactValues);
          this.setState({
            contactData : contactArray
          })
*/
        let fields = {};
        fields["Religion"] = "";
       
        this.setState({
                    "Religion"                           : "",          
                     fields:fields
        });
        alert("Data inserted Successfully!")
          }
              
      }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["Religion"]) {
        formIsValid = false;
        errors["Religion"] = "This field is required.";
      }
      if (typeof fields["Religion"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^[A-Za-z]+[0-9]*$/);
        if (!pattern.test(fields["Religion"])) {
          formIsValid = false;
          errors["Religion"] = "Please enter Religion.";
        }
      }
                 
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

     



          componentWillReceiveProps(nextProps){
        /*var Religion = nextProps.sortedDesc;

        this.setState({
          Religion : nextProps.religion,
         
        
          data      : nextProps.sortedDesc,
        });


          window.onscroll = function() {myFunction()};

           var header = document.getElementById("myHeader0");
           // var sticky = header.offsetTop;

           function myFunction() {
             if (window.pageYOffset > sticky) {
               header.classList.add("sticky");
             } else {
               header.classList.remove("sticky");
             }
           }

        $(function() {
            $(window).on("scroll", function() {
                if($(window).scrollTop() > 250) {
                    $(".header1").addClass("activ");
                } else {
                    //remove the background property so it comes transparent again (defined in your css)
                   $(".header1").removeClass("activ");
                }
            });
        });*/

      }

      toggleBulkBtn(event) {
        /*event.preventDefault();
        if (this.state.toggleUploadBtn == 'Bulk Upload') {
      
          var toggleVal = 'Country Bulk Upload';
          $("#bulkuploads").css('display', 'block');
          $("#addcountryform").css('display', 'none');
        } else {
        
          var toggleVal = 'Bulk Upload';
          $("#addcountryform").css('display', 'block');
          $("#bulkuploads").css('display', 'none');

        }
        this.setState({
          'toggleUploadBtn': toggleVal,
        });*/

      }

    

      componentDidUpdate(){
       /* $('.pagination'+this.state.counter).addClass("active");
        Session.set('pageUMNumber',this.state.counter);
        // if(Session.get("usermanagementcount"))*/
      }


      updateReligion(event){
       /* event.preventDefault();
          var ReligionId    = this.state.ReligionId;
          var religion  = {
            "Religion": this.state.Religion,
          }
          if($('#Religionform').valid()){ 
          Meteor.call('updateReligion', ReligionId, religion,
                    (error, result)=> { 
                        if (error) {
                            console.log ( error ); 
                        } //info about what went wrong 
                        else {
                          swal({
                              title: 'abc',
                              text: "Religion Modified Successfully!",
                              type: 'success',
                              showCancelButton: false,
                              confirmButtonColor: '#666',
                              // timer: 4000,
                              // cancelButtonColor:'#d33',
                              confirmButtonText: 'Ok'
                              });
                          this.setState({
                       Religion : '',
                       ReligionId : '',
                        
                      })
                        }//the _id of new object if successful
                    }

    // 
            );
            } 
*/
      }

      
      delRole(event){
        /*event.preventDefault();
        Meteor.call('deleteReligion', event.currentTarget.id,
            (error, result)=> { 
                if(error){
                    swal( error.reason ); 
                }else{
                  swal({
                    title: '',
                    text: "Religion Deleted successfully.",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#666',
                    confirmButtonText: 'Ok'});
                    this.setState({
                        Religion : '',
                       ReligionId : ''
                      })  

                }
                
            }); */

      }

      uploadCSV(event){
            /*event.preventDefault();
            
            UserSession.delete("progressbarSession", Meteor.userId());
            
            Papa.parse( event.target.files[0], {
            header: true,
            complete( results, file ) {
              Meteor.call( 'CSVUploadLanguages', results.data, ( error, result ) => {
                      if ( error ){
                            swal(error.reason);
                  } else {
                    
                          if(result > 0){
                                swal({
                                    position : 'top-right',
                                    type     : 'success',
                                    title    : '',
                                    text     : "Countries Added Successfully!",
                                    showConfirmButton : false,
                                    timer    : 1500
                                });
                                $('#addcountrie' ).css({'display':'block'});
                  $('#bulkuploads').css({'display':'none'});  
        
                                $(".uploadFileInput").val('');
                                setTimeout(()=>{ 
                                    
                                    UserSession.delete("allProgressbarSession", Meteor.userId());
                                    UserSession.delete("progressbarSession", Meteor.userId());
                                }, 8000);
                          }else{
                                  swal({
                                    position      : 'top-right',
                                    type          : 'warning',
                                    title         : 'Nothing to upload.',
                                    showConfirmButton : true,
                                    
                                }); 
                                $('#addcountrie' ).css({'display':'block'});
                  $('#bulkuploads').css({'display':'none'});                            
                            }       
                  }
                });

               }
            });*/
        }


      editReligion(event){
        /*event.preventDefault();
        $("html,body").scrollTop(0);
        $('#addcountrie' ).css({'display':'block'});
        $('#bulkuploads').css({'display':'none'});  
        this.setState({
          options : 'manual'
        }) 
        var ReligionId = event.currentTarget.id;
        var Religiondata = Religion.findOne({"_id":ReligionId});
        if(Religion){
          this.setState({
            ReligionId     : Religiondata._id,
            Religion       : Religiondata.religion,
          })
        }*/
      }

      showBtn(){
        if(this.state.ReligionId){
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit updateBTN sbmtbt" onClick={this.updateReligion.bind(this)}>Update</button>
          )
        }else{
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btnSubmit sbmtbt" onClick={this.submitBasicInfo.bind(this)}>Submit</button>
          )
        }
      }

      countrysortup(){
       /*$("#countrysortup").css('display', 'none');
       $("#countrysortdown").css('display', 'inline-block'); 
        
       var sortedAsc =  this.props.sortedDesc.sort(function(a, b){
         return a.religion > b.religion;
       });
       this.setState({
         data : sortedAsc,
       });*/
       } 
       countrysortdown(){
       /*$("#countrysortup").css('display', 'inline-block');
       $("#countrysortdown").css('display', 'none');
          
         var sortedDesc = this.props.sortedDesc.sort(function(a, b){
         return a.religion > b.religion;
       }).reverse();
         // var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
       // console.log("sortedDesc=",sortedDesc);
       this.setState({
         data : sortedDesc,
       });*/
       }
       countrysortup(){
      /*  $("#countrysortup").css('display', 'none');
      $("#countrysortdown").css('display', 'inline-block'); 
      
      var sortedAsc =  this.state.data.sort(function(a, b){
        return a.religion > b.religion;
      });
      this.setState({
        data : sortedAsc,
      });*/
      } 
      countrysortdown(){
       /* $("#countrysortup").css('display', 'inline-block');
      $("#countrysortdown").css('display', 'none');
        
        var sortedDesc = this.state.data.sort(function(a, b){
        return a.religion > b.religion;
      }).reverse();
        
      this.setState({
        data : sortedDesc,
      });*/
      }
      

      handleInputChange(event) {
          /*const target = event.target;
          const name = target.name;

          this.setState({
            [name]: event.target.value
          });*/

      }

      render(){

        const {formerrors} = this.state;
        var locationArray = [];
      
        if(this.state.ReligionId){
          var event = this.updateReligion.bind(this)
        }else{
          var event = this.submitBasicInfo.bind(this)
        }
        
      return(
        <div className="container-fluid">
          <div className="row">
            <div className="formWrapper fontF">
              <div className="content">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pageContent">
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                  <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titleHeader">
                      <h3 id="topHeading" className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pageHeader">Add Religion</h3>
                  <div className="pull-right">
                       {/* <nav aria-label="breadcrumb">
                          <ol className="breadcrumb breadcrumbCustom">
                            <li className="breadcrumb-item"><a href="#"><i className="fa fa-home home-icon"></i>&nbsp; HRMS</a></li>
                            <li className="breadcrumb-item"><a href="#">Emp Induction Management</a></li>
                            <li className="breadcrumb-item" aria-current="page" className="active">Religion</li>
                          </ol>
                        </nav>*/}
                    </div>                  
                </div>
                <hr className="hr-head  container-fluid"/>
                </div>
               {this.state.options == 'manual' ?   
                <form id="Religionform" className="mg_btn" >
                  <div className="container-fluid shiftSettingForm col-lg-12"> 
                    <div className="row">
                      <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 container-fluid" >
                        <div className="row">
                          <div className="inptbx col-lg-4 col-md-4 col-sm-12 col-xs-12">  
                       <div className="form-group fg_ht">
                          <div className="form-group">
                              <label className="pghdr control-label statelabel  pdcls" >Religion<span className="asterix">*</span></label>
                              <div className="input-group inputBox-main nameParts"  id="Religion">
                              <div className="input-group-addon inputIcon"><i className="fa fa-graduation-cap "></i></div>
                              <input className="form-control inputBox nameParts"  value={this.state.Religion} ref="Religion" data-text="Addreligion" type="text" name="Religion" title="This field required." onChange={this.handleChange.bind(this)} required/>
                          </div>
                          <div className="errorMsg">{this.state.errors.Religion}</div>
                          </div>
                        </div>  
                      </div>


                      <div className="row">
                          <div className="rlg_btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                               {this.showBtn()}
                          </div>
                      </div>

                       {/*<div className="row">
                          <div className="col-lg-12 btn_1">
                            <div className="row">
                              <button  className="col-lg-2 col-md-2 col-sm-2 col-xs-2 btn pull-right submit btn_mrg" onClick={event} >Submit</button> 
                            </div>
                          </div>
                      </div>*/}


                     </div> 
                    </div>
                   </div> 
                  </div>
                </form>
                :
                  <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <div className="csvDLWrap">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
                        <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
                          <div className="csvIcon">
                            <a href="/csv/country.csv" download>
                              <img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
                          <h4><b>Instructions</b></h4>
                          <ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Religion Data</b> into this system.</li>
                            <li><b>2)</b>  File Format must be *.CSV.</li>
                            <li><b>3)</b>  Following is the format of .CSV file.</li>
                                      
                          </ul>
                        </div>
                        <div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Countries</b></span></div>
                        <div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
                          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
                            <input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                <div className="r_details col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                  <h3 className="pageSubHeader">Religion Details</h3>
                </div>
                <table id="listOfUsersDwnld" className="table languageTable formTable table-condesed table table-bordered table-hover table-responsive table-striped  tablebodyfix" >
                 <thead className="text-center "  >
                      <tr className="tempTableHeader " >

                       <th className="text-center col-lg-2" onClick="sortTable(0)">Sr.</th>
                       <th className="th_pd col-lg-8" onClick="sortTable(1)">Religion</th>
                      <th className="text-center col-lg-2"  onClick="sortTable(2)"> Action</th>
                    </tr>
                  </thead>
                          
                      
                  { this.props.sortedDesc ?
                    this.props.sortedDesc.length>0 ? 
                            

                      <tbody className="noLRPad text-center">
                          {this.props.sortedDesc.map( (locationdata,index)=>{
                            return(
                              <tr key={index} className="text-center" id="table-to-xls">
                              <td className="text-center">{index+1}</td>
                              <td className="td_pd nameParts">{locationdata.religion}</td>
                             
                              <td className="text-center">
                                  <div className=" dropdown">
                                         <div className="nameParts resetIcon icn col-lg-12 col-md-12 " >
                                        <div id={locationdata._id} onClick={this.editReligion.bind(this)}>
                                          <div className="col-lg-1  iconUM">
                                            <i className="fa fa-pencil color-edit" aria-hidden="true" title="Edit Profile" ></i>
                                          </div></div>
                                       <div className="">
                                          <div className=" iconUM">
                                            <i className="fa fa-trash color-trash" aria-hidden="true" title="Delete State "  data-toggle="modal" data-target={`#del-${locationdata._id}`}></i>
                                          </div>
                                       </div>
                                      
                                   </div> 

                                   <div className="modal fade " id={`del-${locationdata._id}`} role="dialog">
                                        <div className="modal-dialog modal-md msgModalWrapper">
                                        <div className="modal-content col-lg-8 col-lg-offset-2 msgModalContent">
                                              <div className="modal-header mdh msgModalHeader row">
                                              </div>
                                                  <div className="modal-body mb deleteMsg">
                                                    <p  className="paracenter"><b>Are you sure you want delete religion?</b></p>
                                                </div>
                                                <div className="modal-footer msgModalfooter">
                                                  <button type="button" data-dismiss="modal" className="btn btn-success btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right">No</button>
                                                    <button  onClick={this.delRole.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn deleteBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-left" >Yes</button>
                                                </div>
                                         </div>
                                        </div>
                                   </div>
                                  </div>
                                </td>
                              </tr>
                               )
                            })}
                            
                        </tbody>
                        :
                          <td colSpan="9" className="ntdiaplay displayblck"></td>
                          
                      :
                      <tbody>
                        <td colSpan="9" >
                          {/*<td colSpan="9" className="ntdiaplay">Nothing to display.</td>*/}
                          <div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/SRESloader.gif" className="loaderimgcent" alt="loading"/></div>

                        </td>
                      </tbody>
                      
                      }

                    </table>
                  
                        { 
                          this.state.data && this.state.data.length>0 ? 
                              <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
                                <ul className="pagination paginationOES">
                                    {this.state.paginationArray}
                                </ul>
                              </div>
                            :
                              null
                        }
                  </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    
      );
  } 
}

    export default Addreligion;