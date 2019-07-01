import React, { Component } from 'react';
import { render }           from 'react-dom';
import TrackerReact         from 'meteor/ultimatejs:tracker-react';
import {Religion}      from '/imports/coreAdmin/masterData/manageLocation/components/Religion/component/Religion.js';

export default class AddReligiondatalist extends Component {


    constructor(props) {
        super(props);
        this.state = {
            religion: this.props.religionValues.religion,
        };

        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
    if ( !$("#adminSide").length>0 && !$('body').hasClass('adminSide')) {
      var adminSide = document.createElement("script");
      adminSide.type="text/javascript";
      adminSide.src = "/js/adminSide.js";
      $("body").append(adminSide);
    }

    }
    

    editLanguages(event){
      event.preventDefault();
      var ReligionId    = event.target.id;
      var religion  = {
        "country": $("input[name="+Religion+"-Namecountry]").val(),
      }
      Meteor.call('updateReligion', ReligionId, religion,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                        swal("Religion updated successfully!!")
                    }//the _id of new object if successful
                }
        )
    }

    delReligion(event){
      event.preventDefault();
      Meteor.call('deleteReligion', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    
                }); 

    }

    handleChange(event){
        this.setState({value: event.target.value});
    }



    render(){
        
       return(
                <tr>
                    <td className="rolelst"> {this.props.countryValues.religion}</td>            
                    <td className="roletbl"> 
                   <a href="#" className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" data-toggle="modal" data-target={`#Religion-${this.props.religionValues._id}`} ></a>

                        
                   <div id={`editCountry-${this.props.religionValues._id}`} className="modal fade" role="dialog">
                       <div className="modal-dialog">


                           <div className="modal-content reportWrapper">
                               <div className="modal-header">
                                   <button type="button" className="close" data-dismiss="modal">&times;</button>
                                         <h4 className="modal-title edittitle">Edit Religion</h4>
                               </div>
                               <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                   <form className="editroles">
                                       <div className="form-group col-lg-8 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
                                           <label className="statelabel">Religion</label>
                                           <input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.religionValues._id}-Namecountry`} defaultValue={`${this.state.religion}`} onChange={this.handleChange.bind(this)} required />
                                       </div>
                                       <div className="form-group col-lg-2 col-md-4 col-xs-12 col-sm-12 ">
                                           <label>&nbsp;</label>
                                           <button type="button" onClick={this.editReligion.bind(this)} id={this.props.religionValues._id} className="btn btn-primary submit" data-dismiss="modal">Update</button>
                                       </div>
                                   </form>
                               </div>
                               <div className="modal-footer">
                                   {/*  <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>*/}
                               </div>
                           </div>

                       </div>
                   </div>

                    &nbsp;&nbsp;
                        
                        <a className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.religionValues._id}`}></a>

                         <div className="modal fade" id={`del-${this.props.religionValues._id}`} role="dialog">
                            <div className="modal-dialog modal-sm">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                 {/* <h4 className="modal-title">Delete </h4>*/}
                                </div>
                                <div className="modal-body">
                                  <p><b>Religion will be deleted. Are you sure you want to continue?.</b></p>
                                </div>
                                <div className="modal-footer">
                                  <button  onClick={this.delReligion.bind(this)} id={this.props.religionValues._id} type="button" data-dismiss="modal" className="btn btn-danger btndeleterole deleteRole" >Delete</button>
                                  <button type="button" data-dismiss="modal" className="btn btn-primary ">Cancel</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        

                    </td>       
                </tr>
        );

    } 

}