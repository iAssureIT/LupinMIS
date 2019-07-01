    import React, { Component } from 'react';
    import SimpleReactValidator from 'simple-react-validator';
    import swal from 'sweetalert';
    import axios from "axios";
    import $ from "jquery";
    import moment from 'moment';
    import './Languages.css';

    class Languages extends Component {

      constructor(props){
        super(props);
        this.state = {
          'roleSett'             : '',
          'firstname'            :'',
          'startRange'           : 0,
          'limitRange'           :10,
          'counter'              : 1,
          'dataRange'            :10,
          'adminShowAll'         :'Admin',
          'negativeCounter'      : 2,
          'usersListData'        : false,
          'paginationArray'      : [],
          'department'           : 'all',
          'blockActive'          : 'all',
          'roleListDropdown'     :'all',
          'resetPasswordConfirm' : '',
          'resetPassword'        : '',

          Languages              : '',
          Nationality            : '',
          LanguagesId            : '',
          toggleUploadBtn        : 'Bulk Upload',
          options                : 'manual',
          data                   : '',
          "action"               :'Submit',
          

           fields: {},
           errors: {}
        }         
      }

  handleChange(event)
     {
      event.preventDefault();
      this.setState({
          "Languages"  : this.refs.Languages.value,          
       
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
          var lValues= {
            "Languages" : this.refs.Languages.value,          
            
          }
      axios
          .post('http://jsonplaceholder.typicode.com/posts', { lValues })
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
        fields["Languages"] = "";
       
        this.setState({
                    "Languages"                           : "",          
                     fields:fields
        });
        alert("Data inserted Successfully!")
          }
              
      }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["Languages"]) {
        formIsValid = false;
        errors["Languages"] = "This field is required.";
      }
      if (typeof fields["Languages"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^[A-Za-z]+[0-9]*$/);
        if (!pattern.test(fields["Languages"])) {
          formIsValid = false;
          errors["Languages"] = "Please enter Languages.";
        }
      }
                 
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

      LanguagesListData(){
        // return Languages.find({}).fetch();
      }
      

    componentDidMount(){
         // window.scrollTo(0, 0)
         //  axios
         //  .get('http://jsonplaceholder.typicode.com/posts')
         //  .then(
         //    (res)=>{
         //      console.log(res);
         //      const postsdata = res.data;
         //      this.setState({
         //        languages : postsdata,
         //      });
         //    }
         //  )
         //  .catch();
    }
    // $("html,body").scrollTop(0); 
           
    //   jQuery.validator.setDefaults({
    //     debug: true,
    //     success: "valid"
    //   });
    //   $("#Languagesform").validate({
    //     rules: {
    //       Languages: {
    //         required: true,
    //           // regx1:/^$|\s+/,
    //       },
    //     },
    //      errorPlacement: function(error, element) {
    //       if (element.attr("name") == "Languages"){
    //              error.insertAfter("#Languages");
    //         } 
    //     }
        
    //   });
    
        

    //      //Spinner Effect
    //       $(document).ready(function() {
    //       $('.btn').on('click', function() {
    //         var $this = $(this);
    //         // var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
    //         if ($(this).html() !== loadingText) {
    //           $this.data('original-text', $(this).html());
    //           $this.html(loadingText);
    //         }
    //         setTimeout(function() {
    //           $this.html($this.data('original-text'));
    //         }, 2000);
    //       });
    //     })
        
    //       window.onscroll = function() {myFunction()};


    //        var header = document.getElementById("myHeader0");
    //        console.log("hdr-->",header);
    //        if(header)
    //        {

    //        var sticky = header.offsetTop;
    //         }
    //        function myFunction() {
    //          console.log('window.pageYOffset',window.pageYOffset);
    //          console.log('sticky',sticky);
    //          if (window.pageYOffset > sticky) {
    //            header.classList.add("sticky");
    //          } else {
    //            header.classList.remove("sticky");
    //          }
    //        }

    //     $(function() {
    //         $(window).on("scroll", function() {
    //             if($(window).scrollTop() > 320) {
    //                 $(".header1").addClass("activ");
    //                 $(".srpaddOne").addClass("newClassActive");
    //                 $(".srpaddTwo").addClass("newClassActivecountryaction");
    //                 $(".CountryOne").addClass("NewCountryCss");


    //             } else {
    //                 //remove the background property so it comes transparent again (defined in your css)
    //                $(".header1").removeClass("activ");
    //                $(".srpaddOne").removeClass("newClassActive");
    //                 $(".srpaddTwo").removeClass("newClassActiveTwostate");
    //                 $(".CountryOne").removeClass("NewCountryCss");
    //             }
    //         });

    //     });

    //     function sortTable(n) {
    //           var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    //           table = document.getElementById("myTable");
    //           switching = true;
    //           //Set the sorting direction to ascending:
    //           dir = "asc"; 
    //           /*Make a loop that will continue until
    //           no switching has been done:*/
    //           while (switching) {
    //             //start by saying: no switching is done:
    //             switching = false;
    //             rows = table.rows;
    //             /*Loop through all table rows (except the
    //             first, which contains table headers):*/
    //             for (i = 1; i < (rows.length - 1); i++) {
    //               //start by saying there should be no switching:
    //               shouldSwitch = false;
    //               /*Get the two elements you want to compare,
    //               one from current row and one from the next:*/
    //               x = rows[i].getElementsByTagName("TD")[n];
    //               y = rows[i + 1].getElementsByTagName("TD")[n];
    //               /*check if the two rows should switch place,
    //               based on the direction, asc or desc:*/
    //               if (dir == "asc") {
    //                 if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
    //                   //if so, mark as a switch and break the loop:
    //                   shouldSwitch= true;
    //                   break;
    //                 }
    //               } else if (dir == "desc") {
    //                 if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
    //                   //if so, mark as a switch and break the loop:
    //                   shouldSwitch = true;
    //                   break;
    //                 }
    //               }
    //             }
    //             if (shouldSwitch) {
    //               /*If a switch has been marked, make the switch
    //               and mark that a switch has been done:*/
    //               rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
    //               switching = true;
    //               //Each time a switch is done, increase this count by 1:
    //               switchcount ++;      
    //             } else {
    //               /*If no switching has been done AND the direction is "asc",
    //               set the direction to "desc" and run the while loop again.*/
    //               if (switchcount == 0 && dir == "asc") {
    //                 dir = "desc";
    //                 switching = true;
    //               }
    //             }
    //           }
    //         }
          
        

      componentWillReceiveProps(nextProps){
        // var Languages = nextProps.sortedDesc;

        // this.setState({
        //   Languages : nextProps.languages,
         
        
        //   data      : nextProps.sortedDesc,
        // });


        //   window.onscroll = function() {myFunction()};

        //    var header = document.getElementById("myHeader0");
        //    // var sticky = header.offsetTop;

        //    function myFunction() {
        //      if (window.pageYOffset > sticky) {
        //        header.classList.add("sticky");
        //      } else {
        //        header.classList.remove("sticky");
        //      }
        //    }

        // $(function() {
        //     $(window).on("scroll", function() {
        //         if($(window).scrollTop() > 250) {
        //             $(".header1").addClass("activ");
        //         } else {
        //             //remove the background property so it comes transparent again (defined in your css)
        //            $(".header1").removeClass("activ");
        //         }
        //     });
        // });

      }

      toggleBulkBtn(event) {
        // event.preventDefault();
        // if (this.state.toggleUploadBtn == 'Bulk Upload') {
      
        //   var toggleVal = 'Country Bulk Upload';
        //   $("#bulkuploads").css('display', 'block');
        //   $("#addcountryform").css('display', 'none');
        // } else {
        
        //   var toggleVal = 'Bulk Upload';
        //   $("#addcountryform").css('display', 'block');
        //   $("#bulkuploads").css('display', 'none');

        // }
        // this.setState({
        //   'toggleUploadBtn': toggleVal,
        // });

      }

      

      componentDidUpdate(){
        // $('.pagination'+this.state.counter).addClass("active");
        // Session.set('pageUMNumber',this.state.counter);
        // // if(Session.get("usermanagementcount"))
      }


      updateLanguages(event){
    //     event.preventDefault();
    //       var LanguagesId    = this.state.LanguagesId;
    //       var languages  = {
    //         "Languages": this.state.Languages,
    //       }
    //       if($('#Languagesform').valid()){ 
    //       Meteor.call('updateLanguages', LanguagesId, languages,
    //                 (error, result)=> { 
    //                     if (error) {
    //                         console.log ( error ); 
    //                     } //info about what went wrong 
    //                     else {
    //                       swal({
    //                           title: 'abc',
    //                           text: "Languages Modified Successfully!",
    //                           type: 'success',
    //                           showCancelButton: false,
    //                           confirmButtonColor: '#666',
    //                           // timer: 4000,
    //                           // cancelButtonColor:'#d33',
    //                           confirmButtonText: 'Ok'});
    //                       this.setState({
    //                    Languages : '',
    //                     LanguagesId : '',
                        
    //                   })
    //                     }//the _id of new object if successful
    //                 }

    // // 
    //         );
    //         } 

      }

      
      delRole(event){
        // event.preventDefault();
        // Meteor.call('deleteLanguages', event.currentTarget.id,
        //     (error, result)=> { 
        //         if(error){
        //             swal( error.reason ); 
        //         }else{
        //           swal({
                    
        //             text: "Languages Deleted successfully.",
        //             type: 'success',
        //             showCancelButton: false,
        //             confirmButtonColor: '#666',
        //             confirmButtonText: 'Ok'});
        //             this.setState({
        //                 Languages : '',
        //                LanguagesId : ''
        //               })  

        //         }
                
        //     }); 

      }



      uploadCSV(event){
            // event.preventDefault();
            
            // UserSession.delete("progressbarSession", Meteor.userId());
            
            // Papa.parse( event.target.files[0], {
            // header: true,
            // complete( results, file ) {
            //   Meteor.call( 'CSVUploadLanguages', results.data, ( error, result ) => {
            //           if ( error ){
            //                 swal(error.reason);
            //       } else {
                    
            //               if(result > 0){
            //                     swal({
            //                         position : 'top-right',
            //                         type     : 'success',
            //                         title    : '',
            //                         text     : "Countries Added Successfully!",
            //                         showConfirmButton : false,
            //                         timer    : 1500
            //                     });
            //                     $('#addcountrie' ).css({'display':'block'});
            //       $('#bulkuploads').css({'display':'none'});  
        
            //                     $(".uploadFileInput").val('');
            //                     setTimeout(()=>{ 
                                    
            //                         UserSession.delete("allProgressbarSession", Meteor.userId());
            //                         UserSession.delete("progressbarSession", Meteor.userId());
            //                     }, 8000);
            //               }else{
            //                       swal({
            //                         position      : 'top-right',
            //                         type          : 'warning',
            //                         title         : 'Nothing to upload.',
            //                         showConfirmButton : true,
                                    
            //                     }); 
            //                     $('#addcountrie' ).css({'display':'block'});
            //       $('#bulkuploads').css({'display':'none'});                            
            //                 }       
            //       }
            //     });

            //    }
            // });
        }


      editLanguages(event){
        // event.preventDefault();
        // $("html,body").scrollTop(0);
        // $('#addcountrie' ).css({'display':'block'});
        // $('#bulkuploads').css({'display':'none'});  
        // this.setState({
        //   options : 'manual'
        // }) 
        // var LanguagesId = event.currentTarget.id;
        // var Languagesdata = Languages.findOne({"_id":LanguagesId});
        // if(Languages){
        //   this.setState({
        //     LanguagesId     : Languagesdata._id,
        //     Languages       : Languagesdata.languages,
        //   })
        // }
      }

      showBtn(){
        if(this.state.LanguagesId){
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit  updateBTN" onClick={this.updateLanguages.bind(this)}>Update</button>
          )
        }else{
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit  btnSubmit" onClick={this.submitBasicInfo.bind(this)}>Submit</button>
          )
        }
      }

      countrysortup(){
       // $("#countrysortup").css('display', 'none');
       // $("#countrysortdown").css('display', 'inline-block'); 
        
       // var sortedAsc =  this.props.sortedDesc.sort(function(a, b){
       //   return a.languages > b.languages;
       // });
       // this.setState({
       //   data : sortedAsc,
       // });
       } 
       countrysortdown(){
       // $("#countrysortup").css('display', 'inline-block');
       // $("#countrysortdown").css('display', 'none');
          
       //   var sortedDesc = this.props.sortedDesc.sort(function(a, b){
       //   return a.languages > b.languages;
       // }).reverse();
       //   // var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
       // // console.log("sortedDesc=",sortedDesc);
       // this.setState({
       //   data : sortedDesc,
       // });
       }
       countrysortup(){
      //   $("#countrysortup").css('display', 'none');
      // $("#countrysortdown").css('display', 'inline-block'); 
      
      // var sortedAsc =  this.state.data.sort(function(a, b){
      //   return a.languages > b.languages;
      // });
      // this.setState({
      //   data : sortedAsc,
      // });
      } 
      countrysortdown(){
      //   $("#countrysortup").css('display', 'inline-block');
      // $("#countrysortdown").css('display', 'none');
        
      //   var sortedDesc = this.state.data.sort(function(a, b){
      //   return a.languages > b.languages;
      // }).reverse();
        
      // this.setState({
      //   data : sortedDesc,
      // });
      }
      

      handleInputChange(event) {
          // const target = event.target;
          // const name = target.name;

          // this.setState({
          //   [name]: event.target.value
          // });

      }

      render(){
        const {formerrors} = this.state;
        var locationArray = [];
      
        if(this.state.LanguagesId){
          var event = this.updateLanguages.bind(this)
        }else{
          var event = this.submitBasicInfo.bind(this)
        }
        
      return(
        <div className="container-fluid">
        <div className="row">
          <div className=" formWrapper  fontF">
            <div className="content">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pageContent">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                    <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titleHeader">
                      <h3 id="topHeading" className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pageHeader">Add Languages</h3>
                      <div className="pull-right">
                        {/*<nav aria-label="breadcrumb">
                          <ol className="breadcrumb breadcrumbCustom">
                            <li className="breadcrumb-item"><a href="#"><i className="fa fa-home home-icon"></i>&nbsp; HRMS</a></li>
                            <li className="breadcrumb-item"><a href="#">Emp Induction Management</a></li>
                            <li className="breadcrumb-item" aria-current="page" className="active">Languages</li>
                          </ol>
                        </nav>*/}
                      </div>
                    </div>
                    <hr className="hr-head  container-fluid"/>

                  </div>
                  
                  {/*<div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>*/}
                  {this.state.options == 'manual' ?   
                  <form id="Languages1" className="mg_btn">  
                      <div className="inptbx col-lg-4 col-md-4 col-sm-12 col-xs-12  formht" >
                        <div className="form-group" >
                          <div className="form-group" >
                              <label className="pghdr control-label statelabel pdcls" >Languages<span className="asterix">*</span></label>
                              <div className=" input-group inputBox-main nameParts  "  id="Languages">
                              <div className="input-group-addon inputIcon"><i className="fa fa-graduation-cap "></i></div>
                              <input className="form-control inputBox nameParts" type="text"  placeholder="Enter Here" value={this.state.Languages} ref="Languages" name="Languages" title="This field required." onChange={this.handleChange.bind(this)} required/>
                          </div>
                          <div className="errorMsg">{this.state.errors.Languages}</div>
                          </div>
                        </div>  

                    </div>

                   <div className="row">
                          
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                               {this.showBtn()}
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
                              <li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Languages Data</b> into this system.</li>
                              <li><b>2)</b>  File Format must be *.CSV.</li>
                              <li><b>3)</b>  Following is the format of .CSV file.</li>
                                        
                            </ul>
                          </div>
                          <div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Countries</b></span></div>
                          <div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
                            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
                              <input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV" data-text="Languages"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
                              {this.state.formerrors.Languages &&(
                              <span className="text-danger">{formerrors.Languages}</span> 
                            )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                    <h3 className="pageSubHeader">Language Details</h3>
                  </div>
                  <table id="listOfUsersDwnld" className=" table languageTable formTable table-condesed table table-bordered table-hover table-responsive table-striped  tablebodyfix" >
                    <thead className="text-center "  >
                      <tr className="tempTableHeader " >
                        <th className=" text-center col-lg-2" onClick="sortTable(0)">Sr.
                        </th>
                        <th className=" text-center col-lg-8" onClick="sortTable(1)">Languages
                        </th>
                        <th className=" text-center col-lg-2" onClick="sortTable(2)"> Action</th>
                      </tr>
                    </thead>
                    { this.props.sortedDesc ?
                      this.props.sortedDesc.length>0 ? 
                        <tbody className="noLRPad text-center">
                            {this.props.sortedDesc.map( (locationdata,index)=>{
                              return(
                                <tr key={index} className="text-center" id="table-to-xls">
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center nameParts">{locationdata.languages}</td>
                                 
                                  <td className="text-center">
                                    <div className=" dropdown">
                                             <div className=" resetIcon icn col-lg-12 col-md-12 nameParts" >
                                        <div id={locationdata._id} onClick={this.editLanguages.bind(this)}>
                                          <div className="col-lg-1  iconUM">
                                            <i className="fa fa-pencil color-edit" aria-hidden="true" title="Edit Profile" ></i>
                                          </div> </div>
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
                                                    <p  className="paracenter"><b>Are you sure you want to delete language?</b></p>
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


    export default  Languages;
   