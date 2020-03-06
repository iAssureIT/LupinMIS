import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";

class FilewiseBeneficiaryActivityList extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
       tableHeading:{
            "fileName"     : "File Name",
            "count"        : "Activity Count",
            "actions"      : "Action"
          },
          "tableObjects"              : {
              deleteMethod              : 'delete',
              apiLink                   : '/api/activityReport/file/deleteBeneficiariesInActivity/',
              paginationApply           : false,
              searchApply               : false,
            },
          startRange : 0,
          limitRange : 10
    }
    
  }
  componentDidMount(){
    this.getCount();
  }
  getData(startRange, limitRange){
      var data = {
        startRange : this.state.startRange,
        limitRange : this.state.limitRange,
        center_ID  : localStorage.getItem('center_ID')
      }
      axios.post('/api/activityReport/get/beneficiaryfiles', data)
      .then((response)=>{
        console.log(response.data);
        var tableData = response.data.map((a, i)=>{
          return {
            fileName: a._id != null ? a._id : "-", 
            count: a.count != NaN ? "<p>"+a.count+"</p>" : "a", 
            _id: a._id != null ? a._id : "-", 
          }
        })
        this.setState({
          tableData : tableData
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    getCount(){
      axios.get('/api/activityReport/get/beneficiaryFiles/count/'+localStorage.getItem('center_ID'))
      .then((response)=>{
        console.log(response.data)
        this.setState({
          dataCount : response.data
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
             <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-10 col-lg-offset-1  col-md-10 col-md-offset-1 col-xs-12 col-sm-12 actDetails">
                        <h5>Filewise Details</h5>
                        <IAssureTable 
                            tableHeading={this.state.tableHeading}
                            twoLevelHeader={this.state.twoLevelHeader} 
                            dataCount={this.state.dataCount}
                            tableData={this.state.tableData}
                            getData={this.getData.bind(this)}
                            tableObjects={this.state.tableObjects}
                          />
                      </div>
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
export default FilewiseBeneficiaryActivityList