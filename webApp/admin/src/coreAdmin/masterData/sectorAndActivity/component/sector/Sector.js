import React, { Component }       from 'react';
import $                          from 'jquery';
import axios                      from 'axios';
import ReactTable                 from "react-table";

import 'react-table/react-table.css';
import "./Sector.css";


class Sector extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sector"  :"",
      /*"Qualification"       :"",
      "activity":"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",*/
      "academicData"          :[],
      "uID"                 :"",
      "shown"                 : true,
            "tabtype" : "location",

      fields: {},
      errors: {}
    }
    this.changeTab = this.changeTab.bind(this); 
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
     "sector"   : this.refs.sector.value,  
      /*"Qualification"        : this.refs.Qualification.value,          
      "activity"   : this.refs.activity.value,  

      "Specialization"       : this.refs.Specialization.value,
      "Mode"                 : this.refs.Mode.value, 
      "Grade"                : this.refs.Grade.value,
      "PassoutYear"          : this.refs.PassoutYear.value,
      "UniversityName"       : this.refs.UniversityName.value,
      "City"                 : this.refs.City.value,
      "CollegeName"          : this.refs.CollegeName.value,
      "State"                : this.refs.State.value,
      "Country"              : this.refs.Country.value,*/
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
  SubmitSector(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    // if (this.validateForm()) {
    var sectorValues= 
    {
    "sector"   : this.refs.sector.value,  
      /*"Qualification"        : this.refs.Qualification.value,          
      "activity"   : this.refs.activity.value,  
      "Specialization"       : this.refs.Specialization.value,
      "Mode"                 : this.refs.Mode.value, 
      "Grade"                : this.refs.Grade.value,
      "PassoutYear"          : this.refs.PassoutYear.value,
      "UniversityName"       : this.refs.UniversityName.value,
      "City"                 : this.refs.City.value,
      "CollegeName"          : this.refs.CollegeName.value,
      "State"                : this.refs.State.value,
      "Country"              : this.refs.Country.value,*/
    };

    let fields = {};
    fields["sector"] = "";
   /* fields["Qualification"] = "";
    fields["activity"] = "";
    fields["Mode"] = "";
    fields["Grade"] = "";
    fields["PassoutYear"] = "";
    fields["CollegeName"] = "";
    fields["UniversityName"] = "";
    fields["City"] = "";
    fields["State"] = "";
    fields["Country"] = "";*/
    this.setState({
      "sector"  :"",
      /*"Qualification"       :"",
      "activity"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",*/
      fields:fields
    });
    axios
    .post('https://jsonplaceholder.typicode.com/posts',{sectorValues})
    .then(function(response){
      console.log(response);
    })
    .catch(function(error){
      console.log(error);
    });
    console.log("academicValues =>",sectorValues);
    academicArray.push(sectorValues);
    console.log("add value",sectorValues);      
    alert("Data inserted Successfully!")
   // }

  
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
      NameofSector: "Natural Resource Management",
      }
      ]
      const columns = [ 
        {
        Header: 'Sr No',
        accessor: 'srno',
        },
        
        {
        Header: 'Name of Sector',
        accessor: 'NameofSector', 
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
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sector</span>
              </div>
              <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
              <div className="row">
                <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable">Name of Sector</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="Qualification" >
                      {/*<div className="input-group-addon inputIcon">
                        <i className="fa fa-graduation-cap fa"></i>
                      </div>*/}
                      <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="sector" name="sector" value={this.state.sector} onChange={this.handleChange.bind(this)} />
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
      </div>
    );

  }

}
export default Sector