import React, { Component } from 'react';
import XLSX from "xlsx";
import './BulkUpload.css';
import axios from 'axios';
import swal  from 'sweetalert';

class BulkUpload extends Component{
	constructor(props) {
    super(props);
    this.state = {
    	"inputFileData" : [],
    }
    this.fileInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleFile   = this.handleFile.bind(this);
  } 
  handleChange(e) { 
    const files = e.target.files;
    if (files && files[0]){ 
      var fileName = files[0].name;
      var ext = fileName.split('.').pop();
      if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
         this.handleFile(files[0]);
      }else{
        this.fileInput.value = '';
        // swal('Invalid file format.');
      }
    }
  }
  handleFile(file) {
    // console.log("this.fileInput",this.fileInput.value);
   const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = ({ target: { result } }) => {
      const wb = XLSX.read(result, { type: rABS ? "binary" : "array" });
      // console.log("wb",wb);
      const wsname = wb.SheetNames[0];
      // console.log("wsname",wsname);
      const ws = wb.Sheets[wsname];
      // console.log("ws",ws);
      const data = XLSX.utils.sheet_to_json(ws, { header: 0 }); 
      // console.log("data",data);
      var inputFileData = this.state.inputFileData.concat(...data);
      this.setState({inputFileData:inputFileData},()=>{
        this.fileInput.value = '';
        console.log("inputFileData",this.state.inputFileData);
        var formValues ={
        	"data" : this.state.inputFileData,
          "reqdata" : this.props.data
        }
         axios
        .post(this.props.url,formValues)
        .then((response)=> {
        	if (response) {
            console.log("response",response);
            if (response.data.uploadedData) {
              this.props.uploadedData(response.data.uploadedData);
            }
        		this.setState({
        			"inputFileData" : []
        		})
            swal(response.data.message);
        	}
         })
        .catch((error)=> {  
           this.setState({
    			"inputFileData" : []
    		})       
        })
      });
    };
    if (rABS) reader.readAsBinaryString(file);   
    else reader.readAsArrayBuffer(file);
  }

  render() {
  	 const SheetJSFT = [
      "xlsx",
      "xls",
      "csv"
    ]
    return (
    	 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
	          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
	            <a href="#" download>
		            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
	            </a>
	          </div>
	          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
	            <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              <li>Please use attached file format to bulkupload file into this system.</li>
	              <li>Please do not change the Heading of following file.</li>
	              <li>File format must be .csv or .xlsx or .xls.</li>
	            </ul>
	          </div>
	        </div>
	        <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-4 col-xs-offset-4 bulkuploadFileouter">
	            <input
			          ref={el => this.fileInput = el}
			          type="file"
	                  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"
			          accept={SheetJSFT}
			          onChange={this.handleChange}
			        />
	        </div>
    	</div>
    )
  }
}
export default BulkUpload;