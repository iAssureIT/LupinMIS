import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";

import 'react-table/react-table.css';
import "./Family.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Family extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"             :"",
      "nameOfFamilyHead"     :"",
      "uID"                  :"",
      "caste"                :"",
      "category"             :"",
      "LHWRFCentre"          :"",
      "state"                :"",
      "district"             :"",
      "block"                :"",
      "village"              :"",
      academicData           :[],
      shown                  : true,
            tabtype : "location",

      fields: {},
      errors: {}
    }
        this.changeTab = this.changeTab.bind(this); 

  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"             :this.refs.familyID.value, 
      "nameOfFamilyHead"     :this.refs.nameOfFamilyHead.value, 
      "uID"                  :this.refs.uID.value, 
      "caste"                :this.refs.caste.value, 
      "category"             :this.refs.category.value, 
      "LHWRFCentre"          :this.refs.LHWRFCentre.value, 
      "state"                :this.refs.state.value, 
      "district"             :this.refs.district.value, 
      "block"                :this.refs.block.value, 
      "village"              :this.refs.village.value, 
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
  // SubmitFamily(event){
  //   event.preventDefault();
  //   var academicArray=[];
  //   var id2 = this.state.uID;
  //   // if (this.validateForm()) {
  //   var familyValues= 
  //   {
  //     "familyID"              :this.refs.familyID.value, 
  //     "nameOfFamilyHead"     :this.refs.nameOfFamilyHead.value, 
  //     "uID"                  :this.refs.uID.value, 
  //     "caste"                :this.refs.caste.value, 
  //     "category"             :this.refs.category.value, 
  //     "LHWRFCentre"          :this.refs.LHWRFCentre.value, 
  //     "state"                :this.refs.state.value, 
  //     "district"             :this.refs.district.value, 
  //     "block"                :this.refs.block.value, 
  //     "village"              :this.refs.village.value, 
  //   };

  //   let fields = {};
  //   fields["QualificationLevel"] = "";
  //   fields["Qualification"] = "";
  //   fields["Specialization"] = "";
  //   fields["Mode"] = "";
  //   fields["Grade"] = "";
  //   fields["PassoutYear"] = "";
  //   fields["CollegeName"] = "";
  //   fields["UniversityName"] = "";
  //   fields["City"] = "";
  //   fields["State"] = "";
  //   fields["Country"] = "";
  //   this.setState({
  //     "familyID"             :"",
  //     "nameOfFamilyHead"     :"",
  //     "uID"                  :"",
  //     "caste"                :"",
  //     "category"             :"",
  //     "LHWRFCentre"          :"",
  //     "state"                :"",
  //     "district"             :"",
  //     "block"                :"",
  //     "village"              :"",
  //     fields:fields
  //   });
  //   axios
  //   .post('qalmisapi.iassureit.com/api/beneficiaryFamilies',{familyValues})
  //   .then(function(response){
  //     console.log(response);
  //   })
  //   .catch(function(error){
  //     console.log(error);
  //   });
  //   console.log("academicValues =>",familyValues);
  //   academicArray.push(familyValues);
  //   console.log("add value",familyValues);      
  //   alert("Data inserted Successfully!")
  //   // }

  // }

  SubmitFamily(event){
    event.preventDefault();
  var familyValues= 
    {
      familyID             :this.refs.familyID.value, 
      familyHead           :this.refs.nameOfFamilyHead.value, 
      uidNumber                  :this.refs.uID.value, 
      caste                :this.refs.caste.value, 
      familyCategory             :this.refs.category.value, 
      center          :this.refs.LHWRFCentre.value, 
      state                :this.refs.state.value, 
      dist            :this.refs.district.value, 
      block                :this.refs.block.value, 
      village              :this.refs.village.value, 
    };

    axios.post('/api/beneficiaryFamilies', familyValues)
      .then( (res)=>{
        console.log(res);
        if(res.status == 201){
          alert("Data inserted Successfully!")
          this.refs.familyID.value = '';
          this.refs.nameOfFamilyHead.value= ''; 
          this.refs.uID.value= ''; 
          this.refs.caste.value= ''; 
          this.refs.category.value= ''; 
          this.refs.LHWRFCentre.value= ''; 
          this.refs.state.value= ''; 
          this.refs.district.value= ''; 
          this.refs.block.value= ''; 
          this.refs.village.value= ''; 
        }
      })
      .catch((error)=>{
        console.log("error = ",error);
        alert("Something went wrong! Please check Get URL.");
      });
  

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
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Master Data                                        </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="family">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Create New Family</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="familyID" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts" ref="familyID" name="familyID" value={this.state.familyID} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.familyID}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Name of family head </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="nameOfFamilyHead" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts" ref="nameOfFamilyHead" name="nameOfFamilyHead" value={this.state.nameOfFamilyHead} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.nameOfFamilyHead}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uID" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="uID" name="uID" maxLength = "12" value={this.state.uID} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.uID}</div>
                        </div>
                        
                      </div><br/>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Caste</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="caste" >
                            <select className="custom-select form-control inputBox" ref="caste" name="caste" value={this.state.caste} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              <option>Maratha</option>
                              <option>Maratha</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.caste}</div>
                        </div>
                        
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family Category   </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="category" >
                            <select className="custom-select form-control inputBox"ref="category" name="category" value={this.state.category} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Open</option>
                              <option>Open</option>
                              <option>Open</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.category}</div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">LHWRF Centre</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRFCentre" >
                            <select className="custom-select form-control inputBox"ref="LHWRFCentre" name="LHWRFCentre" value={this.state.LHWRFCentre} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.LHWRFCentre}</div>
                        </div>
                        
                        
                  
                      </div>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">State</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                            <select className="custom-select form-control inputBox" ref="state" name="state" value={this.state.state} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Maharastra</option>
                              <option>Maharastra</option>
                              <option>Maharastra</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.state}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">District</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                            <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.district}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Block</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                            <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pimpari</option>
                              <option>Pimpari</option>
                              <option>Pimpari</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Village</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                            <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Shivne</option>
                              <option>Shivne</option>
                              <option>Shivne</option>
                              <option>Shivne</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.village}</div>
                        </div>
                
                      </div> 
                    </div><br/>
                    <div className="col-lg-12">
                      <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitFamily.bind(this)}> Submit</button>
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