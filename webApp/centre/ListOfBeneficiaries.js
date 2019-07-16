import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';

import 'react-table/react-table.css';
import "./NewBeneficiary.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';


class ListOfBeneficiaries extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      
      "uID"                 :"",
      "shown"                 : true,
      fields: {},
      errors: {},
     "twoLevelHeader"              : {
        apply                     : false,
        firstHeaderData           : [
                                      {
                                          heading : '',
                                          mergedColoums : 10
                                      },
                                      {
                                          heading : 'Source of Fund',
                                          mergedColoums : 7
                                      },
                                   /*   {
                                          heading : 'MIS Coordinator',
                                          mergedColoums : 3
                                      },*/
                                    ]
      },
      "tableHeading"                : {
        familyID                    : "Family ID",
        beneficariesId              : "Beneficiary ID",
        nameofbeneficaries          : "Name of Beneficiary",
        actions                     : 'Action',
      },
      "startRange"                  : 0,
      "limitRange"                  : 10,
      "editId"                      : "",/*this.props.match.params ? this.props.match.params.id : ''*/
    }
      
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
     /* "QualificationLevel"   : this.refs.QualificationLevel.value,          
      "Qualification"        : this.refs.Qualification.value,          
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
    /*var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
    }*/
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
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
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
        swal({
          title : response.data.message,
          text  : response.data.message,
        });
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
  getData(startRange, limitRange){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return});

      this.setState({
        tableData : tableData.slice(startRange, limitRange),
      });
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  
  componentDidMount() {
    if(this.state.editId){      
      this.edit(this.state.editId);
    }

    var data = {
      limitRange : 0,
      startRange : 1,
    }
  
      axios({
        method: 'get',
        url: '/api/centers/list',
      }).then((response)=> {
        var tableData = response.data.map((a, index)=>{return});
        this.setState({
          dataCount : tableData.length,
          tableData : tableData.slice(this.state.startRange, this.state.limitRange),
          editUrl   : this.props.match.params
        },()=>{
          
        });
      }).catch(function (error) {
        console.log('error', error);
      });
    }
    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    render() {
    return (
      <di`v className="container-fluid">
        <div className="row">
          <div className="formWrapper">    
            <div className="col-lg-12 col-sm-12 col-xs-12" >
              <div className="row">
                <h4 className="pageSubHeader col-lg-6 col-sm-6 col-xs-6 ">List of Beneficiaries</h4>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                  <div className="row">  
                    <IAssureTable 
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}                      
                    />
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
export default ListOfBeneficiaries