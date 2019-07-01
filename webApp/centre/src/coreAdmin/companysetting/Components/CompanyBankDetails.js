import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";

import axios from 'axios';


class CompanyBankDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
          accHolderName  : this.props.accHolderName,
          accNickName    : this.props.accNickName,
          accType        : this.props.accType,
          bankName       : this.props.bankName,
          branchName     : this.props.branchName,
          accNumber      : this.props.accNumber,
          ifscCode       : this.props.ifscCode,
          submitVal      : true,
    
          subscription : {
           
          }
        };
    this.handleChange = this.handleChange.bind(this);
       
      }
 componentDidMount(){
   
  }
  submitBankDetail(event){
    event.preventDefault();
  
      var companyBankDetailsFormValue ={

        accHolderName  : this.state.accHolderName,
        accNickName    : this.state.accNickName,
        accType        : this.state.accType,
        bankName       : this.state.bankName,
        branchName     : this.state.branchName,
        accNumber      : this.state.accNumber,
        ifscCode       : this.state.ifscCode

      }//close array
      // var companyBankDetailsFormValue ={

      //   accHolderName  : $(".accHolderName").val(),
      //   accNickName    : $(".accNickName").val(),
      //   accType        : $(".accType").val(),
      //   bankName       : $(".bankName").val(),
      //   branchName     : $(".branchName").val(),
      //   accNumber      : $(".accNumber").val(),
      //   ifscCode       : $(".ifscCode").val(),

      // }//close array

      axios.patch('/api/companysettings/bank/edit/',{companyBankDetailsFormValue})
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

}
handleChange(event){
  const target = event.target;
  const name   = target.name;
  this.setState({
    [name]: event.target.value,
  });
}

 

  
  render(){
    
    return(
      <div className="">
          <section className="NotificationContent">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
                <div className="">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="">Bank Details</h4>
                  </div>
                  <hr className="compySettingHr" />
                    <div className="tablebdy">
                      <form id="bankDetailForm" className="bankDetailForm">

                           <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                              <div className="form-group">
                                  <label className="control-label statelabel locationlabel" >Enter Account Holder Name</label><span className="astrick">*</span>
                                  <input id="accHolderName" value={this.state.accHolderName} onChange={this.handleChange.bind(this)} type="text" name="accHolderName" ref="accHolderName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                              </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Account Nick Name</label><span className="astrick">*</span>
                                <input id="accNickName" value={this.state.accNickName} onChange={this.handleChange.bind(this)} type="text" name="accNickName" ref="accNickName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                            </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Account Type</label><span className="astrick">*</span>
                                <input id="accType" value={this.state.accType} onChange={this.handleChange.bind(this)} type="text" name="accType" ref="accType" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                 {/* <select value={this.state.accType} onChange={this.handleChange} className="form-control accType inputValid required" name="accType">
                                  <option value="0" selected="true" disabled="disabled">Enter Account Type</option>
                                  <option value="Current">Current</option>
                                  <option value="Saving">Saving</option>
                                </select>    */}
                            </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Bank Name</label><span className="astrick">*</span>
                                <input id="bankName" value={this.state.bankName} onChange={this.handleChange.bind(this)} type="text" name="bankName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Account Number</label><span className="astrick">*</span>
                                <input id="accNumber" value={this.state.accNumber} onChange={this.handleChange.bind(this)} type="text" name="accNumber" className="form-control areaStaes" title="Please enter alphanumeric only" />
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Branch Name</label><span className="astrick">*</span>
                                <input id="branchName" value={this.state.branchName} onChange={this.handleChange.bind(this)} type="text" name="branchName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter IFSC Code</label><span className="astrick">*</span>
                                <input id="ifscCode" value={this.state.ifscCode} onChange={this.handleChange.bind(this)} type="text" name="ifscCode" className="form-control areaStaes" title="Please enter alphanumeric only" />
                            </div>  
                          </div>
                          
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          {/* <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12  btn btn-primary btnSubmit pull-right bankDetails" onClick={this.submitBankDetail.bind(this)}>Submit</button> */}

                          <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck"  onClick={this.submitBankDetail.bind(this)}>
                            {this.state.submitVal
                              ?
                                "Submit"
                              : 
                                "Update"
                            }  
                          </button>
                        </div>
                      </form>
                      <table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
                        <thead className="table-head umtblhdr ">
                          <tr className="hrTableHeader">
                            <th className="umHeader txtalgncentr"> AccountHolder Name </th>
                            <th className="umHeader txtalgncentr"> Bank Name </th>
                            <th className="umHeader txtalgncentr"> Branch Name </th>
                            <th className="umHeader txtalgncentr"> Account Number </th>
                            <th className="umHeader txtalgncentr"> Account Type </th>
                            <th className="umHeader txtalgncentr"> Action </th>
                          </tr>
                        </thead>
                        <tbody className="addRoleTbody">
                                  
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
              
        </div>


      );
  }

 }

export default CompanyBankDetails;
