import React, { Component }   from 'react';
// import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
// import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';
import "./AddFile.css";

class AddFile extends Component{

  constructor(props){
    super(props);
    this.state = {
      "config"            :"",
      "author"            :"",
      "caseStudy_Image"   :"",
      logo                :"",
      "caseStudy_File"    :"",
      "configData"        : props && props.configData ? props.configData : {},        
      "fileArray"         : props && props.fileArray ? props.fileArray : {},        
      "fileType"          : props && props.fileType ? props.fileType : {},        
      filenames            : [],
      filename             : "",
      // fileArray           : [],
    }
  }
  
  componentWillReceiveProps(nextProps){
   
  }
  
  componentDidMount() {
    var configData =  this.props.configData;
    var fileType   =  this.props.fileType;
    this.setState({
      fileType : fileType
    },()=>{/*console.log("fileType",this.state.fileType)*/})
    axios
      // .get('http://cofficapi.iassureit.com/api/projectSettings/single/S3')
      .get('/api/projectSettings/get/one/S3')
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
      })
  }
  
  handleChange(event){
    event.preventDefault();
  }

  uploadLogoImage(event){
   event.preventDefault();
    var index = event.target.getAttribute('id');
    // console.log("index--------------->",index);
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile = new File([file],newFileName);
      console.log("file",newFile);
      if (newFile) {
      // console.log("config--------------->",this.state.config);
        var ext = newFile.name.split('.').pop();
        if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){ 
          if (newFile) {
            if(this.state.logo===""){
              S3FileUpload
                .uploadFile(newFile,this.state.config)
                .then((Data)=>{
                  var fileName = file.name;
                  this.setState({
                    fileName : fileName,
                    logo : Data.location
                  },()=>{
                    this.props.getLogo(this.state.logo, this.state.fileName);
                    console.log("fileName = ",this.state.fileName);
                    
                  })
                  this.deleteimageLogo(index)
                })
                .catch((error)=>{
                  // console.log("formErrors");
                  console.log(error);
                })
            }else{
              swal({
                    title: "Are you sure you want to replace this image?",
                    text: "Once replaced, you will not be able to recover this image!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((success) => {
                      if (success) {
                        S3FileUpload
                          .uploadFile(newFile,this.state.config)
                          .then((Data)=>{
                            // console.log("Data = ",Data);
                            this.setState({
                              logo : Data.location
                            },()=>{
                              var logo = JSON.stringify(this.state.logo);
                              this.props.getLogo(this.state.logo);
                            })
                            this.deleteimageLogo(index)
                          })
                          .catch((error)=>{
                            console.log("formErrors");
                            console.log(error);
                          })
                      } else {
                      swal("Your information is safe!");
                    }
                  });
            }         
          }else{         
            swal("File not uploaded","Something went wrong",); 
          }    
        }else{
          swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)");  
        }
      }
    }
  }

  deleteimageLogo(index){
    var data = index.split("/");
    var imageName = data[4];
    // console.log("index1--------------->",imageName);
      if(index){
        S3FileUpload
          .deleteFile(imageName,this.state.config)
          .then((response) =>{
            // console.log("Deletedddd...",response)
            swal("abc","Image deleted successfully");
          })
          .catch((err) => {
            console.error("Not-Deletedddd...",err)
          })
      }
  }
 
  deleteimagelogoDirect(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this image?",
          text: "Once deleted, you will not be able to recover this image!",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("abc","Your image is deleted!");
              this.setState({
                logo : ""
              })
            } else {
            swal("abc","Your image is safe!");
          }
        });
  }

  render() {
    // console.log("fileArray",this.state.fileArray)
    return (

      <div className="">
        <div className="">
          {this.state.logo===""?
            <div className="row padTopC">
              <div className="row  col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h5 className="formLable col-lg-12 col-md-12 col-sm-12 col-xs-12">Add Logo <span className="astrick">*</span></h5>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="clr_k ">
                  <div className="col-lg-offset-1 col-lg-2 col-md-12 col-sm-12 col-xs-12 hand_icon move_hand_icon">
                    <img alt="upload" src="/images/Upload-Icon.png"/>
                  </div>
                  <div  className= "col-lg-offset-2 col-lg-10 col-md-10 col-sm-10 col-xs-10 below_text">
                   <b className="text_k11"></b>
                   <span className="under_ln formLable">Choose Your Logo</span>
                  </div>     
                  <input  type="file" title="Click to attach file" multiple name="userPic" onChange={this.uploadLogoImage.bind(this)} ref="logoImage"  className="form-control click_input" id="upload-file2" />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgdetails">(Max size: 1 Mb, Format: JPEG, jpg, png)</div>
            </div>
            :null}
          {this.state.logo===""?
            null
          :
            <div className=" padTopC">
              <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
{/*                <h5 className="formLable col-lg-12 col-md-12 col-sm-12 col-xs-12 row">Logo <span className="astrick">*</span></h5>*/}
              </div>
              <div className="containerC row">
                <label id="logoImage" className="custFaTimes1" title="Delete image" onClick={this.deleteimagelogoDirect.bind(this)}><i className="fa fa-times"></i></label>
                <img src={this.state.logo} alt="logo_Lupin" className=" imageC row"/>
                {/*<div className="middleC">
                    <div className="textC">
                      <input type="file" title="Click to change the photo" name="userPic" id={this.state.logo} onChange={this.uploadLogoImage.bind(this)} ref="logoImage" className="form-control click_input" />
                      <i className="fa fa-camera fa-2x"></i>
                    </div>
                  </div>*/}
              </div>
              {/*<div className="imgdetails">(Max size: 1 Mb, Format: JPEG, jpg, png)</div>*/}
            </div>
          }                 
        </div>
      </div>   
    );
  }
}
export default AddFile