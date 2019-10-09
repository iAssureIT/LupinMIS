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

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class CaseStudy extends Component{

  constructor(props){
    super(props);
    this.state = {
      "center_ID"         :"",
      "centerName"        :"",
      "title"             :"",
      "dateofsubmission"  :"",
      "sector"            :"",
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
    this.getWorkspaceList   = this.getWorkspaceList.bind(this);
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
    // console.log('editId componentDidMount', this.state.editId);
    this.getWorkspaceList();
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
        console.log(error);
          if(error.message === "Request failed with status code 401")
              {
                   swal("Your session is expired! Please login again.","", "error");
                   this.props.history.push("/");
              }
      })

    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      console.log("center_ID =",this.state.center_ID);
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
    });
  }

  getLength(){
    axios.get('/api/caseStudies/count')
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

  getData(startRange, limitRange){ 
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.get('/api/caseStudies/list',data)
    .then((response)=>{
      console.log('response', response);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
  }

  getWorkspaceList(){
    // var object;
    var array = [];
    axios.get('/api/caseStudies/list')
    .then((response)=> {
      // console.log("Response 1 =",response.data);
        this.setState({
          dataArray : response.data
        },()=>{
          // this.getseats();
        })
      // console.log("get---------response",response.data);
      if(response.data=="Workspace Details not found" || response.data==[]){
        this.setState({
          workSpaceList : []
        })
      }else{
        this.setState({
          workSpaceList : response.data
        })
      }  
    })
    .catch(function (error) {
      console.log(error);
    if(error.message === "Request failed with status code 401")
          {
            swal("Your session is expired! Please login again.","", "error");
            this.props.history.push("/");
          }
    })
  }

  uploadworkspaceImage(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile = new File([file],newFileName);
      // console.log("file",newFile);
      if (newFile) {
      // console.log("config--------------->",this.state.config);
        var ext = newFile.name.split('.').pop();
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                // console.log("Data = ",Data);
                  var obj1={
                    imgPath : Data.location,
                  }
                  var imgArrayWSaws = this.state.imgArrayWSaws;
                  imgArrayWSaws.push(obj1);
                  this.setState({
                    // workspaceImages : imgArrayWSaws
                    imgArrayWSaws : imgArrayWSaws
                  })
              })
              .catch((error)=>{
                console.log("formErrors");
                console.log(error);
              })
          }else{         
            swal("Image not uploaded","Something went wrong"); 
          }
        }else{
          swal("Please upload Image","Only Upload Images format (jpg,png,jpeg)");  
        }
      }
    }
  }

  deleteimageWS(e){
    e.preventDefault();
    var index = e.target.getAttribute('id');
    var filePath = e.target.getAttribute('data-id');
    var data = filePath.split("/");
    var imageName = data[4];
    // console.log("imageName==",imageName);
    if(index){
      swal({
        title: "Are you sure you want to delete this image?",
        text: "Once deleted, you will not be able to recover this image!",
       /* icon: "warning",*/
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var array = this.state.imgArrayWSaws; // make a separate copy of the array
          array.splice(index, 1);
          swal("abc", "Image deleted successfully");
          this.setState({
            imgArrayWSaws: array
          });
        }else {
          swal("Are you sure you want to delete this image?","Your image is safe!");
        }
      });
    }
  }

  deleteItem(event){
    event.preventDefault();
    // console.log('innnnn.....')
    var id = event.target.getAttribute('data-id');
    if(id){
      swal({
        title: "Are you sure you want to delete this workspace?",
        text: "Once deleted, you will not be able to recover this Image!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
            axios
              .delete('/api/workspaceDetails/delete/'+id)
              .then((response)=> {
                if(response.data=='workspace deleted'){
                  swal("Workspace deleted successfully");
                  this.props.history.push('/addWorkspace');
                  window.location.reload();
                  this.getWorkspaceList();
                  // $('#myModal'+this.state.deleteId).css('display','none');                  
                }
              })
              .catch(function (error) {
                  console.log(error);
                    if(error.message === "Request failed with status code 401")
                      {
                           swal("Your session is expired! Please login again.","", "error");
                           this.props.history.push("/");
                      }
              });
        } else {
          swal("Your information is safe!");
        }
      });
    }
  }

  uploadFile(event){
   event.preventDefault();
   let self = this;
   if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile = new File([file],newFileName);
      // console.log("file",newFile);
      if (newFile) {
      // console.log("config--------------->",this.state.config);
        var ext = newFile.name.split('.').pop();
        if(ext=="DOC" || ext=="DOCX" || ext=="PDF" || ext=="XLS" || ext=="XLSX"  || ext=="PPT" || ext=="PPTX" || ext=="TXT"|| 
          ext=="doc" || ext=="docx" || ext=="pdf" || ext=="xls" || ext=="xlsx" || ext=="ppt" || ext=="pptx" || ext=="txt"){ 
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                console.log("Data = ",Data);
                  var obj1={
                    filePath : Data.location,
                  }
                  var fileArray = this.state.fileArray;
                  fileArray.push(obj1);
                  this.setState({
                    fileArray : fileArray
                  })
              })
              .catch((error)=>{
                console.log("formErrors");
                console.log(error);
              })
          }else{         
            swal("File not uploaded","Something went wrong"); 
          }
        }else{
          swal("Please upload file","Only Upload  File format (jpg,png,jpeg)");  
        }
      }
    }
  }

  deletefile(e){
    e.preventDefault();
    var index = e.target.getAttribute('id');
    var filePath = e.target.getAttribute('data-id');
    var data = filePath.split("/");
    var imageName = data[4];
    console.log("imageName==",imageName);
    if(index){
      swal({
        title: "Are you sure you want to delete this File?",
        text: "Once deleted, you will not be able to recover this File!",
        // icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var array = this.state.fileArray; // make a separate copy of the array
          array.splice(index, 1);
          swal("Image deleted successfully");
          this.setState({
            fileArray: array
          });
        }else {
          swal("Your File is safe!");
        }
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
                      Case Study
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
                        {
                            this.state.imgArrayWSaws==null?
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
                            this.state.fileArray==null?
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
                      </div>
                                   
                      
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