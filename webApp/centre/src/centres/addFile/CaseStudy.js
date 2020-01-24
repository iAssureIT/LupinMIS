import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import AddFilePublic          from "../addFile/AddFilePublic.js";

import 'react-table/react-table.css';
// import "./CaseStudy.css";

class CaseStudy extends Component{

  constructor(props){
    super(props);
    this.state = {
      "center_ID"         :"",
      "centerName"        :"",
      "title"             :"",
      "dateofsubmission"  :"",
      "sector"            :"-- Select --",
      "config"            :"",
      "author"            :"",
      "caseStudy_Image"   :"",
      "caseStudy_File"    :"",
      imgArrayWSaws       : [],
      fileArrayEmpty      : [],
      fileArray           : [],
      imageArray          : [],
      fields              : {},
      errors              : {},
      "tableObjects"       : {
        deleteMethod        : 'delete',
        apiLink             : '/api/caseStudies/',
        editUrl             : '/caseStudy/',      
        paginationApply     : false,
        searchApply         : false,
      },
      "tableHeading"    : {
        date              : "Date of Submission",
        title             : "Title of Case Study",
        sectorName        : "Sector",
        author            : "Author of Case Study",
        actions           : 'Action',
      },            
      "configData" : {
        dirName         : 'caseStudy',
        deleteMethod    : 'delete',
        apiLink         : '/api/caseStudies/delete/',
        pageURL         : '/caseStudyy',
      },
      // "fileType"          : 'Image',
      "startRange"        : 0,
      "limitRange"        : 10000,
      "editId"            : this.props.match.params ? this.props.match.params.id : '',
    }
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
    $.validator.addMethod("regxTitle", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Title.");
    $.validator.addMethod("regxAuthor", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Author.");


    $("#caseStudy").validate({
      rules: {
        title: {
          required: true,
          regxTitle:/^[A-za-z']+( [A-Za-z']+)*$/,
        },  
        author: {
          required: true,
          regxAuthor:/^[A-za-z']+( [A-Za-z']+)*$/,

        },
        dateofsubmission: {
          required: true,
        },
        sector: {
          required: true,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "title"){
          error.insertAfter("#title");
        }
        if (element.attr("name") == "author"){
          error.insertAfter("#author");
        }
        if (element.attr("name") == "dateofsubmission"){
          error.insertAfter("#dateofsubmission");
        }
        if (element.attr("name") == "sector"){
          error.insertAfter("#sector");
        }
      }
    });
    // console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getAvailableSectors();
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("fileArray ===============================",localStorage.getItem('fileArray'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID       : center_ID,
      centerName      : centerName,
   
    },()=>{
      // console.log("fileArray =",this.state.fileArray);
    this.getLength(this.state.center_ID);
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    });
    var momentString =  moment(new Date()).format('YYYY-MM-DD');

    this.setState({
      dateofsubmission :momentString,
    })
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
        [event.target.name]: event.target.value,
        "dateofsubmission" :this.refs.dateofsubmission.value,
        // "sectorName"       :this.refs.sector.value, 
        "sector"          : this.refs.sector.value.split('|')[0],
        "title"            :this.refs.title.value, 
        "author"           :this.refs.author.value, 
       /* "caseStudy_Image"  :this.refs.caseStudy_Image.value,
        "caseStudy_File"   :this.refs.caseStudy_File.value,*/
    });
   
  }

  Submit(event){
    
    event.preventDefault();
    if($('#caseStudy').valid()){
      var caseStudyValues = {
        "center_ID"        :this.state.center_ID,
        "date"             :this.refs.dateofsubmission.value,
        "sector_ID"        :this.refs.sector.value.split('|')[1],
        "sectorName"       :this.refs.sector.value.split('|')[0],
        "title"            :this.refs.title.value, 
        "author"           :this.refs.author.value, 
        "caseStudy_Image"  :this.state.imageArray,
        "caseStudy_File"   :this.state.fileArray,
       
      };

      axios.post('/api/caseStudies', caseStudyValues)
        .then((response)=>{
          console.log('response', response);
          this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.setState({
            "title"             :"",
            "dateofsubmission"  :moment(new Date()).format('YYYY-MM-DD'),
            "sector"            :"",
            "author"            :"",
            "action"            :"Submit",
            "caseStudy_Image"   :"",
            "caseStudy_File"    :"",
            "imageArray"        : [],
            "fileArray"         : []
          });
        })
        .catch(function(error){
          console.log("error = ",error);
    });
 
    }
  }

  Update(event){
    event.preventDefault();
    if($('#caseStudy').valid()){
      var caseStudyValues = {
        "caseStudy_ID"     :this.state.editId, 
        "center_ID"        :this.state.center_ID,
        "date"             :this.refs.dateofsubmission.value,
        "title"            :this.refs.title.value, 
        "sector_ID"        :this.refs.sector.value.split('|')[1],
        "sectorName"       :this.refs.sector.value.split('|')[0],
        "author"           :this.refs.author.value, 
        "caseStudy_Image"  :this.state.imageArray,
        "caseStudy_File"   :this.state.fileArray,
      };

      axios.patch('/api/caseStudies/update', caseStudyValues)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        })
        .catch(function(error){
          console.log("error = ",error);
    });
      this.setState({
        "dateofsubmission"     :"",
        "title"                :"",
        "sector"               :"-- Select --",
        "author"               :"",
        "imageArray"           :[],
        "fileArray"            :[],
      });
      this.props.history.push('/caseStudy');
      this.setState({
        "editId"               : "",
      });
    }     
  }


  edit(id){
    axios({
      method: 'get',
      url: '/api/caseStudies/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log("editData",editData);
      this.setState({
        "dateofsubmission"  : editData.date,
        "title"             : editData.title, 
        "sector"            : editData.sectorName,
        "sector_ID"         : editData.sector_ID,
        "author"            : editData.author,
        "imageArray"        : editData.caseStudy_Image,
        "fileArray"         : editData.caseStudy_File,
      });
     
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }

  getLength(center_ID){
/*    axios.get('/api/caseStudies/count/'+center_ID)
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });*/
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
        console.log("error = ",error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      sector_ID          : sector_ID,
      subActivityDetails : ""
    })
    this.handleChange(event);
  }

  getData(startRange, limitRange, center_ID){ 
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    if(center_ID){
      axios.get('/api/caseStudies/list/'+center_ID)
      .then((response)=>{
        console.log("response",response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id          : a._id,
            date         : moment(a.date).format('DD-MM-YYYY'),
            title        : a.title,
            sectorName   : a.sectorName,
            author       : a.author,
          }
        })
        this.setState({
          tableData : tableData
        })
      })
      .catch(function(error){      
        console.log("error = ",error);
      });
    }
  }
    getFile(fileArray, filenames,imageArray){
     console.log("fileArray",fileArray ,"filenames",filenames,"imageArray",imageArray)
    this.setState({
      "fileArray"   : fileArray,
      "filenames"   : filenames,
      "imageArray"  : imageArray,
    },()=>{

    })
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
                      Case Study
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="caseStudy">
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12  valid_box">
                          <label className="formLable">Date of Submission</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofsubmission" >
                            <input type="date" className="form-control inputBox toUpper" name="dateofsubmission" ref="dateofsubmission" value={this.state.dateofsubmission} onChange={this.handleChange.bind(this)}/>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Title</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="title" >
                            <input type="text" className="form-control inputBox " ref="title" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.title}</div>
                        </div>
                        <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                          <label className="formLable">Sector </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)} >
                              <option disabled="disabled" selected="true" >-- Select --</option>
                              {
                                this.state.availableSectors && this.state.availableSectors.length >0 ?
                                this.state.availableSectors.map((data, index)=>{
                                  return(
                                    <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                        </div>
                       {/* <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Sector</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="sectorName" >
                            <input type="text" className="form-control inputBox " ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.sectorName}</div>
                        </div>*/}
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Author</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="author" >
                            <input type="text" className="form-control inputBox " ref="author" name="author" value={this.state.author} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.author}</div>
                        </div>
                      </div><br/>
                      <AddFilePublic
                        getFile    = {this.getFile.bind(this)}
                        configData = {this.state.configData} 
                        fileArray  = {this.state.fileArray} 
                        imageArray = {this.state.imageArray} 
                        fileType   = "Image" 

                      />   
                      <hr/>
   
                      <AddFilePublic
                        getFile    = {this.getFile.bind(this)}
                        configData = {this.state.configData} 
                        fileArray  = {this.state.fileArray} 
                        imageArray = {this.state.imageArray} 
                        fileType   = "File"
                      />
                      {/*
                        this.state.action == "Submit" ?
                          <AddFilePublic
                            getFile    = {this.getFile.bind(this)}
                            configData = {this.state.configData} 
                            action     = {this.state.action}
                            fileArray  = {this.state.fileArray} 
                            fileType   = "File"
                          />       
                          :
                          null              
                          
                      */}
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
                        viewTable = {true}
                        viewLink = "caseStudyView"
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
export default CaseStudy