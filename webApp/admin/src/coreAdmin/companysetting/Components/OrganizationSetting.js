import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import $ from "jquery";
import CompanyInformation           from  '../Components/CompanyInformation.js';
import CompanyLocation              from  '../Components/CompanyLocation.js';
import '../css/CompanySetting.css';
import CompanyBankDetails           from  '../Components/CompanyBankDetails.js';
import CompanyTaxDetails            from  '../Components/CompanyTaxDetails.js';
import CompanyPaymentGateway        from  '../Components/CompanyPaymentGateway.js';
// import AddPropertyType           from  '/imports/admin/companySetting/Add_Property_subproperty/AddPropertyType.jsx';

 class OrganizationSetting extends Component{
    constructor(props) {
		super(props)

		this.state = {
			companyinformation				: "Company Information",
		}
		// this.handleChange = this.handleChange.bind(this);
		// this.onChange 		= this.onChange.bind(this);

	}
  componentDidMount() {
  }

  
  componentWillUnmount(){
    
  }
  clickLi(event){
   // event.preventDefault();
    // $("#companyLocationForm").validate().resetForm();
    // $("#companyInformationForm").validate().resetForm();
    //$('.error').css({'display':'none'})
  }


  render() {

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Organization Setting                                     
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>     
                  <div className="boxMinHeight boxMinHeighttab">
                    <div  className="">
                      {/*<div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                        <ul className="nav nav-tabs tabs-left sideways">
                          <li className="active  col-lg-12 col-md-12 col-xs-12 col-sm-12" onClick={this.clickLi.bind(this)}><a className="tabLeft tablefthr lettersp" href="#companyInformation" data-toggle="tab">Company Information</a></li>
                          <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"         onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyLocation" data-toggle="tab">Location Details</a></li>
                          <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"        onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyBankDetails" data-toggle="tab">Bank Details</a></li>
                          <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"        onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyTaxDetails" data-toggle="tab">Tax Information</a></li>
                          <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"        onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyPaymentGateway" data-toggle="tab">Payment Gateway</a></li>
                        </ul>
                      </div>*/}
                      <div className="tab-content col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="tab-pane active" id="companyInformation"> <CompanyInformation/> </div>
                     {/* 
                        <div className="tab-pane" id="CompanyLocation"> <CompanyLocation/> </div>
                        <div className="tab-pane" id="CompanyBankDetails"> <CompanyBankDetails/> </div>                               
                        <div className="tab-pane" id="CompanyTaxDetails"> <CompanyTaxDetails/> </div>
                        <div className="tab-pane" id="CompanyPaymentGateway"> <CompanyPaymentGateway/> </div>   */}                             
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default OrganizationSetting;