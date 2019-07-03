import React, { Component } from 'react';
import { render }           from 'react-dom';
import TrackerReact         from 'meteor/ultimatejs:tracker-react';
import {MartialStatus}      from '/imports/coreAdmin/masterData/manageLocation/components/MartialStatus/component/MartialStatus.js';

export default class AddMartialStatusdatalist extends Component {


    constructor(props) {
        super(props);
        this.state = {
            martialStatus: this.props.martialStatusvalues.martialStatus,
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
    

    editMartialStatus(event){
      event.preventDefault();
      var MartialStatusId    = event.target.id;
      var martialStatus  = {
        "country": $("input[name="+MartialStatus+"-Namecountry]").val(),
      }
      Meteor.call('updateMartialStatus', MartialStatusId, martialStatus,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                        swal("MartialStatus updated successfully!!")
                    }//the _id of new object if successful
                }
        )
    }

    delMartialStatus(event){
      event.preventDefault();
      Meteor.call('deleteMartialStatus', event.currentTarget.id,
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
                    <td className="rolelst"> {this.props.countryvalues.martialStatus}</td>            
                    <td className="roletbl"> 
                   <a href="#" className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" data-toggle="modal" data-target={`#MartialStatusCountry-${this.props.martialStatusvalues._id}`} ></a>

                        
                   <div id={`editCountry-${this.props.martialStatusvalues._id}`} className="modal fade" role="dialog">
                       <div className="modal-dialog">


                           <div className="modal-content reportWrapper">
                               <div className="modal-header">
                                   <button type="button" className="close" data-dismiss="modal">&times;</button>
                                         <h4 className="modal-title edittitle">Edit MartialStatus</h4>
                               </div>
                               <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                   <form className="editroles">
                                       <div className="form-group col-lg-8 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
                                           <label className="statelabel">MartialStatus</label>
                                           <input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.martialStatusvalues._id}-Namecountry`} defaultValue={`${this.state.martialStatus}`} onChange={this.handleChange.bind(this)} required />
                                       </div>
                                       <div className="form-group col-lg-2 col-md-4 col-xs-12 col-sm-12 ">
                                           <label>&nbsp;</label>
                                           <button type="button" onClick={this.editMartialStatus.bind(this)} id={this.props.martialStatusvalues._id} className="btn btn-primary submit" data-dismiss="modal">Update</button>
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
                        
                        <a className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.martialStatusvalues._id}`}></a>

                         <div className="modal fade" id={`del-${this.props.martialStatusvalues._id}`} role="dialog">
                            <div className="modal-dialog modal-sm">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                 {/* <h4 className="modal-title">Delete </h4>*/}
                                </div>
                                <div className="modal-body">
                                  <p><b>MartialStatus will be deleted. Are you sure you want to continue?.</b></p>
                                </div>
                                <div className="modal-footer">
                                  <button  onClick={this.delMartialStatus.bind(this)} id={this.props.martialStatusvalues._id} type="button" data-dismiss="modal" className="btn btn-danger btndeleterole deleteRole" >Delete</button>
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