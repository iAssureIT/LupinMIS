import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';

import 'react-table/react-table.css';
import "./ViewActivity.css";

class ViewActivity extends Component{
  
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
      "shown"               : true,
      "uID"                 :"",
      "Months"              :["January","February","March","April","May","June","July","August","September","October","November","December"],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {},
       "twoLevelHeader"              : {
        apply                     : true,
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
        month                      : "Month",
        sectorName                 : "Sector",
        activity                   : "Activity",
        subActivity                : "Sub-Activity",
        unit                       : "Unit",
        physicalUnit               : "Physical Unit",
        unitCost                   : "Unit Cost",
        totalBudget                : "Total Cost",
        noOfBeneficiaries          : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
/*        actions                     : 'Action',
*/      },
      "startRange"                  : 0,
      "limitRange"                  : 10,
      "editId"                      : this.props.match.params ? this.props.match.params.id : ''
    }
    
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
        var tableData = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});
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

  getData(startRange, limitRange){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});

      this.setState({
        tableData : tableData.slice(startRange, limitRange),
      });
    }).catch(function (error) {
      console.log('error', error);
    });
  }
 
  handleChange(event){
    event.preventDefault();
   /* this.setState({
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
    });*/
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
    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    toglehidden()
    {
     this.setState({
         shown: !this.state.shown
        });
    }

    changeTab = (data)=>{
      this.setState({
        tabtype : data,
      })
      console.log("tabtype",this.state.tabtype);
    }


    render() {
      var shown = {
        display: this.state.shown ? "block" : "none"
      };
      
      var hidden = {
        display: this.state.shown ? "none" : "block"
      }
      const data = [{
      srno: 1,
      FamilyID: "L000001",
      NameofBeneficiary: "Priyanka Lewade",
      BeneficiaryID: "PL0001",
      },{
      srno: 2,
      FamilyID: "B000001",
      NameofBeneficiary: "Priyanka Bhanvase",
      BeneficiaryID: "PB0001",
      }
      ]
      const columns = [ 
      {
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'SDG Goal',
        accessor: 'FamilyID', 
        }, {
        Header: 'Sector',
        accessor: 'NameofBeneficiary', 
        }, {
        Header: 'Activity',
        accessor: 'noMAp', 
        },{
        Header: 'Sub-Activity',
        accessor: 'noMAp', 
        },{
        Header: 'Quantity',
        accessor: 'noMAp', 
        },{
        Header: 'Amount',
        accessor: 'noMAp', 
        },{
        Header: 'Beneficiary',
        accessor: 'noMAp', 
        },{
        Header: "Financial Sharing",
        columns: [
        {
          Header: "LHWRF",
          accessor: "LHWRF"
        },
        {
          Header: "NABARD",
          accessor: "NABARD"
        },{
          Header: "Bank Loan",
          accessor: "BankLoan"
        },{
          Header: "Govt",
          accessor: "BankLoan"
        },{
          Header: "Direct Beneficiary",
          accessor: "BankLoan"
        },{
          Header: "Indirect Beneficiary",
          accessor: "BankLoan"
        },
        ]
        },
        {
        Header: 'Action',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-3">
              <div className="col-lg-6" onClick={() => this.deleteData(row.original)}>
            <i className="fa fa-trash"> </i>
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
               <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 row titleaddcontact">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Activity Reporting                                     
                   </div>
                  <hr className="hr-head container-fluid "/>
                </div>
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                  <h4>View of All Activity</h4>
                </div>
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                  <div className="row">  
                   <IAssureTable 
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      
                    />
                  </div>
                </form>
              </div>
            </section>
           </div>
        </div>
      </div>
    );
  }
}
export default ViewActivity