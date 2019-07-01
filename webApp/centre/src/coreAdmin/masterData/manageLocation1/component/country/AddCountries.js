    import React, { Component } from 'react';
    /*import { render } from 'react-dom';
    import TrackerReact from 'meteor/ultimatejs:tracker-react';
    import {withTracker}    from 'meteor/react-meteor-data';
    import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
    import ReactTable               from "react-table";

    */
    import $ from "jquery";
    import swal from 'sweetalert';
    import axios from 'axios';


    /*import {Countries}      from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/Countries.js';
    import AddBulkupload    from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/AddBulkupload.jsx';
    import AddCountrydatalist   from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/AddCountrydatalist.jsx';
    */
    import Form from 'react-validation/build/form';
    
    import './AddCountries.css';


    class AddCountries extends Component{

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
          'country'       : '',
          'Nationality'     : '',
          'countryId'       : '',
          'toggleUploadBtn' : 'Bulk Upload',
          'options'       : 'manual',
          'data'      : '',

        }
        this.handleChange = this.handleChange.bind(this);
      
      }
      countryListData(){
        // return Countries.find({}).fetch();
      }
       handleChange(event){
          event.preventDefault();
             const target = event.target;
           const name   = target.name;
           this.setState({
            [name]: event.target.value,
           });
      
        }

        componentDidMount(){
          axios
          .get('http://jsonplaceholder.typicode.com/posts')
          .then(
               (res)=>{
          console.log(res);
          const postsdata = res.data;
          this.setState({
            allBankDetails : postsdata,
             });
           }
          )
          .catch();
         /* $("html,body").scrollTop(0);
          $.validator.addMethod("regx1", function(value, element, regexpr) {          
            return regexpr.test(value);
          }, "It should only contain letters.");
           $.validator.addMethod("regx2", function(value, element, regexpr) {          
            return regexpr.test(value);
          }, "It should only contain letters.");
          
           jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
          });
          $("#addcountryform").validate({
            rules: {
              country: {
                required: true,
                  regx1: /^[A-za-z']+( [A-Za-z']+)*$/,
              },
               Nationality: {
                required: true,
                regx2: /^[A-za-z']+( [A-Za-z']+)*$/,
              },

             
            },
          });
*/
        //   //Spinner Effect
        //   $(document).ready(function() {
        //   $('.btn').on('click', function() {
        //     var $this = $(this);
        //     var loadingText = '<i className="fa fa-spinner fa-spin"></i> loading...';
        //     if ($(this).html() !== loadingText) {
        //       $this.data('original-text', $(this).html());
        //       $this.html(loadingText);
        //     }
        //     setTimeout(function() {
        //       $this.html($this.data('original-text'));
        //     }, 2000);
        //   });
        // })
        
         // window.onscroll = function() {myFunction()};


           /*var header = document.getElementById("myHeader0");
           console.log("hdr-->",header);
           if(header)
           {

           var sticky = header.offsetTop;
            }
           function myFunction() {
             console.log('window.pageYOffset',window.pageYOffset);
             console.log('sticky',sticky);
             if (window.pageYOffset > sticky) {
               header.classList.add("sticky");
             } else {
               header.classList.remove("sticky");
             }
           }
*/
/*        $(function() {
            $(window).on("scroll", function() {
                if($(window).scrollTop() > 320) {
                    $(".header1").addClass("activ");
                    $(".srpaddOne").addClass("newClassActive");
                    $(".srpaddTwo").addClass("newClassActivecountryaction");
                    $(".CountryOne").addClass("NewCountryCss");


                } else {
                    //remove the background property so it comes transparent again (defined in your css)
                   $(".header1").removeClass("activ");
                   $(".srpaddOne").removeClass("newClassActive");
                    $(".srpaddTwo").removeClass("newClassActiveTwostate");
                    $(".CountryOne").removeClass("NewCountryCss");
                }
            });

        });

*/      }

    componentWillReceiveProps(nextProps){
/*        var country = nextProps.sortedDesc;

        this.setState({
          country     : nextProps.countryName,
          Nationality : nextProps.Nationality,
        
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
        });
*/
      }

      toggleBulkBtn(event) {
        event.preventDefault();
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
        });

      }

      addcountry(event){
        event.preventDefault(); 
            var CountriesValues = {
            "country"     : this.state.country, 
            "Nationality"   : this.state.Nationality,
          
          }  
          axios
          .post('http://jsonplaceholder.typicode.com/posts', { CountriesValues })
          .then( (res)=>{
            console.log(res);
            if(res.status == 201){
              alert("Data inserted Successfully!")
              
            }
          })
          .catch(); 
          this.setState({
            country:"",
            Nationality:"",
          })
                    /*if($('#addcountryform').valid()){ 
          Meteor.call('insertCountries',CountriesValues,
                      (error, result)=> { 
                          if (error) {
                            
                              swal(error.reason);
                          } 
                          else {
                            if(result == 'exist'){
                             swal({
                                title: 'abc',
                              text: "Country Already Added!",
                              type: 'success',
                              showCancelButton: false,
                              confirmButtonColor: '#666',
                              // timer: 4000,
                              // cancelButtonColor:'#d33',
                              confirmButtonText: 'Ok'
                             });
                          }else{
                           swal({
                             title: 'abc',
                              text: "Country Added Successfully!",
                              type: 'success',
                              showCancelButton: false,
                              confirmButtonColor: '#666',
                              // timer: 4000,
                              // cancelButtonColor:'#d33',
                              confirmButtonText: 'Ok'
                          });
                          }


                      this.setState({
                        country : '',
                        countryId : '',
                        Nationality:'',
                        button:false,
                        timer:2000
                      })  
                          }
                  }
              );
        }*/

      }



      componentDidUpdate(){
        $('.pagination'+this.state.counter).addClass("active");
        // Session.set('pageUMNumber',this.state.counter);
        // if(Session.get("usermanagementcount"))
      }


      updateCountry(event){
        event.preventDefault();
          var countryId    = this.state.countryId;
          var countryName  = {
            "country": this.state.country,
            "Nationality"   : this.state.Nationality,
          }
          
        
          /*if($('#addcountryform').valid()){ 
          Meteor.call('updateCountries', countryId, countryName,
                    (error, result)=> { 
                        if (error) {
                            console.log ( error ); 
                        } //info about what went wrong 
                        else {
                          swal({
                              title: 'abc',
                              text: "Country Modified Successfully!",
                              type: 'success',
                              showCancelButton: false,
                              confirmButtonColor: '#666',
                              // timer: 4000,
                              // cancelButtonColor:'#d33',
                              confirmButtonText: 'Ok'
                        });
                          this.setState({
                        country : '',
                        countryId : '',
                        Nationality:'',
                      })
                        }//the _id of new object if successful
                    //}

  
            );
            } */

      }

      
      delRole(event){
        event.preventDefault();
        /*Meteor.call('deleteCountries', event.currentTarget.id,
            (error, result)=> { 
                if(error){
                    swal( error.reason ); 
                }else{
                 
                   
                    this.setState({
                        country : '',
                        countryId : '',
                         Nationality     : '',
                      })  

                }
                
            }); 
*/
      }

      uploadCSV(event){
            event.preventDefault();
           /* 
            UserSession.delete("progressbarSession", Meteor.userId());
            
            Papa.parse( event.target.files[0], {
            header: true,
            complete( results, file ) {
              Meteor.call( 'CSVUploadCountries', results.data, ( error, result ) => {
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


      editCountry(event){
        event.preventDefault();
        $("html,body").scrollTop(0);
        $('#addcountrie' ).css({'display':'block'});
        $('#bulkuploads').css({'display':'none'});  
        this.setState({
          options : 'manual'
        }) 
        var countryId = event.currentTarget.id;
        /* var countrydata = Countries.findOne({"_id":countryId});
        if(countrydata){
          this.setState({
            country     : countrydata.countryName,
            countryId     : countrydata._id,
            Nationality      :countrydata.nationality,
          })
        }*/
      }

      showBtn(){
        if(this.state.countryId){
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit  bt-mr count_btn updateBTN" onClick={this.updateCountry.bind(this)}>Update</button>
          )
        }else{
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit  bt-mr count_btn btnSubmit" onClick={this.addcountry.bind(this)}>Submit</button>
          )
        }
      }

      countrysortup(){
       $("#countrysortup").css('display', 'none');
       $("#countrysortdown").css('display', 'inline-block'); 
        
       var sortedAsc =  this.props.sortedDesc.sort(function(a, b){
         return a.countryName > b.countryName;
       });
       this.setState({
         data : sortedAsc,
       });
       } 
       countrysortdown(){
       $("#countrysortup").css('display', 'inline-block');
       $("#countrysortdown").css('display', 'none');
          
         var sortedDesc = this.props.sortedDesc.sort(function(a, b){
         return a.countryName > b.countryName;
       }).reverse();
         // var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
       // console.log("sortedDesc=",sortedDesc);
       this.setState({
         data : sortedDesc,
       });
       }
       countrysortup(){
        $("#countrysortup").css('display', 'none');
      $("#countrysortdown").css('display', 'inline-block'); 
      
      var sortedAsc =  this.state.data.sort(function(a, b){
        return a.countryName > b.countryName;
      });
      this.setState({
        data : sortedAsc,
      });
      } 
      countrysortdown(){
        $("#countrysortup").css('display', 'inline-block');
      $("#countrysortdown").css('display', 'none');
        
        var sortedDesc = this.state.data.sort(function(a, b){
        return a.countryName > b.countryName;
      }).reverse();
        
      this.setState({
        data : sortedDesc,
      });
      }
      

      handleInputChange(event) {
          const target = event.target;
          const name = target.name;

          this.setState({
            [name]: event.target.value
          });

      }

      render(){
        
        var locationArray = [];
      
        if(this.state.countryId){
          var event = this.updateCountry.bind(this)
        }else{
          var event = this.addcountry.bind(this)
        }
        
           return(
          <div className="">
              <div className=""  id="addcountrie">
                <div className="wrapperTitle col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                    <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Country</span>
                  </div>
                  
                  <div className="switchField col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="manualAuto pull-right">
                          <input className="manual_But1" type="radio" id="switch_left" name="options" value="manual" checked={this.state.options === 'manual'} onChange={this.handleInputChange.bind(this)} />
                          <label className="manual_But" htmlFor="switch_left">  Manual </label>
                          <input className="abt" type="radio" id="switch_right" name="options" value="auto" checked={this.state.options === 'auto'} onChange={this.handleInputChange.bind(this)} />
                          <label className="auto_But1" htmlFor="switch_right" >Auto</label>
                      </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div className="marginBottom"></div></div>
                {this.state.options == 'manual' ?   
                <Form id="addcountryform">  
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box countryField" >
                    <div className="form-group">
                      <div className="form-group">
                          <label className="formLabel control-label" >Country<span className="asterix">*</span></label>
                          <input className="form-control inputBox-main areaStaes nameParts" id="country" value={this.state.country}  type="text" name="country" title="This field is required" onChange={this.handleChange.bind(this)} required/>
                      </div>
                    </div>  
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box countryField " >
                    <div className="form-group">
                      <div className="form-group">
                          <label className="formLabel control-label" >Nationality<span className="asterix">*</span></label>
                          <input className="form-control inputBox-main areaStaes nameParts" id="Nationality" value={this.state.Nationality}  ref="Nationality" type="text" name="Nationality" title="This field is required" onChange={this.handleChange.bind(this)} required/>
                      </div>
                    </div>  
                  </div> 


                   <div className="count_btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                     {this.showBtn()}  
                    </div>

                  
                </Form>
                :
                  <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <div className="csvDLWrap">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
                        <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
                          <div className="">
                            <a >
                              <img src="/images/csv_upload.png"  className="csvimg" title="Click to download file"/>
                            </a>
                          </div>
                        </div>
                        <div className="csvUpld col-lg-11 col-md-12 col-sm-12 col-xs-12">
                          <h4><b>Instructions</b></h4>
                          <ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Country Data</b> into this system.</li>
                            <li><b>2)</b>  File Format must be *.CSV.</li>
                            <li><b>3)</b>  Following is the format of .CSV file.</li>
                                      
                          </ul>
                        </div>
                        <div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Countries</b></span></div>
                        <div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
                          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
                            <input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput nameParts" required/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead ">
                <table id="listOfUsersDwnld" className="display table table-bordered table  servicesTable " >
                  <thead className="table-head tablebodyfix "  >
                    <tr className="tempTableHeader " >
                      <th className=" col-lg-5 umHeader tbl_color " >Country

                        
                      </th>
                      <th className="col-lg-5 umHeader tbl_color">Nationality
                      </th> 
                      <th className="col-lg-2 umHeader tbl_color"> Action</th>
                    </tr>
                  </thead>
                          
                      
                  {/*{ this.props.sortedDesc ?
                    this.props.sortedDesc.length>0 ? 
                            

                      <tbody className="noLRPad ">
                          {this.props.sortedDesc.map( (locationdata,index)=>{
                            return(
                              <tr key={index} className="tablebodyfix">
                              <td className="col-lg-5 txtcentr">{locationdata.countryName}</td>
                              <td className="col-lg-5 txtcentr">{locationdata.nationality}</td>
                            
                              <td className="col-lg-2 txtcentr">
                                <div className=" resetIcon icn col-lg-12 col-md-12 " >
                                                                      <div id={locationdata._id} onClick={this.editCountry.bind(this)}>
                                                                        <div className="col-lg-1  iconUM">
                                                                          <i className="fa fa-pencil color-edit" aria-hidden="true" title="Edit Profile" ></i>
                                                                        </div>
                                                                     <div className="">
                                                                        <div className=" iconUM">
                                                                          <i className="fa fa-trash color-trash" aria-hidden="true" title="Delete State "  data-toggle="modal" data-target={`#del-${locationdata._id}`}></i>
                                                                        </div>
                                                                     </div>
                                                                    </div>
                                                                 </div>     
                                      <div className="modal fade " id={`del-${locationdata._id}`} role="dialog">

                                        <div className="modal-dialog modal-md msgModalWrapper">
                                            <div className="modal-content col-lg-8 col-lg-offset-2 msgModalContent">
                                              <div className="modal-header mdh msgModalHeader row">
                                               </div>
                                                  <div className="modal-body mb deleteMsg">
                                                    <p className="paracenter"><b>The Country will be deleted. <br></br> Are you sure you want to continue?</b></p>
                                                </div>
                                                
                                                <div className="modal-footer msgModalfooter">
                                                  <button type="button" data-dismiss="modal" className="btn btn-success btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right">No</button>
                                                    <button  onClick={this.delRole.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn deleteBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-left" >Yes</button>

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
                          <td colSpan="9" className="ntdiaplay displayblck">Nothing to display.</td>
                          
                      :
                      <tbody>
                        <td colSpan="9" >
                          <div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/SRESloader.gif" className="loaderimgcent" alt="loading"/></div>

                        </td>
                      </tbody>
                      
                      }
                    */}
                    </table>
                  
                        {/*{ 
                          this.state.data && this.state.data.length>0 ? 
                              <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
                                <ul className="pagination paginationOES">
                                    {this.state.paginationArray}
                                </ul>
                              </div>
                            :
                              null
                        }*/}
                  </div>
        </div>
      );
  } 
}

export default AddCountries
