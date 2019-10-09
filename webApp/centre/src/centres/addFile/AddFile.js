import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';
import "./AddFile.css";

class AddFile extends Component{

  constructor(props){
    super(props);
    this.state = {
      "config"            :"",
      "author"            :"",
      "caseStudy_Image"   :"",
      "caseStudy_File"    :"",
      "configData"        : props && props.configData ? props.configData : {},        
      fileArray           : [],
    }
    // console.log('editId' , this.state.editId);
  }
  
  componentWillReceiveProps(nextProps){
   
  }
  
  componentDidMount() {
    // console.log('editId componentDidMount', this.state.editId);
    var configData =  this.props.configData;
    var fileType = configData.fileType;
    this.setState({
      fileType : fileType
    // },()=>{console.log("fileType",this.state.fileType)})
    axios
      .get('http://cofficapi.iassureit.com/api/projectSettings/get/one/S3')
      .then((response)=>{
          // console.log("response",response);
       
        const config = {
                          bucketName      : response.data.bucket,
                          dirName         : configData.dirName,
                          region          : response.data.region,
                          accessKeyId     : response.data.key,
                          secretAccessKey : response.data.secret,
                       }
        this.setState({
          config : config
        },()=>{
          // console.log("config",this.state.config)
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
  }
  
  handleChange(event){
    event.preventDefault();
  }

  uploadImage(event){
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
            swal("Image not uploaded","Something went wrong"); 
          }
        }else{
          swal("Please upload Image","Only Upload Images format (jpg,png,jpeg)");  
        }
      }
    }
  }

  uploadFile(event){
   event.preventDefault();
   let self = this;
   if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file        = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile     = new File([file],newFileName);
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
                // console.log("Data = ",Data);
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

  deleteImage(e){
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
          var array = this.state.fileArray; // make a separate copy of the array
          array.splice(index, 1);
          swal("abc", "Image deleted successfully");
          this.setState({
            fileArray: array
          });
        }else {
          swal("Are you sure you want to delete this image?","Your image is safe!");
        }
      });
    }
  }

  deleteItem(event){
    event.preventDefault();
    // console.log('innnnn.....');
    var configData =  this.props.configData;
    var id = event.target.getAttribute('data-id');
    if(id){
      swal({
        title: "Are you sure you want to delete this File?",
        text: "Once deleted, you will not be able to recover this File!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
            axios({
                method: configData.deleteMethod,
                url   : configData.apiLink+id
            }).then((response)=> {
                if(response.data=='workspace deleted'){
                  swal("Workspace deleted successfully");
                  this.props.history.push(configData.pageURL);
                  window.location.reload();
                  
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

  render() {     
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp ">
          {
              this.state.fileArray==null?
              null
            :
              this.state.fileArray.map((data,index)=>{
                return(
                        <div key={index} className="col-lg-4 col-md-4 col-sm-12 col-xs-12 row">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                            <h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12"> Image {index+1}</h5>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <div className="imgcss" >
                              <label id={index} className="pull-right custFaTimes" title="Delete image" data-id={data.imgPath} onClick={this.deleteImage.bind(this)}>X</label>
                              <img className="img-responsive" src={data.imgPath}/>
                            </div>
                          </div>
                        </div>
                      )
              })
          }
          {this.state.fileArray.length<=0?
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
                  <input  type="file" title="Click to attach file" multiple name="userPic" onChange={this.state.fileType === "Image" ? this.uploadImage.bind(this) : this.uploadFile.bind(this)} ref="workspaceImg"  className="form-control click_input" id="upload-file2" />
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
                  <input  type="file" title="Click to attach file" multiple name="userPic" onChange={this.uploadImage.bind(this)} ref="workspaceImg"  className="form-control click_input" id="upload-file2" />
                </div>
              </div>
            </div>
          }
        </div>
      </div>    
    );
  }
}
export default AddFile