import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';

// import swal from 'sweetalert';

class CompanyTaxDetails extends Component{
   constructor(props) {
    super(props);
    this.state = {
      taxrating   : '',
      taxtype     : '',
      Effective   : '',
      submitVal      : true,
      subscription : {
        
      }

    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    
  }
  componentDidMount() {
  
    
  
  }
  submitCompanyInformation=(event)=>{
    event.preventDefault();
   
    var companytaxinfo = {
      taxrating             : this.state.taxrating,
      taxtype               : this.state.taxtype,
      Effective             : this.state.Effective,
     
    }//close array

    // if($('#companyInformationForm').valid()){
      
    // }
    axios.post('https://jsonplaceholder.typicode.com/posts',{companytaxinfo})
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
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
         {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header compyHeader">
          <h4 className="lettersp MasterBudgetTitle">Company Information</h4>
          </div>*/}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Tax Information</h4>
            </div>
               <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanyTaxDetailsForm"  >
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Tax Type</label><span className="astrick">*</span>
                        <input id="taxtype" value={this.state.taxtype} onChange={this.handleChange.bind(this)} type="text" name="taxtype" className="form-control areaStaes" title="Please enter alphanumeric only" />
                    </div>  
                  </div>

                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Tax Rating</label><span className="astrick"></span>
                        <input id="taxrating" value={this.state.taxrating} onChange={this.handleChange.bind(this)} type="text" name="taxrating" ref="taxrating" className="form-control areaStaes" title="taxrating" autoComplete="off"  />
                    </div>  
                  </div>
               
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Effective From</label><span className="astrick">*</span>
                        <input className="form-control areaStaes" title="Please enter valid mobile number only" id="Effective" type="date" name="Effective" ref="Effective"required />
                    </div> 
                  </div>
                  
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck" onClick={this.submitCompanyInformation.bind(this)} >
                  {this.state.submitVal
                    ?
                      "Submit"
                    : 
                      "Update"
                  }  
                </button>
              </div>
            </form>

            
          </div>
        </div>
      </div>

      );
  }

 }

 export default CompanyTaxDetails;