import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import IAssureTable           from "../../../centres/IAssureTableFilewise/IAssureTable.js";
import "./Family.css";

class FilewiseFamilyList extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
       tableHeading:{
            "fileName"     : "File Name",
            "uploadTime"   : "Uploaded At",
            "count"        : "Family Count",
            "actions"      : "Action"
          },
          "tableObjects"              : {
              deleteMethod              : 'delete',
              apiLink                   : '/api/families/file/delete/',
              paginationApply           : false,
              searchApply               : false,
            },
            dataCount:0,
          startRange : 0,
          limitRange : 100000
    }
    
  }
  componentDidMount(){
    this.getCount();
  }
  getCount(){
      axios.get('/api/families/get/files/count/'+localStorage.getItem('center_ID'))
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
  getData(startRange,limitRange){
    
      var data = {
        startRange : startRange,
        limitRange : limitRange,
        center_ID  : localStorage.getItem('center_ID')
      }
      console.log('tableData', data)
      axios.post('/api/families/get/files', data)
      .then((response)=>{
        //console.log(response.data);
        var tableData = response.data.map((a, i)=>{
          return {
            fileName    : a.fileName != null ? a.fileName : "Manual", 
            uploadTime  : a.uploadTime != null ? moment(a.uploadTime).format('MMMM Do YYYY, h:mm:ss a') : "-", 
            count       : a.count != NaN ? "<p>"+a.count+"</p>" : "a", 
            _id         : a.fileName+ "/" + a.uploadTime, 
          }
        })
        console.log('tableData', tableData)
        this.setState({
          tableData : tableData
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    
  render() {
    return (
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="formWrapper"> 
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                      Filewise Family Details
                    </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12">
                    <IAssureTable 
                        id="FilewiseFamilyList"
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default FilewiseFamilyList