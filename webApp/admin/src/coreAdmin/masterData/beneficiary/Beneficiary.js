import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import ReactTable         from "react-table";
import 'react-table/react-table.css';
import "./Beneficiary.css";

class Beneficiary extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"             :"",
      "beneficiaryID"        :"",
      "beneficiaryName"      :"",
      "academicData"          :[],
      "shown"                 : true,
            tabtype : "location",

      "fields": {},
      "errors": {}
    }
        this.changeTab = this.changeTab.bind(this); 

  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"             : this.refs.familyID.value,          
      "beneficiaryID"        : this.refs.beneficiaryID.value,          
      "beneficiaryName"      : this.refs.beneficiaryName.value,
      
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  /*  if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }*/
  }

  componentWillReceiveProps(nextProps){
    console.log('nextProps',nextProps);
    if(nextProps.BasicInfoId){
       if(nextProps.BasicInfoId.academicsInfo&&nextProps.BasicInfoId.academicsInfo.length>0){
        this.setState({
         academicData:nextProps.BasicInfoId.academicsInfo
        })
      }
    }
  }

  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
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
  SubmitBeneficiary(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
/*    if (this.validateForm()) {
*/    var beneficiaryValue= 
    {
      "familyID"             : this.refs.familyID.value,          
      "beneficiaryID"        : this.refs.beneficiaryID.value,          
      "beneficiaryName"      : this.refs.beneficiaryName.value,
    };

    let fields = {};
    fields["familyID"] = "";
    fields["beneficiaryID"] = "";
    fields["beneficiaryName"] = "";

    this.setState({
      "familyID"             :"",
      "beneficiaryID"        :"",
      "beneficiaryName"      :"",   
      fields:fields
    });
    axios
    .post('https://jsonplaceholder.typicode.com/posts',{beneficiaryValue})
    .then(function(response){
      console.log(response);
    })
    .catch(function(error){
      console.log(error);
    });
    console.log("academicValues =>",beneficiaryValue);
    academicArray.push(beneficiaryValue);
    console.log("add value",beneficiaryValue);      
    alert("Data inserted Successfully!")
/*    }
*/
  }

    componentDidMount() {
     
    }

    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
    console.log("tabtype",this.state.tabtype);
  }



    render() {
      const data = [{
      srno: 1,
      familyID: "PL00001",
      beneficiaryID: "P11111",
      nameOfbeneficiary: "Priyanka Lewade",
      }
      ]
      const columns = [ 
        {
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'Family ID',
        accessor: 'familyID',
        },
        {
        Header: 'Beneficiary ID',
        accessor: 'beneficiaryID', 
        },
      {
        Header: 'Name of Beneficiary',
        accessor: 'nameOfbeneficiary', 
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


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Master Data                                        
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Create New Beneficiary</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="familyID" >
                            <select className="custom-select form-control inputBox" value={this.state.familyID} ref="familyID" name="familyID" onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.familyID}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Beneficiary ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="beneficiaryID" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""value={this.state.beneficiaryID} ref="beneficiaryID" name="beneficiaryID" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.beneficiaryID}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Name of Beneficiary</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="beneficiaryName" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder="" value={this.state.beneficiaryName} ref="beneficiaryName" name="beneficiaryName" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.beneficiaryName}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12">
                      <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Submit</button>
                    </div>
                  </form>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt " >  
                        <ReactTable 
                          data      = {data}
                          columns     = {columns}
                          sortable    = {true}
                          defaultPageSiz  = {5}
                          minRows     = {3} 
                          className       = {"-striped -highlight"}
                          showPagination  = {true}
                        />
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
export default Beneficiary