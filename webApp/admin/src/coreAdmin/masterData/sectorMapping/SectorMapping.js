import React, { Component }     from 'react';
import $                        from 'jquery';
import axios                    from 'axios';
import ReactTable               from "react-table";
import swal   from 'sweetalert';

import 'react-table/react-table.css';
import "./SectorMapping.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class SectorMapping extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "goalName"  :"",
      "goalType"  :"",
      "sector"    :"",
      "activity"  :"",
      "uID"       :"",
      
      fields: {},
      errors: {}
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "goalName"   : this.refs.goalName.value,          
      "goalType"   : this.refs.goalType.value,          
    /*  "sector"     : this.refs.sector.value,          
      "activity"   : this.refs.activity.value,  */        
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
  SubmitgoalName(event){
    event.preventDefault();
    var sectorMappingArray=[];
    var id2 = this.state.uID;
    if (this.validateFormReq()) {
    var mappingValues= 
    {
      "goal"   : this.refs.goalName.value,          
      "type"   : this.refs.goalType.value,          
     /* "sector"     : this.refs.sector.value,          
      "activity"   : this.refs.activity.value,       */   
    };
    let fields = {};
    fields["goalName"] = "";
    fields["goalType"] = "";
    fields["sector"] = "";
    fields["activity"] = "";
    this.setState({
      "goalName"  :"",
      "goalType"  :"",
      "sector"    :"",
      "activity"  :"",
      fields:fields
    });
    axios.post('/api/sectorMappings',mappingValues)
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
      if (!fields["goalName"]) {
        formIsValid = false;
        errors["goalName"] = "This field is required.";
      }     
      if (!fields["goalType"]) {
        formIsValid = false;
        errors["goalType"] = "This field is required.";
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
    const data = [{
    srno: 1,
    centerType: "Development Centre",
    NameofCenter: "Pune",
    }
    ]
    const columns = [ 
      {
      Header: 'Sr No',
      accessor: 'srno',
      },
      {
      Header: 'Type of Centre',
      accessor: 'centerType',
      },
      {
      Header: 'Name of Centre',
      accessor: 'NameofCenter', 
      },
    
      {
      Header: 'Action',
      accessor: 'Action',
      Cell: row => 
        (
        <div className="actionDiv col-lg-offset-2">
            <div className="col-lg-4" onClick={() => this.deleteData(row.original)}>
          <i className="fa fa-trash"> </i>
            </div>
            <div className="col-lg-4" onClick={() => this.updateData(row.original)}>
          <i className="fa fa-pencil"> </i>
            </div>
          </div>
          )     
        }
    ]
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Master Data                                        
                      </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="sectorMapping">                   
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Sector Mapping</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Type of Goal/Project</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                            <select className="custom-select form-control inputBox" ref="goalType" name="goalType" value={this.state.goalType} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              <option>SDG Goal</option>
                              <option>ADP Goal</option>
                              <option>Empowerment Line Goal</option>
                              <option>Project Name</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.goalType}</div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                          <label className="formLable">Enter Goal / Project Name</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="goalName" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts" value={this.state.goalName} onChange={this.handleChange.bind(this)} placeholder="" name="goalName" ref="goalName" />
                          </div>
                          <div className="errorMsg">{this.state.errors.goalName}</div>
                        </div>
                        <div className=" col-md-12 col-sm-6 col-xs-12 ">
                         
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above {this.state.goalType}</label></div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable htDiv  mt">
                        <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Natural Resource Management</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                            <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                        <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Agriculture Development</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                            <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            <div className="col-lg-12 noPadding">  
                              <div className="actionDiv">
                                <div className="SDGContainer col-lg-1">
                                  <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                </div>
                              </div>                            
                              <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                        <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Animal Husbandry</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                            <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable htDiv  ">
                        <div className=" col-md-4  col-lg-4 col-sm-6 col-xs-12 ">
                          <label className="formLable faintCoolor">Natural Resource Management</label>
                         <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                             <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                             <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                         <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Agriculture Development</label>
                         <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                             <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                             <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                         <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Animal Husbandry</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                             <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                             <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitgoalName.bind(this)}> Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default SectorMapping