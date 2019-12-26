import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';
import "./CaseStudy.css";


class CaseStudy extends Component{

  constructor(props){
    super(props);
    this.state = {
      "center_ID"         :"",
      "centerName"        :"",
      "title"             :"",
      "dateofsubmission"  :"",
      "sectorName"        :"",
      "config"            :"",
      "author"            :"",
      "caseStudy_Image"   :"",
      "caseStudy_File"    :"",
      imgArrayWSaws       : [],
      fileArray           : [],
      fields              : {},
      errors              : {},
      "tableObjects"       : {
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
      "startRange"        : 0,
      "limitRange"        : 10,
      "editId"            : this.props.match.params ? this.props.match.params.id : '',
    }
    // this.getWorkspaceList   = this.getWorkspaceList.bind(this);
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
    this.getData(this.state.startRange, this.state.limitRange);
    }
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    // console.log('editId componentDidMount', this.state.editId);
    // this.getWorkspaceList();
    axios
      .get('/api/projectSettings/get/one/S3')
      .then((response)=>{
        const config = {
                          bucketName      : response.data.bucket,
                          dirName         : 'lupiniassureit',
                          region          : response.data.region,
                          accessKeyId     : response.data.key,
                          secretAccessKey : response.data.secret,
                       }
        this.setState({
          config : config
        })
      })
      .catch(function(error){
        // console.log(error);
          if(error.message === "Request failed with status code 401")
              {
                   swal("Your session is expired! Please login again.","", "error");
                   this.props.history.push("/");
              }
      })

    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      console.log("center_ID =",this.state.center_ID);
    this.getLength(this.state.center_ID);
    this.getData(this.state.startRange, this.state.limitRange,this.state.center_ID);
    });
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');

    this.setState({
      dateofsubmission :momentString,
    })
  }
  
  handleChange(event){
    event.preventDefault();
    this.setState({
        [event.target.name]: event.target.value,
        "dateofsubmission" :this.refs.dateofsubmission.value,
        "title"            :this.refs.title.value, 
        "sectorName"       :this.refs.sectorName.value, 
        "author"           :this.refs.author.value, 
       /* "caseStudy_Image"  :this.refs.caseStudy_Image.value,
        "caseStudy_File"   :this.refs.caseStudy_File.value,*/
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
  handleDocChange(event){
    if (event.currentTarget.files) {
      const data = new FormData();
      var selectedFiles = event.currentTarget.files;
      console.log("selectedFiles",selectedFiles.length);
      let i = 0;
      for ( i = 0; i < selectedFiles.length; i++ ) {
        data.append( 'file', selectedFiles[ i ],selectedFiles[ i ].name);
      // console.log("i",i);
      }
      // console.log("data",data);
      
      axios.post('/api/upload',data)

        .then( ( response ) => {
        // console.log( 'file upload res', response );
        let s3urlArray = [];
           if (response.data.data && response.data.data.length > 0) {
                for (var j = 0; j<response.data.data.length; j++) {
                    var docName = response.data.data[j].originalname;
                    var docLink = response.data.data[j].location;
                    s3urlArray.push({
                        docLink:response.data.data[j].location,
                        docName:response.data.data[j].originalname
                    });
                this.setState({
                        "docLink" : docLink,
                        "docName" : docName,
                   },()=>{
                      console.log("docName",this.state.docName,this.state.docLink);
                   })
             /*    
                   this.setState({
                        "document" : s3urlArray,
                        // "documentUpload" : false,
                        // "selectedFiles"  : null
                   },()=>{
                    // event.currentTarget.files = '';
                   })*/
                }
            }
        }).catch( ( error ) => {
        // If another error
           console.log("error",error);
            // swal("Something went wrong","Something went wrong", "error");
           //  this.setState({
           //   "documentUpload" : false,
           //   "selectedFiles"  : null
           // },()=>{
           //    // event.currentTarget.files = '';
           // })
       });
    }else{
         console.log("Please select file");
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
    event.preventDefault();
    if(this.refs.dateofsubmission.value === "" || this.refs.title.value ==="" || this.refs.sectorName.value===""
     || this.refs.author.value==="" )
    {
    if (this.validateFormReq() && this.validateForm()){
     }
    }else{
      var caseStudyValues = {
        "center_ID"        :this.state.center_ID,
        "centerName"       :this.state.centerName,
        "date"             :this.refs.dateofsubmission.value,
        "title"            :this.refs.title.value, 
        "sectorName"       :this.refs.sectorName.value, 
        "author"           :this.refs.author.value, 
      /*  "caseStudy_Image"  :this.refs.caseStudy_Image.value,
        "caseStudy_File"   :this.refs.caseStudy_File.value,*/
      };
      let fields = {};
      fields["dateofsubmission"]      = "";
      fields["title"]                 = "";
      fields["sectorName"]            = "";
      fields["author"]                = "";
      fields["caseStudy_Image"]       = "";
      fields["caseStudy_File"]        = "";
      axios.post('/api/caseStudies', caseStudyValues)
        .then((response)=>{
        console.log('response', response);
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
        "title"             :"",
        "dateofsubmission"  :"",
        "sectorName"        :"",
        "author"            :"",
        "caseStudy_Image"   :"",
        "caseStudy_File"    :"",
        fields              :fields
      });
    }    
  }

  Update(event){
    event.preventDefault();
    if(this.refs.dateofsubmission.value === "" || this.refs.title.value ==="" || this.refs.sectorName.value===""
     || this.refs.author.value==="" )
    {
    if (this.validateFormReq() && this.validateForm()){
     }
    }else{
      var caseStudyValues = {
        "caseStudy_ID"     :this.state.editId, 
        "center_ID"        :this.state.center_ID,
        "centerName"       :this.state.centerName,
        "date"             :this.refs.dateofsubmission.value,
        "title"            :this.refs.title.value, 
        "sectorName"       :this.refs.sectorName.value, 
        "author"           :this.refs.author.value, 
      /*  "caseStudy_Image"  :this.refs.caseStudy_Image.value,
        "caseStudy_File"   :this.refs.caseStudy_File.value,*/
      };
      let fields = {};
      fields["dateofsubmission"]    = "";
      fields["title"]               = "";
      fields["sectorName"]          = "";
      fields["author"]              = "";

      console.log('caseStudyValues', caseStudyValues);

      axios.patch('/api/caseStudies/update', caseStudyValues)
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
        "dateofsubmission"     :"",
        "title"                :"",
        "sectorName"           :"",
        "author"               :"",
        "caseStudy_Image"      :"",
        "caseStudy_File"       :"",
        fields                 :fields
      });
      this.props.history.push('/caseStudy');
      this.setState({
        "editId"               : "",
      });
    }    
  }

  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
    if (!fields["dateofsubmission"]) {
      formIsValid = false;
      errors["dateofsubmission"] = "This field is required.";
    }     
    if (!fields["title"]) {
      formIsValid = false;
      errors["title"] = "This field is required.";
    }
    if (!fields["sectorName"]) {
      formIsValid = false;
      errors["sectorName"] = "This field is required.";
    }
    if (!fields["author"]) {
      formIsValid = false;
      errors["author"] = "This field is required.";
    }          
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  validateForm(){
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
    this.setState({
      errors: errors
    });
    return formIsValid;
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
        "sectorName"        : editData.sectorName,
        "author"            : editData.author,
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
    axios.get('/api/caseStudies/count/'+center_ID)
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
    axios.get('/api/caseStudies/list'+center_ID,data)
    .then((response)=>{
      console.log('response', response);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
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
                      Case Study1
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="caseStudy">
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12  valid_box">
                          <label className="formLable">Date of Submission</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofsubmission" >
                            <input type="date" className="form-control inputBox toUpper" name="dateofsubmission" ref="dateofsubmission" value={this.state.dateofsubmission} onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.dateofsubmission}</div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Title</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="title" >
                            <input type="text" className="form-control inputBox " ref="title" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.title}</div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Sector</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="sectorName" >
                            <input type="text" className="form-control inputBox " ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.sectorName}</div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Author</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="author" >
                            <input type="text" className="form-control inputBox " ref="author" name="author" value={this.state.author} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.author}</div>
                        </div>
                      </div><br/>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp ">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 card border-light mb-3 mt-5">
                         {/* <div className="card-header">
                             <h3 style={{ color: '#555', marginLeft: '12px' }}>Add Images</h3>
                             <p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: 250px x 250px ( Max 2MB )</p>
                          </div>
                          <div className="card-body">
                             <p className="card-text">Please upload an image for your profile</p>
                             <input type="file" className="" multiple onChange={this.handleDocChange.bind(this)}/>
                          </div>*/}
                          <label className="formLable">Add Files</label><span className="asterix"></span>
                          <div className="clr_k ">
                            <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon">
                              <img src="/images/Upload-Icon.png"/>
                            </div>
                            <div  className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center below_text">
                             <b className="text_k11"></b>
                             <span className="under_ln"><h6>Choose Files/Images</h6></span>
                            </div>     
                             <input type="file" className="form-control click_input" multiple onChange={this.handleDocChange.bind(this)}/>
                          </div>
                          <img src={this.state.docLink}/>
                          <label className="formLable">{this.state.docName}</label>
                        </div>
                      </div>

                   {/*   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp ">
                        {
                            this.state.imgArrayWSaws===null?
                            null
                          :
                            this.state.imgArrayWSaws.map((data,index)=>{
                              return(
                                      <div key={index} className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                          <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12"> Image {index+1}</h5>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                          <div className="imgcss" >
                                            <label id={index} className="pull-right custFaTimes" title="Delete image" data-id={data.imgPath} onClick={this.deleteimageWS.bind(this)}>X</label>
                                            <img className="img-responsive" src={data.imgPath}/>
                                          </div>
                                        </div>
                                      </div>
                                    )
                            })
                        }
                        {this.state.imgArrayWSaws.length<=0?
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row padTopC">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                              <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Add  Images <span className="astrick">*</span></h5>
                             
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                              <div className="clr_k ">
                                <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon">
                                  <img src="/images/Upload-Icon.png"/>
                                </div>
                                <div  className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center below_text">
                                 <b className="text_k11"></b>
                                 <span className="under_ln"><h6>Choose  Images</h6></span>
                                </div>     
                                <input  type="file" title="Click to attach file" multiple name="userPic" onChange={this.uploadworkspaceImage.bind(this)} ref="workspaceImg"  className="form-control click_input" id="upload-file2" />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgdetails">(max size: 1 Mb, Format: JPEG, jpg, png)</div>
                          </div>
                        :
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row padTopC">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                              <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Add Images <span className="astrick">*</span></h5>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 ">
                              <div className="clr_k" style={{height:"120px"}}>
                                <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon1">
                                  <img src="/images/Upload-Icon.png"/>
                                </div>
                                <div  className= "col-lg-offset-1 col-lg-10 col-md-10 col-sm-10 col-xs-10 below_text">
                                 <b className="text_k11"></b>
                                 <span className="text-center under_ln">Choose another image</span>
                                </div>     
                                <input  type="file" title="Click to attach file" multiple name="userPic" onChange={this.uploadworkspaceImage.bind(this)} ref="workspaceImg"  className="form-control click_input" id="upload-file2" />
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp ">
                        {
                            this.state.fileArray===null?
                            null
                          :
                            this.state.fileArray.map((data,index)=>{
                              return(
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                          <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12"> Image {index+1}</h5>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                          <div className="imgcss" key={index}>
                                            <label id={index} className="pull-right custFaTimes" title="Delete image" data-id={data.filePath} onClick={this.deletefile.bind(this)}>X</label>
                                            <img className="img-responsive" src={data.filePath}/>
                                          </div>
                                        </div>
                                      </div>
                                    )
                            })
                        }
                        {this.state.fileArray.length<=0?
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row padTopC">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                              <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Add  File <span className="astrick">*</span></h5>
                             
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                              <div className="clr_k ">
                                <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon">
                                  <img src="/images/Upload-Icon.png"/>
                                </div>
                                <div  className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center below_text">
                                 <b className="text_k11"></b>
                                 <span className="under_ln"><h6>Choose File</h6></span>
                                </div>     
                                <input  type="file" title="Click to attach file" multiple name="userFile" onChange={this.uploadFile.bind(this)} ref="caseFile"  className="form-control click_input" id="upload-file" />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgdetails">(max size: 1 Mb, Format: JPEG, jpg, png)</div>
                          </div>
                        :
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row padTopC">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                              <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Add Files <span className="astrick">*</span></h5>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 ">
                              <div className="clr_k" style={{height:"120px"}}>
                                <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon1">
                                  <img src="/images/Upload-Icon.png"/>
                                </div>
                                <div  className= "col-lg-offset-1 col-lg-10 col-md-10 col-sm-10 col-xs-10 below_text">
                                 <b className="text_k11"></b>
                                 <span className="text-center under_ln">Choose another File</span>
                                </div>     
                                <input  type="file" title="Click to attach file" multiple name="userFile" onChange={this.uploadFile.bind(this)} ref="caseFile"  className="form-control click_input" id="upload-file" />
                              </div>
                            </div>
                          </div>
                        }
                      </div>*/}
                                   
                      
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
export default CaseStudy