import React, { Component }   from 'react';
import "./ListOfBeneficiaries.css";

import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import NewBeneficiary         from "../addBeneficiary/NewBeneficiary.js";

class ListOfBeneficiaries extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "uID"                       :"",
      "shown"                     : true,
      "twoLevelHeader"             : {
        apply                      : false,
      },
      "tableHeading"                : {
        beneficiaryID               : "Beneficiary ID",
        familyID                    : "Family ID",
        nameofbeneficiary           : "Beneficiary Name",
        relation                    : "Relation with Family Head",
        dist                        : "District",
        block                       : "Block",
        village                     : "Village",
        isUpgraded                  : "Upgraded",
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
      [event.target.name] : event.target.value,
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps){
      this.setState({
        selectedValues : nextProps.selectedValues,
        sendBeneficiary: nextProps.sendBeneficiary,
        tableData      : nextProps.sendBeneficiary,
        selectedBeneficiaries: (this.props.sendBeneficiary).length,
      },()=>{
        // if(this.state.selectedValues){
        //   this.setState({
        //     tableData : []
        //   })sendBeneficiary
        // }
      })
    }
  }
  listofBeneficiaries(selectedBeneficiaries){
    console.log(selectedBeneficiaries)
    var tableData = selectedBeneficiaries.map((a, i)=>{
      return {
        _id                       : a._id,
        beneficiary_ID            : a.beneficiary_ID,
        beneficiaryID             : a.beneficiaryID,
        family_ID                 : a.family_ID,
        familyID                  : a.familyID,
        nameofbeneficiary         : a.nameofbeneficiary,
        relation                  : a.relation,
        dist                      : a.dist,
        block                     : a.block,
        village                   : a.village,
        upgraded                  : a.isUpgraded,
      }
    })
    this.setState({
      tableData : tableData,
      // selectedBeneficiaries : selectedBeneficiaries.length
    },()=>{
      console.log("tableData",this.state.tableData)
    })
    this.props.getBeneficiaries(selectedBeneficiaries);
  }
  getData(){
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">    
            <div className="col-lg-12 col-sm-12 col-xs-12" >
              <div className="row">
                <NewBeneficiary 
                  listofBeneficiaries={this.listofBeneficiaries.bind(this)} 
                  selectedValues={this.state.selectedValues} 
                  sendBeneficiary={this.state.sendBeneficiary}
                  selectedBeneficiaries={this.state.selectedBeneficiaries}
                />
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  formLable " >
                  <div className="row">  
                    <div className="formLable col-lg-12 col-sm-12 col-xs-12">  
                      <b>No. of Beneficiaries : {this.state.selectedBeneficiaries ? this.state.selectedBeneficiaries : 0}</b>
                    </div>

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