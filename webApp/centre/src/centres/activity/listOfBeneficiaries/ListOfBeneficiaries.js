import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';

import 'react-table/react-table.css';
import "./ListOfBeneficiaries.css";
import NewBeneficiary from "../addBeneficiary/NewBeneficiary.js";

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
      "twoLevelHeader"             : {
        apply                     : false,
      },
      "tableHeading"                : {
        beneficiaryID               : "Beneficiary ID",
        familyID                    : "Family ID",
        nameofbeneficiary           : "Name of Beneficiary",
        relation                    : "Relation with Family Head",
        dist                        : "District",
        block                       : "Block",
        village                     : "Village",
        // actions                     : 'Action',
      },
      "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
      },   
      "startRange"                  : 0,
      "limitRange"                  : 10000,
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
      [event.target.name] : event.target.value,
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
    if(nextProps){
      this.setState({
        selectedValues : nextProps.selectedValues,
        sendBeneficiary: nextProps.sendBeneficiary,
        tableData      : nextProps.sendBeneficiary
      },()=>{
        if(this.state.selectedValues){
          this.setState({
            tableData : []
          })
        }
      })
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
  isTextKey(evt) {
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

  getData(startRange, limitRange){
    // axios({
    //   method: 'get',
    //   url: '/api/centers/list',
    // }).then((response)=> {
    //   var tableData = response.data.map((a, index)=>{return});

    //   this.setState({
    //     tableData : tableData.slice(startRange, limitRange),
    //   });
    // }).catch(function (error) {
    //   console.log('error', error);
    // });
  }
  listofBeneficiaries(selectedBeneficiaries){
    var tableData = selectedBeneficiaries.map((a, i)=>{
        return {
          _id                       : a._id,
          beneficiaryID             : a.beneficiaryID,
          familyID                  : a.familyID,
          family_ID                 : a.family_ID,
          nameofbeneficiary         : a.nameofbeneficiary,
          relation                  : a.relation,
        }
      })
      this.setState({
        tableData : tableData
      },()=>{
        console.log("tableData",this.state.tableData)
      })

    // console.log(selectedBeneficiaries)
    // this.setState({
    //   tableData : selectedBeneficiaries
    // })
    this.props.getBeneficiaries(selectedBeneficiaries);
  }
    render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">    
            <div className="col-lg-12 col-sm-12 col-xs-12" >
              <div className="row">
                <NewBeneficiary listofBeneficiaries={this.listofBeneficiaries.bind(this)} selectedValues={this.state.selectedValues} sendBeneficiary={this.state.sendBeneficiary}/>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  formLable " >
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