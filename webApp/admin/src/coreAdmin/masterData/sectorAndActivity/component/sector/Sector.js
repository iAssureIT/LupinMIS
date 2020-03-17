import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import {withRouter}           from 'react-router-dom';
// import _                      from 'underscore';
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";
import "./Sector.css";


class Sector extends Component{
  constructor(props){
    super(props);
    this.state = {
      "sector"              :"",
      "user_ID"             :"",
      "sector_id"           :"",
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        sector              : "Sector",
        sectorShortName     : "Sector Abbreviation",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/sectors/delete/',
        editUrl             : '/sector-and-activity/',
        paginationApply     : false,
        searchApply         : false,
      },
      "dataCount"           : 0,
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.sectorId : '',
      "role"                : localStorage.getItem("role")
    }
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
     [event.target.name]: event.target.value
    });
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

  SubmitSector(event){
    event.preventDefault();
    if($("#sectorDetails").valid()){
    var sectorValues= {
    "sector"               :this.refs.sector.value,
    "sectorShortName"      :this.refs.sectorShortName.value,
    "user_ID"              :this.state.user_ID,
    };
    axios.post('/api/sectors',sectorValues)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    
      this.setState({
        "sectorShortName"   :"",
        "sector"            :"",
      });
    }
  }

  updateSector(event){
    event.preventDefault();
    if($("#sectorDetails").valid()){
      var sectorValues= {
        "sector_ID"            :this.state.editId,
        "sector"               :this.refs.sector.value,
        "sectorShortName"      :this.refs.sectorShortName.value,
        "user_ID"              :this.state.user_ID,
      };

     
      axios.patch('/api/sectors/update',sectorValues, this.state.editId)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.setState({
            editId : ''
          })
          this.props.history.push('/sector-and-activity');
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      
      this.setState({
        "sector"           :"",
        "sectorShortName"  :"",
      });
    }    
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.sectorId;
      if(nextProps.match.params.sectorId){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);

        })
      }
      this.getLength();
    }
  }
 
  componentDidMount(){
  axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    $.validator.addMethod("regxsector", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Sector.");
    $.validator.addMethod("regxsectorShortName", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Sector Abbreviation.");
    $("#sectorDetails").validate({
      rules: {
        sector: {
          required: true,
          // regxsector: /^[A-za-z']+( [A-Za-z']+)*$/,
          regxsector:/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*( [a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
        },
        sectorShortName: {
          regxsectorShortName:/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*( [a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "sector"){
          error.insertAfter("#sectorError");
        }
        if (element.attr("name") == "sectorShortName"){
          error.insertAfter("#sectorShortNameErr");
        }
      }
    });
    var editId = this.props.match.params.sectorId;
    if(editId){     
      this.edit(editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/sectors/'+id,
    }).then((response)=> {
      var editData = response.data[0];     
      this.setState({
        "sector"                :editData.sector,
        "sectorShortName"       :editData.sectorShortName,
      },()=>{
       
      });
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    }).catch(function (error) {
        console.log("error = ",error);
      });
  }
 
  getData(startRange, limitRange){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.post('/api/sectors/list',data)
    .then((response)=>{
      
      var tableData = response.data.map((a, i)=>{
          return {
            _id               : a._id,
            sector            : a.sector,
            sectorShortName   : a.sectorShortName,
          }
        })
      this.setState({
        tableData : tableData
      });
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getLength(){
    axios.get('/api/sectors/count')
    .then((response)=>{
      this.setState({
        dataCount : response.data.dataLength
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  componentWillMount(){
    this.getLength();
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  componentWillUnmount(){
    this.setState({
      "sectorShortName" :"",
      "sector" :"",
      "editId" : ""
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            {this.state.role !== "viewer" ? 
            <React.Fragment>
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="sectorDetails">
                  <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 addLoc ">
                    <span className="subHeader"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sector</span>
                  </div>
                  <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                  <div className="row">
                    <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                      <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">
                        <label className="formLable">Sector</label><span className="asterix">*</span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="sectorError" >
                          <input type="text" className="form-control inputBox"  placeholder=""ref="sector" name="sector" value={this.state.sector}  onChange={this.handleChange.bind(this)} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">
                        <label className="formLable">Sector Abbreviation</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="sectorShortNameErr" >
                          <input type="text" className="form-control inputBox"  placeholder="" ref="sectorShortName" name="sectorShortName" value={this.state.sectorShortName} onChange={this.handleChange.bind(this)} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                        {
                          this.state.editId ?
                          <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.updateSector.bind(this)}> Update</button>
                          :
                          <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.SubmitSector.bind(this)}> Submit</button>
                        }
                      </div>
                    </div>
                  </div><br/>
                </form>   
                <div className="col-lg-12 ">
                   <hr className=""/>
                </div>
            </React.Fragment>
            : null}

            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 mt">
              <IAssureTable
                tableName = "Sector"
                id = "Sector"
                tableHeading={this.state.tableHeading}
                dataCount={this.state.dataCount}
                tableData={this.state.tableData}
                getData={this.getData.bind(this)}
                tableObjects={this.state.tableObjects}
              />
            </div>             
          </div>
        </div>
      </div>
    );

  }

}
export default withRouter(Sector);

