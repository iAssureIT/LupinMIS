import React, { Component }       from 'react';
import $                          from 'jquery';
import axios                      from 'axios';
import swal   from 'sweetalert';

import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";
import "./Sector.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Sector extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sector"              :"",
      "uID"                 :"",
      fields                : {},
      errors                : {},
      "twoLevelHeader"      : {
        apply               : true,
        firstHeaderData     : [
                              {
                                  heading : '',
                                  mergedColoums : 4
                              },
                              {
                                  heading : 'Center Incharge',
                                  mergedColoums : 3
                              },
                              {
                                  heading : 'MIS Coordinator',
                                  mergedColoums : 3
                              },
                            ]
      },
      "tableHeading"        : {
        type                      : "Type of Center",
        centerName                : "Name of Center",
        address                   : "Address",
        centerInchargename        : "Name",
        centerInchargemobile      : "Contact",
        centerInchargeemail       : "Email",
        misCoordinatorname        : "Name",
        misCoordinatormobile      : "Contact",
        misCoordinatoremail       : "Email",
        actions                   : 'Action',
      },
      "startRange"          : 0,
      "limitRange"          : 10,
/*      "editId"              : this.props.match.params ? this.props.match.params.id : ''
*/    }
/*    console.log('params', this.props.match.params);
*/  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
     "sector"   : this.refs.sector.value,  
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  }

  isTextKey(evt)
  {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
 
  }

  SubmitSector(event){
    event.preventDefault();
    var sectorArray=[];
    var id2 = this.state.uID;
    if (this.validateFormReq()) {
    var sectorValues= 
    {
    "sector"   : this.refs.sector.value,  
    };

    let fields = {};
    fields["sector"] = "";
 
    this.setState({
      "sector"  :"",
      fields:fields
    });
    axios.post('/api/sectors',sectorValues)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
/*        this.getData(this.state.startRange, this.state.limitRange);
*/      })
      .catch(function(error){
        console.log("error = ",error);
      });
    } 
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  componentDidMount() {
   
  }

  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="sectorDetails">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sector</span>
              </div>
              <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
              <div className="row">
                <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable">Name of Sector</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="sector" >
                      {/*<div className="input-group-addon inputIcon">
                        <i className="fa fa-graduation-cap fa"></i>
                      </div>*/}
                      <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="sector" name="sector" value={this.state.sector} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="errorMsg">{this.state.errors.sector}</div>
                  </div>
                  <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.SubmitSector.bind(this)}> Submit</button>
                  </div>
                </div> 
              </div><br/>
            </form>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
               {/*<IAssureTable 
                tableHeading={this.state.tableHeading}
                twoLevelHeader={this.state.twoLevelHeader} 
                dataCount={this.state.dataCount}
                tableData={this.state.tableData}
                getData={this.getData.bind(this)}
                
              />*/}
            </div>              
          </div>
        </div>
      </div>
    );

  }

}
export default Sector