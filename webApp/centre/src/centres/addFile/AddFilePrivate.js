import React, { Component } from 'react';
import axios from 'axios';
// import swal                   from 'sweetalert';
import $ from 'jquery';
import "./AddFile.css";

class AddFile extends Component{

  constructor(props){
    super(props);
    this.state = {
      selectedFile: null,
      selectedFiles: null
    }
  }
  
  componentWillReceiveProps(nextProps){
   
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
  }
/*  singleFileChangedHandler( event ){
      // console.log("event.target.files",event.target.files[0])
    this.setState({
     selectedFile: event.target.files[0]
    },()=>{
          console.log("DIdselectedFile",this.state.selectedFile);

    });
  };*/
  handleDocChange(event){
    if (event.currentTarget.files) {
      const data = new FormData();
      var selectedFiles = event.currentTarget.files;
      // console.log("selectedFiles",selectedFiles.length);
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
                    s3urlArray.push({
                        docLink:response.data.data[j].location,
                        docName:response.data.data[j].originalname
                    });

             /*      console.log(response.data.data);
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
/*
  singleFileUploadHandler(event){
    const data = new FormData();
      // If file selected
          console.log("selectedFile",this.state.selectedFile);

    if ( this.state.selectedFile ) {
      console.log("selectedFile",this.state.selectedFile)
      data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
      axios.post( '/api/upload', data, {
        headers: {
         'accept': 'application/json',
         'Accept-Language': 'en-US,en;q=0.8',
         'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
      })
      .then( ( response ) => {
          console.log("response",response.data);
        if ( 200 === response.status ) {
          // If file size is larger than expected.
          if( response.data.error ) {
            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
              this.ocShowAlert( 'Max size: 2MB', 'red' );
            } else {
              console.log( response.data );
               // If not the given file type
                this.ocShowAlert( response.data.error, 'red' );
            }
          } else {
           // Success
           let fileName = response.data;
           console.log( 'fileName', fileName );
           this.ocShowAlert( 'File Uploaded', '#3089cf' );
          }
        }
      }).catch( ( error ) => {
          console.log( 'singleerror', error );
        // If another error
        this.ocShowAlert( error, 'red' );
      });
    } else {
     // if file not selected throw error
     this.ocShowAlert( 'Please upload file', 'red' );
    }
  };*/
  multipleFileChangedHandler(event){
    this.setState({
     selectedFiles: event.target.files
    });
    console.log( event.target.files );
  };

  multipleFileUploadHandler(event){
    const data = new FormData();
    let selectedFiles = this.state.selectedFiles;
    // If file selected
      if ( selectedFiles ) {
       for ( let i = 0; i < selectedFiles.length; i++ ) {
        data.append( 'galleryImage', selectedFiles[ i ], selectedFiles[ i ].name );
       }
      axios.post( '/api/upload', data, {
        headers: {
         'accept': 'application/json',
         'Accept-Language': 'en-US,en;q=0.8',
         'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
      })
        .then( ( response ) => {
          // console.log( 'res', response );
          if ( 200 === response.status ) {
            // If file size is larger than expected.
            if( response.data.error ) {
              if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                this.ocShowAlert( 'Max size: 2MB', 'red' );
              } else if ( 'LIMIT_UNEXPECTED_FILE' === response.data.error.code ){
                this.ocShowAlert( 'Max 4 images allowed', 'red' );
              } else {
                // If not the given ile type
                this.ocShowAlert( response.data.error, 'red' );
              }
            } else {
             // Success
                let fileName = response.data;
                // console.log( 'fileName', fileName );
                this.ocShowAlert( 'File Uploaded', '#3089cf' );
            }
          }
        }).catch( ( error ) => {
          // If another error
          console.log( 'multierror', error );
          this.ocShowAlert( error, 'red' );
        });
      } else {
        // if file not selected throw error
        this.ocShowAlert( 'Please upload file', 'red' );
      }
    };
// ShowAlert Function
  ocShowAlert = ( message, background = '#3089cf' ) => {
    let alertContainer = document.querySelector( '#oc-alert-container' ),
    alertEl = document.createElement( 'div' ),
    textNode = document.createTextNode( message );
    alertEl.setAttribute( 'class', 'oc-alert-pop-up' );
    
    $( alertEl ).css( 'background', background );
    alertEl.appendChild( textNode );
    alertContainer.appendChild( alertEl );
    setTimeout( function () {
      $( alertEl ).fadeOut( 'slow' );
      $( alertEl ).remove();
    }, 3000 );
  };
  render() {     
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp ">
          <div className="container">
          {/* For Alert box*/}
             <div id="oc-alert-container"></div>
            {/* For Alert box*/}
            <div id="oc-alert-container"></div>
              {/* Single File Upload*/}
              <div className="card border-light mb-3 mt-5" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
                <div className="card-header">
                   <h3 style={{ color: '#555', marginLeft: '12px' }}>Single Image Upload</h3>
                   <p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: 250px x 250px ( Max 2MB )</p>
                </div>
                <div className="card-body">
                   <p className="card-text">Please upload an image for your profile</p>
                   <input type="file" multiple onChange={this.handleDocChange}/>
                   <div className="mt-5">
                    <button className="btn btn-info" onClick={this.singleFileUploadHandler}>Upload!</button>
                   </div>
                </div>
              </div>
              {/* Multiple File Upload */}
              <div className="card border-light mb-3" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
                <div className="card-header">
                 <h3 style={{ color: '#555', marginLeft: '12px' }}>Upload Muliple Images</h3>
                 <p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: 400px x 400px ( Max 2MB )</p>
                </div>
                <div className="card-body">
                 <p className="card-text">Please upload the Gallery Images for your gallery</p>
                 <input type="file" multiple onChange={this.multipleFileChangedHandler}/>
                 <div className="mt-5">
                  <button className="btn btn-info" onClick={this.multipleFileUploadHandler}>Upload!</button>
                 </div>
                </div>
              </div>
          </div>            
        </div>
      </div>    
    );
  }
}
export default AddFile