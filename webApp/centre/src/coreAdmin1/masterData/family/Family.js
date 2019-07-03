import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import ReactTable         from "react-table";
import 'react-table/react-table.css';
import "./Family.css";

class Family extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "QualificationLevel"  :"",
      "Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",
      academicData          :[],
      "uID"                 :"",
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {}
    }
        this.changeTab = this.changeTab.bind(this); 

  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "QualificationLevel"   : this.refs.QualificationLevel.value,          
      "Qualification"        : this.refs.Qualification.value,          
      "Specialization"       : this.refs.Specialization.value,
      "Mode"                 : this.refs.Mode.value, 
      "Grade"                : this.refs.Grade.value,
      "PassoutYear"          : this.refs.PassoutYear.value,
      "UniversityName"       : this.refs.UniversityName.value,
      "City"                 : this.refs.City.value,
      "CollegeName"          : this.refs.CollegeName.value,
      "State"                : this.refs.State.value,
      "Country"              : this.refs.Country.value,
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
  SubmitAcademics(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    if (this.validateForm()) {
    var academicValues= 
    {
    "QualificationLevel"   : this.refs.QualificationLevel.value,          
    "Qualification"        : this.refs.Qualification.value,          
    "Specialization"       : this.refs.Specialization.value,
    "Mode"                 : this.refs.Mode.value, 
    "Grade"                : this.refs.Grade.value,
    "PassoutYear"          : this.refs.PassoutYear.value,
    "UniversityName"       : this.refs.UniversityName.value,
    "City"                 : this.refs.City.value,
    "CollegeName"          : this.refs.CollegeName.value,
    "State"                : this.refs.State.value,
    "Country"              : this.refs.Country.value,
    };

    let fields = {};
    fields["QualificationLevel"] = "";
    fields["Qualification"] = "";
    fields["Specialization"] = "";
    fields["Mode"] = "";
    fields["Grade"] = "";
    fields["PassoutYear"] = "";
    fields["CollegeName"] = "";
    fields["UniversityName"] = "";
    fields["City"] = "";
    fields["State"] = "";
    fields["Country"] = "";
    this.setState({
      "QualificationLevel"  :"",
      "Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",
      fields:fields
    });
    axios
    .post('https://jsonplaceholder.typicode.com/posts',{academicValues})
    .then(function(response){
      console.log(response);
    })
    .catch(function(error){
      console.log(error);
    });
    console.log("academicValues =>",academicValues);
    academicArray.push(academicValues);
    console.log("add value",academicValues);      
    alert("Data inserted Successfully!")
    }

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
      nameOfFamilyHead: "Shyam Patil",
      UID: "29999 99999 99999",
      caste: "Hindu",
      familyCategory: "BPL",
      LHWRF : "Nanded",
      state: "Maharastra",
      district: "Nanded",
      block: "Kowtha",
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
        Header: 'Name Of Family Head',
        accessor: 'nameOfFamilyHead', 
        },
      {
        Header: 'UID No (Aadhar Card No)',
        accessor: 'UID', 
        },
      
        {
        Header: 'Caste',
        accessor: 'caste',
        },
        {
        Header: 'District',
        accessor: 'district',
        },
        {
        Header: 'Block',
        accessor: 'Block', 
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
                      Master Data                                        </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Create New Family</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="Qualification" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder="" name="Qualification" ref="Qualification" />
                          </div>
                          <div className="errorMsg">{this.state.errors.Qualification}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Name of family head </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="Qualification" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder="" name="Qualification" ref="Qualification" />
                          </div>
                          <div className="errorMsg">{this.state.errors.Qualification}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="Qualification" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder="" name="Qualification" ref="Qualification" />
                          </div>
                          <div className="errorMsg">{this.state.errors.Qualification}</div>
                        </div>
                        
                      </div><br/>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Caste</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                        
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family Category   </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">LHWRF Centre</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                        
                        
                  
                      </div>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">State</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">District</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Block</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Village</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                        </div>
                
                      </div> 
                    </div><br/>
                    <div className="col-lg-12">
                      <br/><button className=" col-lg-2 btn submit pull-right"> Submit</button>
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
export default Family