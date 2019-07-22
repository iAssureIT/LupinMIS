import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';

import IAssureTable           from "./IAssureTable.jsx";
// import "./Activity.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class NewBeneficiary extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      
      "uID"                 :"",
      "shown"               : true,
      "twoLevelHeader"      : {
        apply               : false,
      firstHeaderData       : [
                                {
                                    heading : '',
                                    mergedColoums : 10
                                },
                                {
                                    heading : 'Source of Fund',
                                    mergedColoums : 7
                                },
                              ]
      },
      "tableHeading"        : {
        familyID            : "Family ID",
        beneficiaryID       : "Beneficiary ID",
        nameofbeneficiaries : "Name of Beneficiary",
        // actions             : 'Action',
      },
      shown                 : true,
      fields: {},
      errors: {},
      " tableObjects"       : {
        apiLink             : '/api/activityReport/',
        editUrl             : '/activity/'
      },
      // selectedBeneficiaries : [],
      "startRange"          : 0,
      "limitRange"          : 10,
      // "editId"             : this.props.match.params ? this.props.match.params.id : '',
      fields: {},
      errors: {},    
    }
  }
  handleChange(event){
    event.preventDefault(); 
    this.setState({
      "center_id"         : "",
      "centerName"        : "",
      "dist"              : this.refs.dist.value,
      "block"             : this.refs.block.value,
      "village"           : this.refs.village.value,
      "date"              : this.refs.date.value,
      "sector"            : this.refs.sector.value,
      "typeofactivity"    : this.refs.typeofactivity.value,
      "activity"          : this.refs.activity.value,
      "subactivity"       : this.refs.subactivity.value,
      "unit"              : this.state.unit.value,
      "unitCost"          : this.refs.unitCost.value,
      "quantity"          : this.refs.quantity.value,
      "totalcost"         : this.state.totalcost,
      "LHWRF"             : this.refs.LHWRF.value,
      "NABARD"            : this.refs.NABARD.value,
      "bankLoan"          : this.refs.bankLoan.value,
      "govtscheme"        : this.refs.govtscheme.value,
      "directCC"          : this.refs.directCC.value,
      "indirectCC"        : this.refs.indirectCC.value,
      "other"             : this.refs.other.value,

    });
 
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  }
  componentDidMount() {
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getData(this.state.startRange, this.state.limitRange);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps){
      this.setState({
        selectedValues : nextProps.selectedValues,
        sendBeneficiary: nextProps.sendBeneficiary,
        // selectedBeneficiaries: nextProps.sendBeneficiary
      })
    }
  }
  getData(startRange, limitRange){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.get('/api/beneficiaries/list',data)
    .then((response)=>{
      
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
  }

  toglehidden(){
   this.setState({
     shown: !this.state.shown
    });
  }
  addBeneficiary(selectedBeneficiaries){
    this.setState({
      selectedBeneficiaries : selectedBeneficiaries
    })
  }
  addBeneficiaries(event){
    event.preventDefault();
    this.props.listofBeneficiaries(this.state.selectedBeneficiaries);
  }
  render() {
     var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    return (
        <div className="col-lg-12 col-sm-12 col-xs-12" >
          <div className="row">
            <h4 className="pageSubHeader col-lg-6 col-sm-6 col-xs-6 ">List of Beneficiaries</h4>
            <div className="addContainerAct col-lg-6 pull-right mr30" data-toggle="modal" data-target="#myModal"> <i className="fa fa-plus" aria-hidden="true"></i></div>
             <div className="modal fade in " id="myModal" role="dialog">
              <div className="modal-dialog modal-lg " >
                <div className="modal-content ">
                  <div className=" ">
                    <div className="col-lg-12  col-md-10 pageContent margTop">
                      <button type="button" className="close" data-dismiss="modal"> <i className="fa fa-times"></i></button>
                        <div className="col-lg-12 ">
                          <h4 className="pageSubHeader">Add Beneficiary</h4>
                        </div>
                        <div className="row"> 
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                            <div className=" col-lg-3  col-lg-offset-1 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">District</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Pune</option>
                                  <option>Thane</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Block</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Pimpari</option>
                                  <option>Haveli</option>
                                  <option>Chinchwad</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Village</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Shivne</option>
                                  <option>Hadapsar</option>
                                  <option>Manjari</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                          </div>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight row">
                            <div className=" col-lg-6 col-sm-12 col-xs-12 col-lg-offset-3 formLable boxHeightother ">
                              <label className="formLable">Search</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                             <div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1  boxHeightother">
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt23" >
                                <div className="addContainerAct col-lg-6 pull-right" id="click_advance"  onClick={this.toglehidden.bind(this)}><div className="display_advance" id="display_advance"><i className="fa fa-plus" aria-hidden="true" id="click"></i></div></div>
                              </div>
                            </div>
                          </div> 
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight " style={hidden}>
                             <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 formLable boxHeightother">
                              <label className="formLable">Family ID </label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>L000001</option>
                                  <option>B000001</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                            <div className=" col-lg-4 col-sm-12 col-xs-12 formLable boxHeightother ">
                              <label className="formLable">Beneficiary Name</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                            <div className=" col-lg-4 col-sm-12 col-xs-12 formLable boxHeightother ">
                              <label className="formLable">Beneficiary ID</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder="" ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                            <div className="">  
                              <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                tableObjects={this.state.tableObjects}
                                getBeneficiaries={this.addBeneficiary.bind(this)}    
                                selectedValues = {this.state.selectedValues}  
                                sendBeneficiary={this.state.sendBeneficiary}
                              />
                            </div>
                          </div> 
                        </div>
                        <div className="col-lg-12">
                            <br/><button className=" col-lg-2 btn submit pull-right" data-dismiss="modal" onClick={this.addBeneficiaries.bind(this)}> Add</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default NewBeneficiary