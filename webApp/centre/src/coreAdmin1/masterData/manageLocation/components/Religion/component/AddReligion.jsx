    import React, { Component } from 'react';
    import { render } from 'react-dom';
    import TrackerReact from 'meteor/ultimatejs:tracker-react';
    import {withTracker}    from 'meteor/react-meteor-data';
    import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
    import ReactTable               from "react-table";

    import swal from 'sweetalert';

    import {Religion}   from '/imports/coreAdmin/masterData/manageLocation/components/Religion/component/Religion.js';
    import AddBulkupload    from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/AddBulkupload.jsx';
    import addReligiondatalist   from '/imports/coreAdmin/masterData/manageLocation/components/Religion/component/addReligiondatalist.jsx';
    import Form from 'react-validation/build/form';


    class AddReligion extends TrackerReact(Component) {

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

        }
        this.handleChange = this.handleChange.bind(this);
      
      }
      ReligionListData(){
        return Religion.find({}).fetch();
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
          $.validator.addMethod("regx1", function(value, element, regexpr) {          
            return regexpr.test(value);
          }, "It should only contain letters.");
           jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
          });
          $("#Religionform").validate({
            rules: {
              Religion: {
                required: true,
                  regx1: /^[A-za-z']+( [A-Za-z']+)*$/,
              },
            },
            
          });

         //Spinner Effect
          $(document).ready(function() {
          $('.btn').on('click', function() {
            var $this = $(this);
            var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
            if ($(this).html() !== loadingText) {
              $this.data('original-text', $(this).html());
              $this.html(loadingText);
            }
            setTimeout(function() {
              $this.html($this.data('original-text'));
            }, 2000);
          });
        })
        
          window.onscroll = function() {myFunction()};


           var header = document.getElementById("myHeader0");
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

        $(function() {
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

        function sortTable(n) {
              var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
              table = document.getElementById("myTable");
              switching = true;
              //Set the sorting direction to ascending:
              dir = "asc"; 
              /*Make a loop that will continue until
              no switching has been done:*/
              while (switching) {
                //start by saying: no switching is done:
                switching = false;
                rows = table.rows;
                /*Loop through all table rows (except the
                first, which contains table headers):*/
                for (i = 1; i < (rows.length - 1); i++) {
                  //start by saying there should be no switching:
                  shouldSwitch = false;
                  /*Get the two elements you want to compare,
                  one from current row and one from the next:*/
                  x = rows[i].getElementsByTagName("TD")[n];
                  y = rows[i + 1].getElementsByTagName("TD")[n];
                  /*check if the two rows should switch place,
                  based on the direction, asc or desc:*/
                  if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                      //if so, mark as a switch and break the loop:
                      shouldSwitch= true;
                      break;
                    }
                  } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                      //if so, mark as a switch and break the loop:
                      shouldSwitch = true;
                      break;
                    }
                  }
                }
                if (shouldSwitch) {
                  /*If a switch has been marked, make the switch
                  and mark that a switch has been done:*/
                  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                  switching = true;
                  //Each time a switch is done, increase this count by 1:
                  switchcount ++;      
                } else {
                  /*If no switching has been done AND the direction is "asc",
                  set the direction to "desc" and run the while loop again.*/
                  if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                  }
                }
              }
            }
        }

          componentWillReceiveProps(nextProps){
        var Religion = nextProps.sortedDesc;

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
        });

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

      addReligion(event){
        event.preventDefault(); 
            var religionValues = {
            "Religion" : this.state.Religion,
          }   
           console.log('religionValues',religionValues);
          if($('#Religionform').valid()){ 
          Meteor.call('insertReligion',religionValues,
                      (error, result)=> { 
                          if (error) {
                            
                              swal(error.reason);
                          } 
                          else {
                            if(result == 'exist'){
                               swal({
                                title:'abc',
                                text:"Religion Already Added!"
                               });
                            }else{
                             swal({
                              title: 'abc',
                              text: "Religion Added Successfully!",
                              type: 'success',
                              showCancelButton: false,
                              confirmButtonColor: '#666',
                              // cancelButtonColor:'#d33',
                              confirmButtonText: 'Ok'});
                            }


                      this.setState({
                        
                        ReligionId : '',
                        Religion:'',
                      })  
                          }
                      }
              );
        }

      }



      componentDidUpdate(){
        $('.pagination'+this.state.counter).addClass("active");
        Session.set('pageUMNumber',this.state.counter);
        // if(Session.get("usermanagementcount"))
      }


      updateReligion(event){
        event.preventDefault();
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
                              // cancelButtonColor:'#d33',
                              confirmButtonText: 'Ok'});
                          this.setState({
                       Religion : '',
                       ReligionId : '',
                        
                      })
                        }//the _id of new object if successful
                    }

    // 
            );
            } 

      }

      
      delRole(event){
        event.preventDefault();
        Meteor.call('deleteReligion', event.currentTarget.id,
            (error, result)=> { 
                if(error){
                    swal( error.reason ); 
                }else{
                  swal({
                    title: 'abc',
                    text: "Religion Deleted successfully!",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#666',
                    confirmButtonText: 'Ok'});
                    this.setState({
                        Religion : '',
                       ReligionId : ''
                      })  

                }
                
            }); 

      }

      uploadCSV(event){
            event.preventDefault();
            
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
                                    title    : 'abc',
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
            });
        }


      editReligion(event){
        event.preventDefault();
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
        }
      }

      showBtn(){
        if(this.state.ReligionId){
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit submit-button updateBTN" onClick={this.updateReligion.bind(this)}>Update</button>
          )
        }else{
          return(
            <button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btn submit submit-button" onClick={this.addReligion.bind(this)}>Submit</button>
          )
        }
      }

      countrysortup(){
       $("#countrysortup").css('display', 'none');
       $("#countrysortdown").css('display', 'inline-block'); 
        
       var sortedAsc =  this.props.sortedDesc.sort(function(a, b){
         return a.religion > b.religion;
       });
       this.setState({
         data : sortedAsc,
       });
       } 
       countrysortdown(){
       $("#countrysortup").css('display', 'inline-block');
       $("#countrysortdown").css('display', 'none');
          
         var sortedDesc = this.props.sortedDesc.sort(function(a, b){
         return a.religion > b.religion;
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
        return a.religion > b.religion;
      });
      this.setState({
        data : sortedAsc,
      });
      } 
      countrysortdown(){
        $("#countrysortup").css('display', 'inline-block');
      $("#countrysortdown").css('display', 'none');
        
        var sortedDesc = this.state.data.sort(function(a, b){
        return a.religion > b.religion;
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
      
        if(this.state.ReligionId){
          var event = this.updateReligion.bind(this)
        }else{
          var event = this.addReligion.bind(this)
        }
        
           return(
          <div className="content-wrapper pageContent add_relg">
              <div className="content religion-page">
                <div className="wrapperTitle col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
                    <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Religion</span>
                  </div>
                  
                  <div className="switchField col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="pull-right">
                          <input type="radio" id="switch_left" name="options" value="manual" checked={this.state.options === 'manual'} onChange={this.handleInputChange.bind(this)} />
                          <label htmlFor="switch_left">Manual</label>
                          <input type="radio" id="switch_right" name="options" value="auto" checked={this.state.options === 'auto'} onChange={this.handleInputChange.bind(this)} />
                          <label htmlFor="switch_right">Auto</label>
                      </div>
                  </div>
                </div>
                <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                {this.state.options == 'manual' ?   
                <Form id="Religionform">  
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 formht countryField" >
                    <div className="form-group">
                      <div className="form-group">
                          <label className="formLabel control-label statelabel col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >Religion<span className="astrick">*</span></label>
                          <input className="inputBox-main form-control areaStaes" id="Religion" value={this.state.Religion} ref="Religion" type="text" name="Religion" title="Please enter valid Religion!" onChange={this.handleChange.bind(this)} required/>
                      </div>
                    </div>  
                  </div>

            
                  <button  className="submit-button col-lg-2  btn submit "onClick={event} >submit</button> 
                  
                </Form>
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
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
                <table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable  no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
                  <thead className="table-head tablebodyfix "  >
                    <tr className="tempTableHeader " >
                      <th className="umHeader" onclick="sortTable(0)">Religion

                        
                      </th>
        
                      <th className="umHeader" onclick="sortTable(1)"> Action</th>
                    </tr>
                  </thead>
                          
                      
                  { this.props.sortedDesc ?
                    this.props.sortedDesc.length>0 ? 
                            

                      <tbody className="noLRPad tableheaderfix">
                          {this.props.sortedDesc.map( (locationdata,index)=>{
                            return(
                              <tr key={index} className="tablebodyfix">
                              <td className="txtcentr">{locationdata.religion}</td>
                             
                              <td className="txtcentr">
                                  <div className=" dropdown">
                                    <div className="">
                                      <i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
                                    </div>

                                    <div className="dropdown-content  drpdwnpd">
                                    
                                      <ul className="pdcls ulbtm">
                                      
                                         <li>
                                          <div className=" resetIcon col-lg-12 col-md-12 " id={locationdata._id} onClick={this.editReligion.bind(this)}>
                                              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
                                                <i className="fa fa-pencil" aria-hidden="true" title="Edit Profile" ></i>
                                              </div>
                                              <div className="aligntxtUM">
                                                Religion
                                              </div>
                                            </div>

                                          </li>
                                          <li>
                                          <div className=" resetIcon col-lg-12 col-md-12" data-toggle="modal" data-target={`#del-${locationdata._id}`}>
                                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
                                                <i className="fa fa-trash" aria-hidden="true" title="Change Password " ></i>
                                                  </div>
                                              <div className="aligntxtUM">
                                              
                                                Delete Religion
                                              </div>
                                            </div>
                          
                                          </li>
                                        </ul>
                                    </div>
                                    <div className="modal fade" id={`del-${locationdata._id}`} role="dialog">
                                      <div className="modal-dialog modal-md modDelWrapper">
                                          <div className="modal-content col-lg-12 modDelContent">
                                            <div className="modal-header modDelHeader">
                                                <button type="button" className="modDelClose pull-right" data-dismiss="modal">&times;</button>
                                                
                                            </div>

                                              <div className="modal-body deleteMsg">
                                                <p><b>The Religion will be deleted. Are you sure you want to continue?</b></p>
                                            </div>
                                            
                                            <div className="modal-footer modDelFooter">
                                              <button type="button" data-dismiss="modal" className="btn btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 ">Cancel</button>
                                              <button  onClick={this.delRole.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn updateBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" >OK</button>
                                                
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
                        <td colSpan="9" className="ntdiaplay displayblck">Nothing to display.</td>
                              
                      :
                        <tbody>
                          <td colSpan="9" >
                            <div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/SRESloader.gif" className="loaderimgcent" alt="loading"/></div>                      </td>
                        </tbody>
                          
                      }

                </table>
                      
                      { 
                        this.props.post && this.props.post.length>0 ? 
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
          );
      } 
    }

    export default AddReligionexp = withTracker((props)=>{

        const postHandle = Meteor.subscribe('Religiondata');
        const post       = Religion.find({},{sort: {createdAt: -1}}).fetch()||{};
         var sortedDesc = post.sort(function(a, b){
            return a.religion > b.religion;
      });
        const loading    = !postHandle.ready();
      
        return {
          loading,
          post,
          sortedDesc,
        };
    })(AddReligion);
