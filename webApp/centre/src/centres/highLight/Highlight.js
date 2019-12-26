import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import moment                 from "moment";
import AddFilePublic          from "../addFile/AddFilePublic.js";
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';
import "./Highlight.css";

class Highlight extends Component{

  constructor(props){
    super(props);
    this.state = {
      "center_ID"         :"",
      "centerName"        :"",
      "dateofsubmission"  :"",
      "config"            :"",
      "userName"            :"",
      "highlight_Image"   :"",
      "highlight_File"    :"",
      imgArrayWSaws       : [],
      fileArray           : [],
      fields              : {},
      errors              : {},
      "tableObjects"       : {
        apiLink             : '/api/highlights/',
        editUrl             : '/highlight/',      
        paginationApply     : false,
        searchApply         : false,
      },
      "tableHeading"    : {
        date              : "Date",
        userName          : "User Name",
        actions           : 'Action',
      },                     
      "configData" : {
        dirName         : 'Highlight',
        deleteMethod    : 'delete',
        apiLink         : '/api/caseStudies/delete/',
        pageURL         : '/caseStudyy',
      }, 
      "startRange"        : 0,
      "limitRange"        : 10000,
      "editId"            : this.props.match.params ? this.props.match.params.id : '',
    }
    // console.log('editId' , this.state.editId);
  }
  
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    // console.log('editId' , editId);
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);
      })
    if(nextProps){
      this.getLength();
    }      
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    }
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    $.validator.addMethod("regxuserName", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Username.");
  

    $("#highlight").validate({
      rules: {
        userName: {
          required: true,
          regxuserName:/^[A-za-z']+( [A-Za-z']+)*$/,
        },  
        dateofsubmission: {
          required: true,
        },  

     
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "userName"){
          error.insertAfter("#userName");
        }
        if (element.attr("name") == "dateofsubmission"){
          error.insertAfter("#dateofsubmission");
        }
       
     
      }
    });
    // console.log('editId componentDidMount', this.state.editId);
   
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var fileLocation = JSON.parse(localStorage.getItem('fileLocation'));
    var ImageLocation = JSON.parse(localStorage.getItem('ImageLocation'));
    // console.log("fileLocation ===============================",fileLocation);
    // console.log("ImageLocation ===============================",ImageLocation);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
      fileLocation : fileLocation,
      ImageLocation   : ImageLocation,
    },()=>{
      console.log("center_ID =",this.state.center_ID);
      this.getLength(this.state.center_ID);
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    });

    var momentString =  moment(new Date()).format('YYYY-MM'); 
    this.setState({
      dateofsubmission :momentString,
    })
  }
  
  handleChange(event){
    event.preventDefault();
    this.setState({
        [event.target.name]: event.target.value,
        "dateofsubmission" :this.refs.dateofsubmission.value,
        "userName"         :this.refs.userName.value, 
       /* "highlight_Image"  :this.refs.highlight_Image.value,
        "highlight_File"   :this.refs.highlight_File.value,*/
    });
  
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

  isTextKey(evt){
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

  Submit(event){
    // var fileLocation = JSON.parse(localStorage.getItem('fileLocation'));
    // var ImageLocation = JSON.parse(localStorage.getItem('ImageLocation'));
    // console.log("fileLocation ===============================",fileLocation);
    // console.log("ImageLocation ===============================",ImageLocation);
    event.preventDefault();
    if($('#highlight').valid()){
      var highlightValues = {
        "center_ID"        :this.state.center_ID,
        "centerName"       :this.state.centerName,
        "date"             :this.refs.dateofsubmission.value,
        "userName"         :this.refs.userName.value, 
        "highlight_Image"  :this.state.ImageLocation,
        "highlight_File"   :this.state.fileLocation,
      };
     
      axios.post('/api/highlights', highlightValues)
        .then((response)=>{
        // console.log('response', response);
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
        "dateofsubmission"  : moment(new Date()).format('YYYY-MM'),
        "userName"          :"",
        "ImageLocation"     :"",
        "fileLocation"      :"",
      });
    }
  }

  Update(event){
    event.preventDefault();
    if($('#highlight').valid()){
      var highlightValues = {
        "highlight_ID"     :this.state.editId, 
        "center_ID"        :this.state.center_ID,
        "centerName"       :this.state.centerName,
        "date"             :this.refs.dateofsubmission.value,
        "userName"         :this.refs.userName.value, 
      /*  "highlight_Image"  :this.refs.highlight_Image.value,
        "highlight_File"   :this.refs.highlight_File.value,*/
      };

      console.log('highlightValues', highlightValues);

      axios.patch('/api/highlights/update', highlightValues)
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
        "dateofsubmission"     : moment(new Date()).format('YYYY-MM'),
        "userName"             :"",
        "highlight_Image"      :"",
        "highlight_File"       :"",
      });
      this.props.history.push('/highlight');
      this.setState({
        "editId"               : "",
      });
    }
  }

  
  edit(id){
    axios({
      method: 'get',
      url: '/api/highlights/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log("editData",editData);
      this.setState({
        "dateofsubmission"  : editData.date,
        "userName"          : editData.userName,
      });
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }

  getLength(center_ID){
    axios.get('/api/highlights/count/'+center_ID)
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });
  }

  getData(startRange, limitRange, center_ID){ 
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    if(center_ID){
      axios.get('/api/highlights/list/'+center_ID, data)
      .then((response)=>{
        // console.log('response', response);
        this.setState({
          tableData : response.data
        })
      })
    .catch(function(error){
      console.log("error = ",error);
    });
    }
  }

  render() {     
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Highlights
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="highlight">
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12  valid_box">
                          <label className="formLable">Date of Submission</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofsubmission" >
                            <input type="month" className="form-control inputBox toUpper" name="dateofsubmission" ref="dateofsubmission" value={this.state.dateofsubmission} onChange={this.handleChange.bind(this)}/>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">User Name</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="userName" >
                            <input type="text" className="form-control inputBox " ref="userName" name="userName" value={this.state.userName} onChange={this.handleChange.bind(this)} />
                          </div>
                        </div>
                      </div><br/>
                      <AddFilePublic
                        configData = {this.state.configData} 
                        fileArray  = {this.state.fileArray} 
                        fileType   = "Image" 

                      />      
                      <AddFilePublic
                        configData = {this.state.configData} 
                        fileArray  = {this.state.fileArray} 
                        fileType   = "File"

                      />      

                        
               
                    </div><br/>
                    <div className="col-lg-12">
                      <br/>
                      {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit  pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit pull-right" onClick={this.Submit.bind(this)}> Submit </button>
                        }
                    </div>
                  </form>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
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
            </section>
          </div>
        </div>
      </div>
    );

  }

}
export default Highlight