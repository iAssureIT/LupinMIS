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
import "./Highlight.css";

class Highlight extends Component{

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
      "shown"             : true,
      "userName"          :"",
      "highlight_Image"   :"",
      "highlight_File"    :"",
      imgArrayWSaws       : [],
      fileArrayEmpty      : [],
      fileArray           : [],
      imageArray          : [],
      fields              : {},
      errors              : {},
      "tableObjects"       : {
        deleteMethod        : 'delete',
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
        apiLink         : '/api/highlight/delete/',
        pageURL         : '/highlight',
      }, 
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
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
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
    });
  
  }
  Submit(event){
    event.preventDefault();
      if($('#highlight').valid()){
        var highlightValues = {
          "center_ID"        :this.state.center_ID,
          "centerName"       :this.state.centerName,
          "date"             :this.refs.dateofsubmission.value,
          "userName"         :this.refs.userName.value, 
          "highlight_Image"  :this.state.imageArray,
          "highlight_File"   :this.state.fileArray,
        };     
        axios.post('/api/highlights', highlightValues)
          .then((response)=>{
           console.log('response', response);
            this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.setState({
              "dateofsubmission"  : moment(new Date()).format('YYYY-MM'),
              "userName"          :"",
              "action"            :"Submit",
              "caseStudy_Image"   :"",
              "caseStudy_File"    :"",
              "imageArray"        : [],
              "fileArray"         : [],
              "shown"               : true,
            });
          })
          .catch(function(error){
            console.log("error = ",error);
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
        "highlight_Image"  :this.state.imageArray,
        "highlight_File"   :this.state.fileArray,
      };
      axios.patch('/api/highlights/update', highlightValues)
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
        "dateofsubmission"     : moment(new Date()).format('YYYY-MM'),
        "userName"             : "",
        "imageArray"           : [],
        "fileArray"            : [],
        "shown"                : true,
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
      console.log("editDataresponse",response);
      console.log("editData",editData);
      this.setState({
        "dateofsubmission"  : editData.date,
        "userName"          : editData.userName,
        "imageArray"        : editData.highlight_Image,
        "fileArray"         : editData.highlight_File,
        "shown"             : false,
      });
    })
    .catch(function(error){
      console.log("error = ",error);
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
        var tableData = response.data.map((a, i)=>{
          return {
            _id             : a._id,
            date             : moment(a.date).format('MMMM YYYY'),
            userName        : a.userName,
            highlight_Image : a.highlight_Image,
            highlight_File  : a.highlight_File,
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
    this.setState({
      "fileArray"   : fileArray,
      "filenames"   : filenames,
      "imageArray"  : imageArray,
    },()=>{
    })
  }

  toglehidden(){   
    this.setState({
     shown: !this.state.shown
    });
  }  

  render() {   
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }  
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
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-right">
                      <button type="button" className="btn addBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.toglehidden.bind(this)}>Add Highlights</button>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt outerForm" id="highlight"  style={hidden}>
                        <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12  valid_box">
                          <label className="formLable">Date of Submission</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofsubmission" >
                            <input type="month" className="form-control inputBox toUpper" name="dateofsubmission" ref="dateofsubmission" value={this.state.dateofsubmission} onChange={this.handleChange.bind(this)}/>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">User Name</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="userName" >
                            <input type="text" className="form-control inputBox " ref="userName" name="userName" value={this.state.userName} onChange={this.handleChange.bind(this)} />
                          </div>
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
                        <br/>
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
                    </div>
                  </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        {
                          this.state.tableData && this.state.tableData.length >0 ?
                          this.state.tableData.map((data, index)=>{
                            console.log(data);
                            return(
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt outerForm">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noPadding"> 
                                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                      <div className="formLable"><span className="pageSubHeader">{data.date  ? data.date : "-"}</span></div>
                                      
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                      <h4 className="formLable">User Name : {data.userName ? data.userName : "-"}</h4>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noPadding"> 
                                  {
                                    data.highlight_File.length > 0? 
                                    data.highlight_File.map((file, i)=> {
                                      return(
                                        <div key= {i} className="col-lg-6 col-md-12 col-sm-12 col-xs-12"> 
                                          <div >
                                            {
                                              (file && file.fileName.split('.').pop()==="XLS" || file.fileName.split('.').pop() ==="XLSX"||file.fileName.split('.').pop() ==="xls" || file.fileName.split('.').pop() ==="xlsx")
                                              ?
                                              <a href={file.filePath} classname="mt"><img className="fileExt" src="/images/exel2.png"/> </a>
                                              :
                                               ""
                                            }
                                            {
                                              (file && file.fileName.split('.').pop() ==="PPT" || file.fileName.split('.').pop() === "PPTX" || file.fileName.split('.').pop() === "ppt" || file.fileName.split('.').pop() ==="pptx")
                                              ? 
                                              <a href={file.filePath} classname="mt"><img className="fileExt" src="/images/powerpoint.jpeg"/></a> 
                                              :""
                                            }
                                            {
                                              (file && file.fileName.split('.').pop() ==="pdf" ||file.fileName.split('.').pop() === "PDF")
                                              ? 
                                              <a href={file.filePath} classname="mt"><img className="fileExt" src="/images/pdf.png"/> </a>
                                              :
                                              ""
                                            }
                                            {
                                              (file && file.fileName.split('.').pop() ==="doc" || file.fileName.split('.').pop() === "docx" || file.fileName.split('.').pop() === "DOC" || file.fileName.split('.').pop() ==="DOCX"|| file.fileName.split('.').pop() ==="txt" || file.fileName.split('.').pop() === "TXT") 
                                              ? 
                                              <a href={file.filePath} classname="mt"><img className="fileExt" src="/images/docs.png"/> </a>
                                              : ""
                                            }                                             
                                          </div>
                                          <a href={file.filePath} classname="mt">
                                              <p className="formLable"><b>{file.fileName}</b></p>
                                          </a>
                                          
                                        </div>
                                        )
                                    })
                                    : 
                                    null
                                  }
                                </div>
                                <a class="viewLink" href={"/highlightView/"+data._id}>
                                    <i class='fas fa fa-chevron-right viewLinkIcon  fa-2x fa-pull-right'></i>
                                </a>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"><b>Images</b></p>
                                  {
                                    data.highlight_Image.length > 0? 
                                    data.highlight_Image.map((img, i)=> {
                                      return(
                                        <div key= {i} className="col-lg-3 col-md-12 col-sm-12 col-xs-12 noPadding"> 
                                            <img className="caseStudy_Image col-lg-12 col-md-12 col-xs-12 col-sm-12" alt="caseStudy" src={img.imgPath} />
                                        </div>
                                        )
                                    })
                                    : 
                                    null
                                  }
                                </div>
                              </div>
                            )
                          })
                          :
                          null
                        }
                      </div>
                    </div>
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
export default Highlight